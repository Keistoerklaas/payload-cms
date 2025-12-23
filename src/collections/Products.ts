import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'unitPrice', 'amount'],
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
    {
      name: 'unitPrice',
      label: 'Prijs per stuk',
      type: 'number',
      required: true,
      admin: {
        readOnly: true,
        step: 0.01,
      },
    },
  ],
}
