


const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { authMiddleware } = require('./middleware/authMiddleware'); // Import your middleware

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Use your middleware here
    if (pathname === '/') {
      const middlewareResult = authMiddleware(req, res);
      if (middlewareResult.finished) {
        return middlewareResult.getResponse().then((response) => {
          response.apply(res);
          return;
        });
      }
    }

    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    // console.log('> Ready on http://localhost:3000');
  });
});