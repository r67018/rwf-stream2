import { AlertTemplate } from '~/server/models/AlertTemplate'

export default defineEventHandler(async (event): Promise<null> => {
  const id = event.context.params?.id
  if (!id) {
    throw new Error('No id provided')
  }
  await AlertTemplate.deleteOne({ _id: id })
  return null
})
