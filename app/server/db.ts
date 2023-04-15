import mongoose from 'mongoose'

export default async () => {
  const host = 'localhost'
  const port = 27017
  const dbName = 'rwfStream';
  const replicaSet = 'rs0'
  const url = `mongodb://${host}:${port}/${dbName}?replicaSet=${replicaSet}&directConnection=true`
  console.log(`url: ${url}`)
  try {
    await mongoose.connect(url)
    console.log('DB connection established.')
  } catch (e) {
    console.log('DB connection failed.', e)
  }
}
