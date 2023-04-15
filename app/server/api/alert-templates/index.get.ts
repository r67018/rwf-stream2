import { AlertTemplate } from '~/server/models/AlertTemplate'

export default defineEventHandler(async (event) => {
  return AlertTemplate.find().lean()
})
