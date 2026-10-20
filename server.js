const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const ROOT_DIR = __dirname;
const INITIAL_PORT = 3000;

function openBrowser(url) {
  const startCmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
    ? `open "${url}"`
    : `xdg-open "${url}"`;

  exec(startCmd, (err) => {
    if (err) {
      console.log(`Could not automatically open browser. Please navigate to: ${url}`);
    }
  });
}

function createServer(port) {
  const server = http.createServer((req, res) => {
    // Decode and parse URL
    let safeUrl = req.url.split('?')[0];
    try {
      safeUrl = decodeURIComponent(safeUrl);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Bad Request');
    }

    if (safeUrl === '/' || safeUrl === '') {
      safeUrl = '/index.html';
    }

    // Resolve absolute path and prevent directory traversal
    const filePath = path.normalize(path.join(ROOT_DIR, safeUrl));
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 Not Found</title></head>
          <body style="font-family:sans-serif;text-align:center;padding:50px;">
            <h2>Page Not Found</h2>
            <p><a href="/index.html">Return to Invitation</a></p>
          </body>
          </html>
        `);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      createServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n==================================================`);
    console.log(`  🎉 Charmaine's 18th Debut Invitation is running!`);
    console.log(`  Local URL: \x1b[36m${url}\x1b[0m`);
    console.log(`  Press Ctrl + C in this terminal to stop.`);
    console.log(`==================================================\n`);

    openBrowser(url);
  });
}

createServer(INITIAL_PORT);

