import { StageEvent } from '~/server/models/StageEvent'

export default defineEventHandler(async (event): Promise<null> => {
    const id = event.context.params?.id
  if (!id) {
    throw new Error('No id provided')
  }
  await StageEvent.deleteOne({ _id: id })
  return null
})
