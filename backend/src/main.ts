import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: false, // Disable built-in body parser
  });
  
  // IMPROVED: Custom static file serving with comprehensive CORS headers
  const staticPath = join(process.cwd(), 'public');
  console.log('Serving static files from:', staticPath);
  
  // Custom middleware for serving static files with proper CORS headers
  app.use((req, res, next) => {
    // Only handle requests that might be for static files (SVGs, images, etc.)
    if (req.path.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js)$/i)) {
      const filePath = join(staticPath, req.path);
      
      // Check if file exists
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          // File doesn't exist, continue to next middleware
          return next();
        }
        
        // Set comprehensive CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        res.header('Cross-Origin-Embedder-Policy', 'credentialless');
        
        // Set cache control headers for better performance
        res.header('Cache-Control', 'public, max-age=86400'); // 1 day cache
        
        // Determine content type based on file extension
        const ext = req.path.split('.').pop()?.toLowerCase();
        const contentTypes = {
          svg: 'image/svg+xml',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          gif: 'image/gif',
          ico: 'image/x-icon',
          css: 'text/css',
          js: 'application/javascript'
        };
        
        if (ext && contentTypes[ext]) {
          res.header('Content-Type', contentTypes[ext]);
        }
        
        // Stream the file to the response
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        
        // Log access
        console.log(`Served static file: ${req.path}`);
      });
    } else {
      // Not a static file request, continue
      next();
    }
  });
  
  // Keep the built-in static assets option as a fallback mechanism
  // but with CORS headers already defined above
  app.useStaticAssets(staticPath, {
    prefix: '/',
  });
  
  // Custom middleware to handle Stripe webhooks differently
  app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl); // Log the request URL for debugging
    if (req.originalUrl === '/payments/webhook') {
      // For Stripe webhooks, preserve the raw body for signature verification
      json({ 
        verify: (req :any, res, buf) => { 
          req.rawBody = buf.toString(); 
        }
      })(req, res, next);
    } else {
      // For all other routes, increase the limit
      json({ limit: '50mb' })(req, res, next);
    }
  });
  
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://drawbrand.art',
      'https://www.drawbrand.art',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  await app.listen(5000);
}
bootstrap();
