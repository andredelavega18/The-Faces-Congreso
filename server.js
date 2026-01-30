const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const startServer = async () => {
  let handler;

  if (!dev) {
    // Production: Check for standalone build (BanaHosting optimized)
    const standalonePath = path.join(__dirname, '.next', 'standalone', 'server.js');
    if (fs.existsSync(standalonePath)) {
      console.log('🚀 Starting in Standalone Mode (Optimized for BanaHosting)...');
      // In standalone mode, we let the standalone server handle it if possible, 
      // OR we just use the built-in Next.js handler if we want to wrap it.
      // Easiest for custom server interaction is standard Next.js app usage
      // but pointing to the standalone build requires specific handling.

      // Fallback for simplicity in custom server.js context: Use standard next() 
      // but ensuring NODE_ENV is production.
    }
  }

  const next = require('next');
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, hostname, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  🎭 THE FACES 2026 - Master Inyector');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  ✅ Server ready at http://${hostname}:${port}`);
    console.log(`  📍 Environment: ${dev ? 'development' : 'production'}`);
    console.log('═══════════════════════════════════════════════════');
  });
};

startServer().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
