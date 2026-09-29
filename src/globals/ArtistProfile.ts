import type { GlobalConfig } from 'payload'

import { isAdminOrSuperadmin } from '../access/roles'
import { revalidateHomeGlobal } from '../hooks/revalidateHome'

export const ArtistProfile: GlobalConfig = {
  slug: 'artist-profile',
  label: 'About the Artist',
  admin: { description: 'The "Meet the artist" section.' },
  access: { read: () => true, update: isAdminOrSuperadmin },
  hooks: { afterChange: [revalidateHomeGlobal] },
  fields: [
    { name: 'name', type: 'text', required: true, defaultValue: 'Brighton Serem' },
    { name: 'eyebrow', type: 'text', defaultValue: 'Meet the artist' },
    { name: 'heading', type: 'text', required: true, defaultValue: 'Locs that feels expensive, modern, and deeply personal.' },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      admin: { description: 'Separate paragraphs with a blank line.' },
      defaultValue:
        'I’m Brighton Serem, a luxury locs specialist, specializing in creating beautiful, long-lasting locs that enhance your natural features.\n\nFrom freeform locs, drafted ones and even artificial locs, I create styles that are uniquely yours.',
    },
    { name: 'portrait', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Highlight', plural: 'Highlights' },
      defaultValue: [
        { title: 'House call', description: 'Available for house calls for convenient service' },
        { title: 'Clean Beauty', description: 'Low-tox premium product focus' },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
  ],
}
