import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig<'orders'> = {
  slug: 'orders',
  labels: {
    singular: 'Bestelling',
    plural: 'Bestellingen',
  },
  admin: {
    custom: {
      showInMenu: true,
    },
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerId', 'status'],
    // listSearch: true,
  },
  fields: [
    {
      name: 'customerId',
      type: 'relationship',
      label: 'Klant',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'type',
      type: 'text',
      label: 'Type',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Datum',
      required: true,

      admin: {
        hidden: false,
        date: {
          displayFormat: 'dd-MM-yyyy',
        },
      },
    },
    {
      name: 'comment',
      label: 'Opmerking',
      type: 'textarea',
    },
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Bestelling',
      required: true,
      unique: true,
    },
  ],
}
