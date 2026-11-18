# Deploy checklist (Hostinger VPS, Ubuntu)

1. DNS: A record `allsaints` -> VPS IP. Install nginx, mysql, node 20, pm2, certbot.
2. Copy `Allsaints-backend` and `Allsaints-frontend` to `/var/www/allsaints/` (skip node_modules, .next, .git, *.zip).
3. MySQL: create DB + user, then `mysql allsaints_school_db < Allsaints-backend/database.sql`.
4. Backend: `cp .env.example .env`, fill DB_* and FRONTEND_URL, and set a real JWT_SECRET:
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   (the server refuses to start in production with a weak/sample secret).
   `npm install --omit=dev`
5. Frontend: `cp .env.production.example .env.production`, then `npm install && npm run build`.
6. `pm2 start deploy/ecosystem.config.js && pm2 save && pm2 startup`
7. Nginx: copy `deploy/nginx-allsaints.conf` to `/etc/nginx/sites-available/allsaints`, symlink into sites-enabled,
   `nginx -t && systemctl reload nginx`, then `certbot --nginx -d allsaints.unikcorp.org`.
8. Change the admin password (the seeded one is public in the old repo). Generate a hash:
   `node -e "console.log(require('bcryptjs').hashSync('NEW_STRONG_PASSWORD',10))"` (run in Allsaints-backend)
   then `UPDATE admin_users SET password_hash='<hash>' WHERE username='admin';`
