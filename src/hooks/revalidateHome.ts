import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/** Everything on the one-page site lives at "/", so any content change refreshes it. */
const refresh = (payload: { logger: { info: (m: string) => void } }, context: Record<string, unknown>) => {
  if (context.disableRevalidate) return
  payload.logger.info('Revalidating home page')
  revalidatePath('/')
  revalidateTag('home', 'max')
}

export const revalidateHomeAfterChange: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  refresh(payload, context)
  return doc
}

export const revalidateHomeAfterDelete: CollectionAfterDeleteHook = ({ doc, req: { payload, context } }) => {
  refresh(payload, context)
  return doc
}

export const revalidateHomeGlobal: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  refresh(payload, context)
  return doc
}
