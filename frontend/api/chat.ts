import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }

    let body = req.body
    if (!body || Object.keys(body).length === 0) {
      body = await new Promise((resolve, reject) => {
        let data = ''
        req.on('data', (chunk: any) => (data += chunk))
        req.on('end', () => {
          try {
            resolve(data ? JSON.parse(data) : {})
          } catch (e) {
            reject(e)
          }
        })
        req.on('error', reject)
      })
    }

    const { message } = body as { message?: string }
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error('ERROR: GEMINI_API_KEY tidak ditemukan')
      res.status(500).json({ error: 'Konfigurasi API Key salah' })
      return
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent(message)
    const aiReply = typeof result.response?.text === 'function'
      ? result.response.text()
      : String(result.response ?? '')

    res.status(200).json({ reply: aiReply })
  } catch (error: any) {
    console.error('ERROR /api/chat', error)
    res.status(500).json({ error: 'Internal Server Error', message: error?.message })
  }
}
