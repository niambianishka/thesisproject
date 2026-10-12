// ATLAS local server
// ---------------------------------------------------------------------------
// Serves this folder over http://localhost:8080/ .
//
// Why this exists: YouTube only hands an embedded player to a page that can
// identify itself (it needs an HTTP "Referer"). A page opened straight from
// disk (file://...) sends no referrer at all, which is why the player answers
// with "Error 153 - video player configuration error". Serving the same pages
// over http://localhost gives them a real origin, so the lecture videos play
// inside the site instead of bouncing you to YouTube.
//
// Run it with "Start ATLAS.bat" (or: node atlas-server.js).
// ---------------------------------------------------------------------------
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8080);
const HOST = 'localhost';

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
    let requested;
    try {
        requested = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad request');
        return;
    }

    const relative = requested === '/' || requested === ''
        ? 'index.html'
        : requested.replace(/^\/+/, '');
    const file = path.resolve(ROOT, relative);

    // Never serve anything outside this folder
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found: ' + relative);
            return;
        }
        res.writeHead(200, {
            'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        res.end(data);
    });
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error('');
        console.error('  Port ' + PORT + ' is already in use.');
        console.error('  ATLAS may already be running — open http://' + HOST + ':' + PORT + '/index.html');
        console.error('');
        setTimeout(() => process.exit(1), 4000);
        return;
    }
    console.error(String(err));
});

server.listen(PORT, HOST, () => {
    console.log('');
    console.log('  ATLAS is running:  http://' + HOST + ':' + PORT + '/index.html');
    console.log('  Lecture videos play inside the site while this window stays open.');
    console.log('  Close this window to stop the server.');
    console.log('');
});
