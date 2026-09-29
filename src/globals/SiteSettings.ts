import type { GlobalConfig } from 'payload'

import { isAdminOrSuperadmin } from '../access/roles'
import { revalidateHomeGlobal } from '../hooks/revalidateHome'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { description: 'Brand name, contact details and social links.' },
  access: { read: () => true, update: isAdminOrSuperadmin },
  hooks: { afterChange: [revalidateHomeGlobal] },
  fields: [
    { name: 'brandName', type: 'text', required: true, defaultValue: "LOC'D .ke" },
    { name: 'footerTagline', type: 'text', defaultValue: 'Luxury hair artistry for modern, memorable beauty.' },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, defaultValue: 'brightonserem@gmail.com' },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'whatsapp', type: 'text', admin: { description: 'Number with country code, e.g. 2547XXXXXXXX' } },
    {
      name: 'socials',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Social link', plural: 'Social links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['instagram', 'tiktok', 'facebook', 'whatsapp', 'youtube'].map((v) => ({
            label: v[0].toUpperCase() + v.slice(1),
            value: v,
          })),
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      admin: { description: 'The small numbers under the hero (e.g. 5+ Years).' },
      defaultValue: [
        { value: '5+', label: 'Years' },
        { value: '100+', label: 'Clients' },
        { value: '5★', label: 'Rated' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
