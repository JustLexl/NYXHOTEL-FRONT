module.exports = {
  apps: [
    {
      name: "nyx-front",
      script: "./node_modules/@angular/cli/bin/ng.js",
      cwd: "C:/Users/Sistemas/Downloads/NYXHOTEL-FRONT-main/NYXHOTEL-FRONT-main",
      args: "serve --host 192.168.8.126 --port 4200",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "5s",
      error_file: "C:/Users/Sistemas/.pm2/logs/nyx-front-error.log",
      out_file: "C:/Users/Sistemas/.pm2/logs/nyx-front-out.log"
    },
    {
      name: "nyx-back",
      script: "./dist/index.js",
      cwd: "C:/Users/Sistemas/Downloads/NYXHOTEL-BACK-main/NYXHOTEL-BACK-main",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "5s",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "192.168.8.126"
      },
      error_file: "C:/Users/Sistemas/.pm2/logs/nyx-back-error.log",
      out_file: "C:/Users/Sistemas/.pm2/logs/nyx-back-out.log"
    }
  ]
};