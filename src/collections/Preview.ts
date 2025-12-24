import type { CollectionConfig } from 'payload'

export const Preview: CollectionConfig<'preview'> = {
  slug: 'preview',
  labels: {
    singular: 'Voorbeeld',
    plural: 'Voorbeelden',
  },
  admin: {
    custom: {
      showInMenu: true,
    },
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  admin: { width: '50%' },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'textarea',
              type: 'textarea',
              label: 'Textarea',
            },
            {
              name: 'number',
              type: 'number',
              label: 'Number',
            },
            {
              name: 'checkbox',
              type: 'checkbox',
              label: 'Checkbox',
            },
            {
              name: 'date',
              type: 'date',
              label: 'Date',
              admin: {
                date: { displayFormat: 'dd-MM-yyyy' },
              },
            },
          ],
        },
        {
          label: 'Selections',
          fields: [
            {
              name: 'select',
              type: 'select',
              options: [
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' },
                { label: 'Three', value: 'three' },
              ],
            },
            {
              name: 'radio',
              type: 'radio',
              options: [
                { label: 'A', value: 'a' },
                { label: 'B', value: 'b' },
                { label: 'C', value: 'c' },
              ],
              admin: { layout: 'horizontal' },
            },
            {
              name: 'richText',
              type: 'richText',
              label: 'Rich Text',
            },
          ],
        },
        {
          label: 'Groups',
          fields: [
            {
              name: 'group',
              type: 'group',
              label: 'Group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'firstName',
                      type: 'text',
                      label: 'First name',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'lastName',
                      type: 'text',
                      label: 'Last name',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'note',
                  type: 'textarea',
                  label: 'Note',
                },
              ],
            },
          ],
        },
        {
          label: 'Repeating',
          fields: [
            {
              name: 'array',
              type: 'array',
              label: 'Array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'number',
                },
              ],
            },
            {
              name: 'blocks',
              type: 'blocks',
              label: 'Blocks',
              blocks: [
                {
                  slug: 'noteBlock',
                  labels: { singular: 'Note', plural: 'Notes' },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'body',
                      type: 'textarea',
                    },
                  ],
                },
                {
                  slug: 'imageBlock',
                  labels: { singular: 'Image', plural: 'Images' },
                  fields: [
                    {
                      name: 'alt',
                      type: 'text',
                    },
                    {
                      name: 'url',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
