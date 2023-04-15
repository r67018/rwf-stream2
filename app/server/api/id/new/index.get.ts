import { ObjectId } from 'mongodb'

// idを生成する
export default defineEventHandler(async (event): Promise<string> => {
  return new ObjectId().toString()
})
