// pm2 process file for the CloudPanel site user. Start with:  pm2 start deploy/ecosystem.config.js && pm2 save
// CloudPanel's Nginx vhost proxies allsaints.unikcorp.org -> 127.0.0.1:3002 (the Next.js app).
// Next.js then forwards /api and /uploads to the Express backend on BACKEND_URL.
const base = '/home/unikcorp-allsaints/htdocs/allsaints.unikcorp.org';
module.exports = {
  apps: [
    {
      name: 'allsaints-api',
      cwd: `${base}/Allsaints-backend`,
      script: 'server.js',
      env: { NODE_ENV: 'production', PORT: 5050 },
      max_memory_restart: '300M',
    },
    {
      name: 'allsaints-web',
      cwd: `${base}/Allsaints-frontend`,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      env: { NODE_ENV: 'production', BACKEND_URL: 'http://127.0.0.1:5050' },
      max_memory_restart: '700M',
    },
  ],
};
