import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

/* -------------------------------- helpers -------------------------------- */

const padSequence = (value: number) => String(value).padStart(4, '0')

const getItemUnitPrice = (item: any) => {
  const rawPrice = item?.unitPrice ?? item?.product?.unitPrice ?? item?.product?.price ?? 0

  const unitPrice = Number(rawPrice)
  return Number.isFinite(unitPrice) ? unitPrice : 0
}

const calculatePricing = (items: any[] = []) => {
  const subtotal = items.reduce(
    (sum, item) => sum + getItemUnitPrice(item) * (item?.quantity || 1),
    0,
  )

  const tax = subtotal * 0.21
  const total = subtotal + tax

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}

/* --------------------------------- hooks ---------------------------------- */

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

const calculateTotals: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data?.items) return data

  return {
    ...data,
    pricing: calculatePricing(data.items),
  }
}

/* ------------------------------- collection -------------------------------- */

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
  },

  fields: [
    {
      name: 'orderSectionTitle',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/OrdersSectionTitle',
        },
        custom: {
          heading: 'Bestelling',
        },
      },
    },
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Bestellingsnummer',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },

    {
      name: 'customerId',
      type: 'relationship',
      label: 'Klant',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'date',
      type: 'date',
      label: 'Datum',
      required: true,
      admin: {
        date: { displayFormat: 'dd-MM-yyyy' },
      },
    },

    {
      name: 'items',
      type: 'array',
      label: 'Producten',
      admin: {
        components: {
          RowLabel: '@/components/OrdersItemRowLabel',
        },
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'unitPrice',
          label: 'Prijs per stuk (€)',
          type: 'number',
          required: true,
          admin: { readOnly: false },
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
      name: 'delivery',
      type: 'group',
      label: 'Bezorging',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'delivery',
      },
      fields: [
        { name: 'address', label: 'Adres', type: 'text', required: true },
        { name: 'postalCode', label: 'Postcode', type: 'text', required: true },
        { name: 'city', label: 'Stad', type: 'text', required: true },
        {
          name: 'deliveryTime',
          label: 'Bezorgdatum en tijd',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'In afwachting', value: 'pending' },
        { label: 'In behandeling', value: 'processing' },
        { label: 'Voltooid', value: 'completed' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
    },

    {
      name: 'pricing',
      type: 'group',
      label: 'Prijs',
      admin: { readOnly: true },
      fields: [
        { name: 'subtotal', label: 'Subtotaal', type: 'number' },
        { name: 'tax', label: 'BTW', type: 'number' },
        { name: 'total', label: 'Totaal', type: 'number' },
      ],
    },

    {
      name: 'flags',
      type: 'group',
      label: 'Interne status',
      fields: [
        { name: 'paid', type: 'checkbox', label: 'Betaald' },
        { name: 'invoiceSent', type: 'checkbox', label: 'Factuur verzonden' },
        { name: 'urgent', type: 'checkbox', label: 'Spoed' },
      ],
    },

    {
      name: 'comment',
      type: 'group',
      label: 'Opmerking',
      fields: [
        {
          name: 'comment',
          label: '',
          type: 'textarea',
          admin: {
            rows: 5,
          },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [setOrderNumber, calculateTotals],
  },
}
