import { AlertTemplate, IAlertTemplate } from '~/server/models/AlertTemplate'

export default defineEventHandler(async (event): Promise<IAlertTemplate> => {
  const body: Omit<IAlertTemplate, '_id'> = await readBody(event)
  const doc: IAlertTemplate = await AlertTemplate.create(body)
  return doc
})
