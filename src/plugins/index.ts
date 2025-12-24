import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { Plugin } from 'payload'

export const plugins: Plugin[] = [
  formBuilderPlugin({
    fields: {
      payment: false,
    },
  }),
  payloadCloudPlugin(),
]
