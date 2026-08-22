const { spawn, execSync } = require('child_process');

try {
  // Free port 5000 if in use
  const out = execSync('netstat -ano | findstr :5000', { encoding: 'utf-8' });
  const lines = out.trim().split('\n');
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && pid !== '0' && pid !== process.pid.toString()) {
      try {
        process.kill(Number(pid), 'SIGKILL');
        console.log(`Freed port 5000 from PID ${pid}`);
      } catch (e) {}
    }
  }
} catch (e) {}

// Start server
require('./backend/server.js');
