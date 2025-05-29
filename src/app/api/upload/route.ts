import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import * as os from 'os'
import { v4 as uuidv4 } from 'uuid'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'

// Максимальный размер файла (32MB)
const MAX_FILE_SIZE = 32 * 1024 * 1024

export async function GET() {
  return NextResponse.json({ message: 'Upload API endpoint is working' })
}

export async function POST(request: Request) {
  try {
    console.log('Получен POST запрос')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('Файл не найден в formData')
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    console.log('Получен файл:', file.name, 'размер:', file.size, 'тип:', file.type)

    // Проверяем размер файла
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Файл слишком большой' }, { status: 413 })
    }

    // Сохраняем файл временно
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем временное имя файла
    const tempPath = join(os.tmpdir(), uuidv4() + '-' + file.name)
    await writeFile(tempPath, buffer)

    console.log('Начинаем извлечение текста из файла')

    // Извлекаем текст в зависимости от типа файла
    let text = ''

    if (file.type === 'application/pdf') {
      console.log('Обработка PDF файла')
      const data = await pdfParse(buffer)
      text = data.text
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      console.log('Обработка DOCX файла')
      const { value } = await mammoth.extractRawText({ buffer })
      text = value
    } else if (file.type === 'text/plain') {
      console.log('Обработка TXT файла')
      text = buffer.toString('utf-8')
    } else {
      console.error('Неподдерживаемый формат файла:', file.type)
      return NextResponse.json({ error: 'Неподдерживаемый формат файла' }, { status: 400 })
    }

    console.log('Текст успешно извлечен, длина:', text.length)

    // Отправляем запрос к Perplexity API
    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      console.error('API ключ не настроен')
      return NextResponse.json({ error: 'API ключ не настроен' }, { status: 500 })
    }

    console.log('Отправляем запрос к Perplexity API')
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-instruct',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    })

    if (!perplexityResponse.ok) {
      console.error('Ошибка от Perplexity API:', perplexityResponse.status)
      throw new Error('Ошибка при получении ответа от Perplexity API')
    }

    const perplexityData = await perplexityResponse.json()
    console.log('Получен ответ от Perplexity API')

    return NextResponse.json({ message: perplexityData.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        error: 'Ошибка при обработке файла',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 },
    )
  }
}
