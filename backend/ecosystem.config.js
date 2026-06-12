module.exports = {
  apps : [{
    name: 'vpn-backend',
    script: 'dist/main.js',
    cwd: '/home/cheng/Project/vpn-service/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://admin:admin1234@localhost:5432/vpn_db',
      REDIS_URL: 'redis://localhost:6379'
    },
    error_file: '~/.pm2/logs/vpn-backend-error.log',
    out_file: '~/.pm2/logs/vpn-backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]};
