import type { CollectionConfig } from 'payload'

import {
  isAdminOrSuperadmin,
  isSuperadmin,
} from '../access/roles'
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from '../hooks/revalidateHome'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',

  labels: { singular: 'Portfolio item', plural: 'Portfolio' },

  hooks: {
    afterChange: [revalidateHomeAfterChange],
    afterDelete: [revalidateHomeAfterDelete],
  },

  admin: {
    description: 'Each item is a card in "Recent transformations" (cover photo, title, short caption).',
    useAsTitle: 'name',

    defaultColumns: [
      'name',
      'featured',
      'active',
      'sortOrder',
    ],
  },

  access: {
    // Public website can read categories.
    read: () => true,

    // Admin and Superadmin can create.
    create: isAdminOrSuperadmin,

    // Admin and Superadmin can edit.
    update: isAdminOrSuperadmin,

    // Only Superadmin can permanently delete.
    delete: isSuperadmin,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Generated automatically from the name.' },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) =>
            value ||
            String(siblingData?.name ?? '')
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, ''),
        ],
      },
    },

    {
      name: 'description',
      label: 'Short caption',
      type: 'textarea',
    },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Optional extra photos for a gallery view.' },
    },

    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'editorial',

      options: [
        {
          label: 'Editorial',
          value: 'editorial',
        },
        {
          label: 'Masonry',
          value: 'masonry',
        },
        {
          label: 'Featured Grid',
          value: 'featured-grid',
        },
        {
          label: 'Full Width',
          value: 'full-width',
        },
      ],
    },

    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
  ],
}