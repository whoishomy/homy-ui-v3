import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createHash } from 'crypto';

export const securityMiddleware = {
  // Rate limiting
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  }),

  // Security headers
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.openai.com', 'https://api.anthropic.com'],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  }),

  // Request validation
  validateRequest: (req: Request, res: Response, next: NextFunction) => {
    // Validate content type
    if (req.method !== 'GET' && !req.is('application/json')) {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }

    // Validate request size
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 1024 * 1024) {
      // 1MB limit
      return res.status(413).json({ error: 'Request Entity Too Large' });
    }

    // Validate request signature if present
    const signature = req.headers['x-request-signature'];
    if (signature && !validateSignature(req, signature as string)) {
      return res.status(401).json({ error: 'Invalid Request Signature' });
    }

    next();
  },

  // Session security
  sessionSecurity: (req: Request, res: Response, next: NextFunction) => {
    // Regenerate session ID periodically
    if (
      req.session &&
      (!req.session.created || Date.now() - req.session.created > 30 * 60 * 1000)
    ) {
      req.session.regenerate(() => {
        req.session.created = Date.now();
        next();
      });
      return;
    }

    // Set secure session cookie
    res.cookie('sessionId', req.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    next();
  },
};

function validateSignature(req: Request, signature: string): boolean {
  const payload = JSON.stringify(req.body);
  const expectedSignature = createHash('sha256')
    .update(payload + process.env.HOMY_API_SECRET)
    .digest('hex');

  return signature === expectedSignature;
}
