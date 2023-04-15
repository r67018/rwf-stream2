import { model, Schema } from 'mongoose'

export interface IAnnouncement {
  _id: string
  title: string
  content: string
}

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

export const Announcement = model<IAnnouncement>(
  'Announcement',
  schema
)
