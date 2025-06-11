import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import PDFParser from 'pdf2json'
import mammoth from 'mammoth'
import { Prompt } from './Prompt'
import { jsPDF } from 'jspdf'

// Функция для преобразования File в Buffer
async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Функция для создания PDF с результатом
async function createResultPDF(text: string, fileName: string): Promise<Buffer> {
  // Создаем новый PDF документ
  const doc = new jsPDF()

  // Начальная позиция Y
  let yPos = 20
  const margin = 20 // Увеличиваем отступы
  const pageWidth = doc.internal.pageSize.width
  const maxWidth = pageWidth - margin * 2 // Уменьшаем максимальную ширину текста

  // Добавляем заголовок
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Analysis Results', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Разбиваем текст на строки
  const lines = text.split('\n')

  for (let line of lines) {
    // Пропускаем пустые строки
    if (!line.trim()) continue

    // Проверяем, является ли строка разделителем
    if (line.trim().startsWith('---')) {
      doc.setLineWidth(0.5)
      doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
      yPos += 8
      continue
    }

    // Проверяем уровень заголовка
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headerMatch) {
      const level = headerMatch[1].length
      const title = headerMatch[2]

      // Размер шрифта зависит от уровня заголовка
      const fontSize = 20 - level * 2 // h1 = 18pt, h2 = 16pt, etc.

      yPos += 8 // Отступ перед заголовком
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', 'bold')

      // Разбиваем длинные заголовки
      const splitTitle = doc.splitTextToSize(title, maxWidth)
      doc.text(splitTitle, margin, yPos)
      yPos += (fontSize / 2) * splitTitle.length
      continue
    }

    // Обрабатываем маркированный список
    if (line.trim().startsWith('-')) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      const bulletText = line.trim().substring(2)

      // Рисуем маркер списка
      doc.circle(margin + 2, yPos - 2, 0.5, 'F')

      // Обрабатываем текст с учетом жирного форматирования
      const parts = bulletText.split(/(\*\*.*?\*\*)/g)
      let processedText = ''

      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          processedText += part.slice(2, -2) // Убираем звездочки
        } else {
          processedText += part
        }
      }

      // Разбиваем текст на строки с учетом максимальной ширины
      const splitText = doc.splitTextToSize(processedText, maxWidth - 10) // Дополнительный отступ для маркера

      // Отрисовываем каждую строку с форматированием
      for (let i = 0; i < splitText.length; i++) {
        const line = splitText[i]
        if (i === 0) {
          doc.text(line, margin + 8, yPos) // Первая строка с отступом для маркера
        } else {
          doc.text(line, margin + 8, yPos) // Последующие строки с тем же отступом
        }
        yPos += 6
      }
      yPos += 2 // Дополнительный отступ после элемента списка
      continue
    }

    // Обрабатываем обычный текст с поддержкой жирного начертания
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    // Собираем текст без маркеров форматирования
    let processedText = ''
    const parts = line.split(/(\*\*.*?\*\*)/g)

    for (const part of parts) {
      if (part.startsWith('**') && part.endsWith('**')) {
        processedText += part.slice(2, -2)
      } else {
        processedText += part
      }
    }

    // Разбиваем текст на строки с учетом максимальной ширины
    const splitText = doc.splitTextToSize(processedText, maxWidth)

    // Отрисовываем каждую строку
    for (const textLine of splitText) {
      doc.text(textLine, margin, yPos)
      yPos += 6
    }

    // Проверяем, нужно ли добавить новую страницу
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage()
      yPos = 20
    }
  }

  // Получаем PDF как массив байтов
  const pdfBytes = doc.output('arraybuffer')
  return Buffer.from(pdfBytes)
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
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: Prompt },
          { role: 'user', content: text },
        ],
      }),
    })

    const data = await response.json()
    const resultText = data.choices?.[0]?.message?.content || 'No response'

    // Создаем PDF с результатом
    const pdfBuffer = await createResultPDF(resultText, fileName)

    // Отправляем PDF как поток данных
    const response2 = new NextResponse(pdfBuffer)
    response2.headers.set('Content-Type', 'application/pdf')
    response2.headers.set('Content-Disposition', `attachment; filename="${fileName}.pdf"`)
    response2.headers.set('FileName', fileName)

    return response2
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
