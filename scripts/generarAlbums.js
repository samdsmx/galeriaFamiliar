const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const axios = require('axios');
const cheerio = require('cheerio');

async function obtenerThumbnailDesdeOG(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1'
      }
    });
    const $ = cheerio.load(res.data);
    const image = $('meta[property="og:image"]').attr('content');
    return image || '';
  } catch (err) {
    console.error(`❌ Error obteniendo thumbnail para ${url}`);
    return '';
  }
}

async function obtenerDatosDesdeCrawler() {
  const cookies = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cookies.json'), 'utf8'));

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.goto('https://photos.google.com/albums', { waitUntil: 'networkidle2' });

  console.log('\n📷 Inicia sesión si es necesario y asegúrate de ver todos los álbumes. Luego presiona ENTER aquí...');
  await new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question('', () => {
      readline.close();
      resolve();
    });
  });

  const crawledAlbums = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a.MTmRkb[data-shared="true"]'));

    return anchors.map(a => {
      const href = a.getAttribute('href');
      const url = new URL(href, 'https://photos.google.com').href;
      const title = a.querySelector('.mfQCMe')?.innerText.trim() || 'Sin título';
      return { title, url, href };
    });
  });

  await browser.close();
  return crawledAlbums;
}

async function obtenerMiniaturasDesdeAPI() {
  const { clientId, clientSecret, redirectUri } = require('./oauth-config');
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);


  const token = JSON.parse(fs.readFileSync(path.resolve(__dirname,'token.json'), 'utf8'));
  oauth2Client.setCredentials(token);
  const headers = await oauth2Client.getRequestHeaders();

  let allAlbums = [];
  let pageToken = null;

  do {
    const res = await axios.get('https://photoslibrary.googleapis.com/v1/albums', {
      headers,
      params: {
        pageSize: 50,
        pageToken,
      },
    });

    const albums = res.data.albums || [];
    pageToken = res.data.nextPageToken;

    albums.forEach(album => {
      allAlbums.push({
        title: album.title.trim(),
        thumbnail: album.coverPhotoBaseUrl,
        data: album,
      });
    });
  } while (pageToken);

  return allAlbums;
}

(async () => {
  const crawled = await obtenerDatosDesdeCrawler(); // [{ title, url }]
  const fromAPI = await obtenerMiniaturasDesdeAPI(); // [{ title, thumbnail }]

  const albums = [];
  for (const album of crawled) {
    let thumbnail = await obtenerThumbnailDesdeOG(album.url);
    if (!thumbnail) {
      console.log(`⚠️ No se pudo obtener thumbnail para ${album.title} Intentando con el API...`);
      const match = fromAPI.find(a => a.title === album.title);
      thumbnail = match?.thumbnail;
    }
    albums.push({
      title: album.title,
      url: album.url,
      thumbnail,
    });
    console.log(`✅ ${album.title}`);
  }

  const outputPath = path.resolve(__dirname, '../docs/albums.json');
  fs.writeFileSync(outputPath, JSON.stringify(albums, null, 2));
  console.log(`✅ ${albums.length} álbumes combinados y guardados en albums.json`);
})();
