import type { CollectionConfig } from 'payload'

import { isSuperadmin, selfOrSuperadmin, superadminField } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    // Any signed-in user may enter the admin panel.
    admin: ({ req }) => Boolean(req.user),
    // Only the superadmin creates or removes accounts.
    create: isSuperadmin,
    delete: isSuperadmin,
    // Admins can read/update only their own account (name, password).
    read: selfOrSuperadmin,
    update: selfOrSuperadmin,
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
      // Safe default: new accounts are never superadmin by accident.
      defaultValue: 'admin',
      saveToJWT: true, // lets access functions read req.user.role without a DB hit
      access: {
        // Nobody but a superadmin can change a role (prevents self-promotion).
        create: superadminField,
        update: superadminField,
      },
      options: [
        { label: 'Admin (stylist)', value: 'admin' },
        { label: 'Superadmin (developer)', value: 'superadmin' },
      ],
    },
  ],
  timestamps: true,
}
