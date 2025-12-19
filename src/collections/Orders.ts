import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

const padSequence = (value: number) => String(value).padStart(4, '0')

const setOrderNumber: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  if (data?.orderNumber) return data

  const year = new Date().getFullYear()
  const likePattern = `${year}-%`

  const { docs } = await req.payload.find({
    collection: 'orders',
    depth: 0,
    limit: 1,
    sort: '-orderNumber',
    where: {
      orderNumber: { like: likePattern },
    },
    overrideAccess: true,
  })

  const lastOrder = docs[0]
  const lastSequence = lastOrder?.orderNumber?.split('-')?.[1]
  const nextSequence = Number.parseInt(lastSequence || '0', 10) + 1

  return {
    ...data,
    orderNumber: `${year}-${padSequence(nextSequence)}`,
  }
}

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
      name: 'orderNumber',
      type: 'text',
      label: 'Bestellingsnummer',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'customerId',
      type: 'relationship',
      label: 'Klant',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      label: 'Producten',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@/components/OrdersItemRowLabel',
        },
      },
      fields: [
        {
          name: 'product',
          label: 'Product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          label: 'Aantal',
          type: 'number',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      label: 'Afhalen of leveren',
      required: true,
      options: [
        { label: 'Afhalen', value: 'pickup' },
        { label: 'Leveren', value: 'delivery' },
      ],
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
  ],
  hooks: {
    beforeChange: [setOrderNumber],
  },
}
