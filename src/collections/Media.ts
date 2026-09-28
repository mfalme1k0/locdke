import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,

    create: ({ req }) => Boolean(req.user),

    update: ({ req }) => Boolean(req.user),

    delete: ({ req }) => req.user?.role === 'superadmin',
  },

  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],

    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 1000,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1600,
        height: 1600,
        position: 'centre',
      },
    ],

    adminThumbnail: 'thumbnail',
  },

  fields: [
    {
      name: 'altText',
      type: 'text',
      required: true,
    },

    {
      name: 'caption',
      type: 'textarea',
    },

    {
      name: 'credit',
      type: 'text',
    },
  ],
}