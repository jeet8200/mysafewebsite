# 🚀 Netlify Relay (website speed)



---

## 🌐 Demo

```
https://your-site.netlify.app
```

---

## ✨ Features


---

## 📦 Project Structure

```
.
├── netlify/
│   └── edge-functions/
│       └── relay.js
├── public/
│   └── index.html
├── netlify.toml
├── package.json
```

---

## ⚙️ Environment Variable

You MUST set:

```
TARGET_DOMAIN=https://example.com
```

---

## 🚀 Deploy (Netlify UI)

1. Go to https://app.netlify.com
2. Click **Add new project**
3. Import your GitHub repository
4. Set:

```
Build command: npm run build
Publish directory: public
```

5. Add Environment Variable:

```
TARGET_DOMAIN=https://your-domain.com
```

6. Deploy 🎉

---

## 💻 Deploy via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## 🧪 Testing

Open:

```
https://your-site.netlify.app
```

All requests will be forwarded to your target domain.


* Use only with domains you own or have permission for
* Misuse may violate service policies

MIT License © amirs
