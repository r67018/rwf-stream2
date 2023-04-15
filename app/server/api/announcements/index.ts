import { Announcement } from '~/server/models/Announcement'

export default defineEventHandler(async (event) => {
  return Announcement.find().lean()
})
