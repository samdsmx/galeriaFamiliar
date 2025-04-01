# 📷 Galería Publica

Este proyecto genera automáticamente una galería web con enlaces a álbumes compartidos de **Google Photos**, mostrando miniaturas y títulos. Ideal para compartir tu colección publica desde una sola página.

---

## 🚀 Características

- Obtiene automáticamente:
  - Título del álbum
  - Link compartido
  - Miniatura (`og:image` como lo hacen redes sociales)
- Carga dinámica con HTML y JavaScript
- Totalmente estático (funciona con GitHub Pages)
- Estilo de tarjetas tipo Material Design

---

## ⚡ Requisitos

- Node.js >= 18
- Una cuenta de Google con álbumes compartidos

---

## 🎓 Paso a paso para configurar

### 1. Clona el repositorio

```bash
git clone https://github.com/samdsmx/galeriaPublica.git
cd galeriaPublica
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Crea credenciales en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea un nuevo proyecto (si no tienes uno)
3. Habilita la **Google Photos Library API**
4. Crea credenciales **OAuth 2.0 para app de escritorio**
5. Copia el **Client ID** y **Client Secret**

### 4. Crea `scripts/oauth-config.js`

```js
module.exports = {
  clientId: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/oauth2callback'
};
```

Agrega este archivo a `.gitignore`.

---

## 📅 Autenticación y tokens

### 5. Obtén tu `token.json`

Ejecuta el siguiente script para obtener el token de acceso:

```bash
node scripts/getToken.js
```

Esto abrirá un navegador para autorizar tu app de Google y guardará `token.json`.

> Este archivo contiene tus credenciales y no debe subirse al repositorio.

### 6. Obtén cookies de sesión

1. Abre Chrome o Edge y entra a [https://photos.google.com/albums](https://photos.google.com/albums)
2. Instala la extensión [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)
3. Exporta las cookies en formato JSON
4. Guarda ese archivo como:

```
scripts/cookies.json
```

---

## 🛠️ Generar `albums.json`

```bash
npm run generar
```

Este comando ejecutará `scripts/generarAlbums.js`, que:

- Usa Puppeteer para abrir Google Photos con tus cookies
- Obtiene las miniaturas simulando un bot de red social (usando `og:image`)
- Usa la API para obtener miniaturas y títulos cuando og:image no este disponible
- Genera `docs/albums.json`


---

## 👀 Ver localmente

Puedes previsualizar tu sitio con un servidor local:

```bash
npm run preview
```

Esto sirve la carpeta `docs/` en `http://localhost:3000`

---

## 🏙️ Estructura del proyecto

```plaintext
galeriaPublica/
├── docs/                 # Carpeta servida por GitHub Pages
│   ├── index.html
│   ├── albums.json
│   └── material-cards.css
│
├── scripts/              # Lógica backend / generadora
│   ├── updateAlbums.js
│   ├── getToken.js
│   ├── oauth-config.js          # Ignorado por git
│   ├── oauth-config.example.js
│   ├── token.json               # Ignorado por git
│   └── cookies.json             # Ignorado por git
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🚫 Archivos ignorados

Tu archivo `.gitignore` debe contener:

```gitignore
node_modules/
package-lock.json
user_data/

scripts/token.json
scripts/oauth-config.js
scripts/cookies.json

.vscode/
.DS_Store
*.log
```

---

## 🔗 Publicar en GitHub Pages

1. Ve a **Settings > Pages** de tu repositorio
2. Selecciona la rama `main` y carpeta `/docs`
3. Tu sitio estará disponible en:

```
https://<TU_USUARIO>.github.io/galeriaPublica/
```

---

## 📝 Licencia

MIT

---

## ✉️ Autor

[@samdsmx](https://github.com/samdsmx)

## ☕ Apóyame

Si este proyecto te fue útil y quieres invitarme un café:

[![Buy Me a Coffee](https://img.shields.io/badge/☕-Buy%20me%20a%20coffee-yellow?style=flat&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/samdsmxs)
