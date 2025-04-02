import http from "node:http";
import fs from "node:fs";
import path from "path";

import child_process from "child_process";

// const http = require('http');
// const fs = require('fs');
// const path = require('path');

const port = 9887;
const directory = '.'; // Serve files from the current directory

const server = http.createServer((req, res) => {
  let filePath = path.join(directory, req.url === '/' ? 'index.html' : req.url); // default to index.html
  let extname = String(path.extname(filePath)).toLowerCase();
  let contentType = 'application/octet-stream'; // Default content type

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    // '.jpg': 'image/jpg',
    // '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    // '.wav': 'audio/wav',
    // '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    // '.wasm': 'application/wasm'
  };

  contentType = mimeTypes[extname] || contentType;

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(directory,'404.html'), (error404, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content404, 'utf-8');
        });

      } else {
        res.writeHead(500);
        res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});