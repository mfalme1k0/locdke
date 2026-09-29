import type { CollectionConfig } from 'payload'

import { isAdminOrSuperadmin, isSuperadmin } from '../access/roles'
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from '../hooks/revalidateHome'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceDisplay', 'active', 'sortOrder'],
    description: 'The services shown in "Signature services" on the website.',
  },
  access: {
    read: () => true,
    create: isAdminOrSuperadmin,
    update: isAdminOrSuperadmin,
    delete: isSuperadmin,
  },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'priceType',
          type: 'select',
          required: true,
          defaultValue: 'from',
          options: [
            { label: 'Starting from (Ksh 1,500+)', value: 'from' },
            { label: 'Fixed price (Ksh 1,500)', value: 'fixed' },
            { label: 'Consult / on request', value: 'consult' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: {
            width: '50%',
            description: 'In Ksh. Leave empty for "Consult".',
            condition: (_, siblingData) => siblingData?.priceType !== 'consult',
          },
        },
      ],
    },
    {
      // Computed so the frontend and admin list show the same label.
      name: 'priceDisplay',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.priceType === 'consult' || siblingData.price == null) return 'Consult'
            const amount = Number(siblingData.price).toLocaleString('en-KE')
            return siblingData.priceType === 'from' ? `Ksh${amount}+` : `Ksh${amount}`
          },
        ],
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick to hide from the website without deleting.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
