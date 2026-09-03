module.exports = {
  apps: [
    {
      name: "dr-amr-elshamy-site",
      script: "node_modules/vinext/dist/cli.js",
      args: "start",
      cwd: "/var/www/dr-amr-elshamy-site",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      error_file: "/var/log/pm2/dr-amr-elshamy-error.log",
      out_file: "/var/log/pm2/dr-amr-elshamy-out.log",
      time: true,
    },
  ],
};
