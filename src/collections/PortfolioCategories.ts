import type { CollectionConfig } from 'payload'

import {
  isAdminOrSuperadmin,
  isSuperadmin,
} from '../access/roles'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',

  admin: {
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
      required: true,
      unique: true,
      index: true,
    },

    {
      name: 'description',
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
      required: true,
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