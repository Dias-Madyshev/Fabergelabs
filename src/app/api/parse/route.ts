import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import PDFParser from 'pdf2json'
import mammoth from 'mammoth'
import { Prompt } from './Prompt'

// Функция для преобразования File в Buffer
async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File not found' }, { status: 400 })
    }

    let text = ''
    const fileName = uuidv4()

    if (file.name.endsWith('.pdf')) {
      // Для PDF используем pdf2json
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const tempFilePath = `/tmp/${fileName}.pdf`

      try {
        // Создаем временную директорию если её нет
        await fs.mkdir('/tmp', { recursive: true })

        // Сохраняем файл
        await fs.writeFile(tempFilePath, fileBuffer)

        // Парсим PDF
        const pdfParser = new (PDFParser as any)(null, 1)

        text = await new Promise((resolve, reject) => {
          pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError))

          pdfParser.on('pdfParser_dataReady', () => {
            const parsedText = (pdfParser as any).getRawTextContent()
            resolve(parsedText)
          })

          pdfParser.loadPDF(tempFilePath)
        })

        // Удаляем временный файл
        await fs.unlink(tempFilePath)
      } catch (error) {
        console.error('PDF parsing error:', error)
        return NextResponse.json(
          {
            error: 'Error processing PDF file',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 },
        )
      }
    } else if (file.name.endsWith('.docx')) {
      // Для DOCX используем mammoth
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (file.name.endsWith('.txt')) {
      // Для текстовых файлов
      const buffer = Buffer.from(await file.arrayBuffer())
      text = buffer.toString('utf-8')
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 })
    }

    // Отправляем в API с системным промптом
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // или 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: Prompt },
          { role: 'user', content: text },
        ],
      }),
    })

    const data = await response.json()

    const apiResponse = NextResponse.json({
      result: data.choices?.[0]?.message?.content || 'No response',
      fileName: fileName,
    })

    apiResponse.headers.set('FileName', fileName)
    return apiResponse
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        error: 'Error processing file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
