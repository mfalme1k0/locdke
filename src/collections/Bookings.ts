import type { CollectionConfig } from 'payload'

import { isAdminOrSuperadmin, isSuperadmin } from '../access/roles'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Booking request', plural: 'Booking requests' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'preferredDate', 'status', 'createdAt'],
    description: 'Requests submitted through the "Book Now" form.',
  },
  access: {
    // Visitors can submit, but never read or edit.
    create: () => true,
    read: isAdminOrSuperadmin,
    update: isAdminOrSuperadmin,
    delete: isSuperadmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        // Honeypot: real people never see this field, bots fill it in.
        if (operation === 'create' && !req.user && data?.website) {
          throw new Error('Invalid submission')
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', maxLength: 40 },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: { description: 'What the client asked for.' },
    },
    { name: 'preferredDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'message', type: 'textarea', maxLength: 2000 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
      access: {
        // Public submitters can't set their own status.
        create: ({ req }) => Boolean(req.user),
      },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' }, access: { read: ({ req }) => Boolean(req.user), create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) } },
    {
      name: 'website',
      type: 'text',
      label: 'Leave empty',
      admin: { hidden: true },
      hooks: { beforeChange: [() => undefined] }, // never persisted
      access: { read: () => false },
    },
  ],
}
