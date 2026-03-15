import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { GoogleGenerativeAI } from '@google/generative-ai'

const app = new Hono()

app.use('/api/*', cors())

// Simple RPD limiter
const RPD_LIMIT = 20; // contoh limit harian
let rpdCount = 0;
let lastReset = new Date();

function resetRPDIfNeeded() {
  const now = new Date();
  // Reset setiap jam 00:00 UTC
  if (
    now.getUTCDate() !== lastReset.getUTCDate() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCFullYear() !== lastReset.getUTCFullYear()
  ) {
    rpdCount = 0;
    lastReset = now;
  }
}

app.post('/api/chat', async (c) => {
  resetRPDIfNeeded();
  if (rpdCount >= RPD_LIMIT) {
    return c.json({ error: 'Limit harian tercapai, silakan coba besok.' }, 429);
  }
  rpdCount++;

  console.log("--- Permintaan Masuk ---")
  try {
    const { message } = await c.req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error("ERROR: API Key tidak ada di file .env")
      return c.json({ error: "Konfigurasi API Key salah" }, 500)
    }

    console.log("Menghubungi Google API...")
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const result = await model.generateContent(message)
    const aiReply = result.response.text()

    console.log("Berhasil mendapatkan jawaban!")
    return c.json({ reply: aiReply })

  } catch (error: any) {
    console.error("--- DETAIL ERROR BACKEND ---");
    console.error("Pesan:", error.message);
    if (error.stack) console.error("Stack:", error.stack);
    
    return c.json({ 
      error: "Internal Server Error", 
      message: error.message 
    }, 500);
  }
})

app.get('/', (c) => c.text('Server Backend Aktif di Port 3000!'))

serve({ fetch: app.fetch, port: 3000 })