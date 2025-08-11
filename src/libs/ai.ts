import OpenAI from 'openai'

export const liaraClient = new OpenAI({
  baseURL: process.env.LIARA_AI_BASE_URL!,
  apiKey: process.env.LIARA_AI_API_KEY!,
})
