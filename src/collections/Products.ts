import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'amount'],
  },
  fields: [
    {
      name: 'name',
      label: 'Naam',
      type: 'text',
      required: true,
    },
    {
      name: 'amount',
      label: 'Aantal',
      type: 'number',
      required: true,
    },
  ],
}
