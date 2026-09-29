import type { CollectionConfig } from 'payload'

import { isAdminOrSuperadmin, isSuperadmin } from '../access/roles'
import { revalidateHomeAfterChange } from '../hooks/revalidateHome'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,

    create: isAdminOrSuperadmin,

    update: isAdminOrSuperadmin,

    delete: isSuperadmin,
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
        name: 'og',
        width: 1200,
        height: 630,
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

  hooks: { afterChange: [revalidateHomeAfterChange] },

  fields: [
    {
      name: 'altText',
      type: 'text',
      required: true,
      admin: { description: 'Short description of the photo (helps accessibility and Google).' },
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