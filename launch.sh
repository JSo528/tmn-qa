Xvfb :99 -screen 0 1920x3000x8 -ac 2>&1 >/dev/null & export DISPLAY=:99;
NODE_ENV=production pm2 start app.js --log-date-format "YYYY-MM-DD HH:mm Z"
NODE_ENV=production pm2 start jobs/cron.js --log-date-format "YYYY-MM-DD HH:mm Z"