declare module 'pdf-parse' {
  interface PDFData {
    text: string
    numpages: number
    info: Record<string, any>
  }

  function PDFParse(dataBuffer: Buffer, options?: Record<string, any>): Promise<PDFData>
  export default PDFParse
}
