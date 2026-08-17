# CustoMix3D — Local Admin

## Admin login (local, pre-Firebase)

URL: `/admin/login`

```
Email: admin@customix3d.com
Password: admin123
```

## Maintenance mode

- Controlled from **Admin → Settings** or the sidebar toggle
- When ON: store visitors see maintenance page
- Admin routes always work
- Production Vercel stays on static maintenance until full React deploy

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 and http://localhost:5173/admin/login

## Next

- Firebase Auth / Firestore
- Payment gateway
- Nimbus Post
