import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import configPromise from '@payload-config'
import { FormBlock } from '@/blocks/Form/Component'
import { getPayload } from 'payload'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'preview',
    depth: 2,
    limit: 1,
    where: {
      form: {
        exists: true,
      },
    },
  })

  const doc = docs[0]
  const form = (doc?.form && typeof doc.form === 'object' ? doc.form : null) as FormType | null

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f1a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-[120px]" />
        <div className="absolute right-[-5%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/30 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[20%] h-[26rem] w-[26rem] rounded-full bg-amber-400/20 blur-[140px]" />
      </div>
      <section className="relative px-6 py-8 sm:px-10">
        <div className="mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur flex flex-col gap-6 ">
            <div className="inline-flex w-[max-content] items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Form builder
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
            </div>
            {form ? (
              <div className="w-full">
                <FormBlock enableIntro={false} form={form} />
              </div>
            ) : (
              <div className="w-full rounded-3xl border border-dashed border-white/30 bg-white/10 p-10 text-center text-white/70">
                <p className="text-lg font-semibold text-white">Geen formulier gekoppeld</p>
                <p className="mt-2 text-sm text-white/70">
                  Selecteer een formulier in de Preview-collectie om hier een live voorbeeld te
                  tonen.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
