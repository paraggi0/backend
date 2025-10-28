module.exports = {
  apps: [{
    name: 'backend-api',
    cwd: '/home/saktiegi08/backend',
    script: './venv/bin/python',
    args: '-m uvicorn app.main:app --host 0.0.0.0 --port 8000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/backend-error.log',
    out_file: './logs/backend-out.log',
    log_file: './logs/backend-combined.log',
    time: true
  }, {
    name: 'command-service',
    cwd: '/home/saktiegi08/backend/node',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '../logs/command-error.log',
    out_file: '../logs/command-out.log',
    log_file: '../logs/command-combined.log',
    time: true
  }]
}
