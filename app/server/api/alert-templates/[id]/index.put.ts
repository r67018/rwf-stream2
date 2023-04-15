import { AlertTemplate, IAlertTemplate } from '~/server/models/AlertTemplate'

export default defineEventHandler(async (event): Promise<null> => {
  const body: IAlertTemplate = await readBody(event)
  const id = event.context.params?.id
  if (!id) {
    throw new Error('No ID provided')
  }
  await AlertTemplate.updateOne({_id: id}, body)
  return null
})
