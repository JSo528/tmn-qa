NODE_ENV=production pm2 start app.js --log-date-format "YYYY-MM-DD HH:mm Z"
pm2 start jobs/cron.js