import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar', // можно заменить на другую модель
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    })

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'Нет ответа.'

    return NextResponse.json({ result: answer })
  } catch (error: any) {
    console.error('Ошибка:', error?.response?.data || error.message)
    return NextResponse.json({ error: 'Ошибка при обращении к Perplexity API' }, { status: 500 })
  }
}
