import mongoose from 'mongoose'

export default async function DbConnect() {
  if (mongoose.connection.readyState === 1) {
    console.info('DB already connected')
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URL_PRIVATE as string)
      console.log('connected to DB')
    } catch (error) {
      console.error('Error to connect to DB')
    }
  }
}
