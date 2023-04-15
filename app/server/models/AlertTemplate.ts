import { model, Schema } from 'mongoose'

export interface IAlertTemplate {
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

export const AlertTemplate = model<IAlertTemplate>(
  'AlertTemplate',
  schema
)
