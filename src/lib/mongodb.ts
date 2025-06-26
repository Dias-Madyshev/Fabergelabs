import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Не указана переменная окружения MONGODB_URI')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

async function connectWithLog() {
  try {
    const client = new MongoClient(uri!, options)
    await client.connect()
    console.log('✅ Успешное подключение к MongoDB')
    return client
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err)
    throw err
  }
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    // @ts-ignore
    global._mongoClientPromise = connectWithLog()
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = connectWithLog()
}

export default clientPromise
