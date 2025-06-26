import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, opinion } = await req.json()
    if (!firstName || !lastName || !opinion) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection('feedback')
    await collection.insertOne({ firstName, lastName, opinion, createdAt: new Date() })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при сохранении отзыва' }, { status: 500 })
  }
}
