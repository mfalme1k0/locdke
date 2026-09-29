import { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

const requiredS3Variables = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']
const missingS3Variables = requiredS3Variables.filter((name) => !process.env[name])
const isProductionRuntime =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build'

if (isProductionRuntime && missingS3Variables.length > 0) {
  throw new Error(`Production media storage is not configured. Set: ${missingS3Variables.join(', ')}`)
}

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
