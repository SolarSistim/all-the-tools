import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: The "Silent 502": Solving Internal Proxy Conflicts in Self-Hosted Postiz
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Self-hosting complex applications like Postiz—an open-source social media scheduling tool—behind a reverse proxy (like Caddy) and a CDN (like Cloudflare) adds layers of networking that can lead to the dreaded 502 Bad Gateway.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If your frontend loads but your registration or login forms fail, you are likely hitting the "Internal Loopback" problem. Here is how we diagnosed and fixed it.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Challenge: The Monorepo Networking Trap',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Postiz isn\'t just one service; it\'s a monorepo. Inside the Docker container, a process manager (PM2) runs the Frontend (Next.js) on port 4200 and the Backend (NestJS API) on port 3000.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The breakdown happened here:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'ordered',
      items: [
        'The user clicks "Register."',
        'The Frontend tries to send that data to the API.',
        'Because the app was configured with a public URL, the Frontend tried to exit the container, go out to the internet, pass through Cloudflare, and come back through Caddy.',
        'Docker\'s internal networking often blocks this "hairpin" turn, or the API rejects the request because it doesn\'t recognize the proxy headers.',
        'Caddy sees the Frontend hang while waiting for the API, times out, and serves the user a 502 Bad Gateway.',
      ],
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Solution: Three Steps to Stability',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'To solve this, we had to move from a "standard" install to a "proxy-aware" configuration.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '1. Manual Database Synchronization',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Even with the correct networking, the backend will crash if the database tables haven\'t been created. In some production Docker images, the automatic migration fails. We solved this by manually reaching into the container and forcing a Prisma sync:',
    },
  },
  {
    type: 'code',
    data: {
      code: 'docker exec postiz npx prisma db push --schema /app/libraries/nestjs-libraries/src/database/prisma/schema.prisma',
      language: 'bash',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '2. Defining the Internal Bridge',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'We had to tell the Frontend exactly where the Backend was located inside the same container. This bypasses the internet entirely for API calls.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Fix:</strong> Added <code>BACKEND_INTERNAL_URL="http://localhost:3000"</code>',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: '3. Establishing Proxy Trust',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Because the request passes through Cloudflare → Caddy → Postiz, the app needs to know it\'s okay to trust the IP addresses it sees in the headers. Without this, the app\'s security layer drops the connection.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Fix:</strong> Added <code>TRUST_PROXY="true"</code>',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Final Configuration',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The working solution required a robust docker run command that explicitly defined these internal relationships:',
    },
  },
  {
    type: 'code',
    data: {
      code: `docker run -d --name postiz --network postiz-network -p 5001:5000 \\
  -e DATABASE_URL="postgresql://user:pass@postiz-db:5432/postiz" \\
  -e MAIN_URL="https://www.mydomain.com" \\
  -e NEXT_PUBLIC_BACKEND_URL="https://www.mydomain.com/api" \\
  -e BACKEND_INTERNAL_URL="http://localhost:3000" \\
  -e TRUST_PROXY="true" \\
  -e STORAGE_PROVIDER="local" \\
  -e UPLOAD_DIRECTORY="/uploads" \\
  ghcr.io/gitroomhq/postiz-app:latest`,
      language: 'bash',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Summary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'When self-hosting monorepo apps, localhost is your friend. By pointing the frontend to the backend\'s internal port and ensuring the database schema is manually synced, we cleared the path for stable operation behind multiple proxy layers.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The key takeaway: <strong>internal container communication should never leave the host</strong>. Configure your applications to use localhost for inter-process communication, and reserve your public URLs for external client access only.',
    },
  },
];
