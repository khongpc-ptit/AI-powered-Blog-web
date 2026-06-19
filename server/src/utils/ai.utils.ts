// Placeholder cho logic AI tạo nội dung Blog
// export const generateBlogContentAI = async (prompt: string): Promise<string> => {
//   // Trong tương lai sẽ gọi API tới OpenAI hoặc Google Gemini ở đây
//   // Hiện tại trả về mock data
//   return `Đây là nội dung được tự động tạo bởi AI dựa trên prompt: "${prompt}".\n\nBạn có thể thay thế nó bằng việc kết nối API thật.`
// }
import { GoogleGenAI } from '@google/genai'

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY })

async function generateBlogContentAI(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  })
  return response.text
}

export default generateBlogContentAI
