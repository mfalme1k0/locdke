import { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

export const plugins: Plugin[] = [
  // Cloud storage for uploads. Netlify/Vercel filesystems are ephemeral, so without
  // this, photos the stylist uploads would vanish on the next deploy.
  // Works with Cloudflare R2, AWS S3, Supabase Storage, Backblaze B2 (any S3-compatible bucket).
  ...(process.env.S3_BUCKET
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'auto',
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            forcePathStyle: true,
          },
        }),
      ]
    : []),
]
