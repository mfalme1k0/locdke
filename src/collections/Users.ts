import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',

      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Superadmin',
          value: 'superadmin',
        },
      ],
    },
  ],
}