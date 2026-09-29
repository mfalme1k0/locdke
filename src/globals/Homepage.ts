import type { GlobalConfig } from 'payload'

import { isAdminOrSuperadmin } from '../access/roles'
import { revalidateHomeGlobal } from '../hooks/revalidateHome'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Text',
  admin: { description: 'Headlines and intro text for each section of the website.' },
  access: { read: () => true, update: isAdminOrSuperadmin },
  hooks: { afterChange: [revalidateHomeGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          name: 'hero',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Bespoke dreadlock artistry' },
            { name: 'headline', type: 'text', required: true, defaultValue: 'Luxury locs For you and yours' },
            { name: 'subheadline', type: 'textarea', defaultValue: 'Dreadlock artistry with intention, class, and elegance.' },
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            {
              type: 'row',
              fields: [
                { name: 'primaryCta', type: 'text', defaultValue: 'Reserve Appointment' },
                { name: 'secondaryCta', type: 'text', defaultValue: 'View Transformations' },
              ],
            },
          ],
        },
        {
          label: 'Services intro',
          name: 'services',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Signature services' },
            { name: 'heading', type: 'text', defaultValue: 'Elevated beauty, tailored to your taste.' },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue:
                'Every appointment begins with a thoughtful consultation, customized product selection, and a finish designed for your desired look.',
            },
          ],
        },
        {
          label: 'Portfolio intro',
          name: 'portfolio',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Portfolio' },
            { name: 'heading', type: 'text', defaultValue: 'Recent transformations' },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue: 'A curated look at retwists, styling and bleached locs for real clients.',
            },
          ],
        },
        {
          label: 'Booking intro',
          name: 'booking',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Appointments' },
            { name: 'heading', type: 'text', defaultValue: 'Ready for your signature look?' },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue:
                'Submit a request and the studio will respond within 24 hours with availability, consultation details, and preparation notes.',
            },
            { name: 'successMessage', type: 'text', defaultValue: "Thank you! We'll be in touch within 24 hours." },
          ],
        },
      ],
    },
  ],
}
