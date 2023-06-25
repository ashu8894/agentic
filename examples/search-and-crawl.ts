import 'dotenv/config'
import { OpenAIClient } from 'openai-fetch'
import { z } from 'zod'

import { Agentic, SearchAndCrawlTool } from '@/index'

async function main() {
  const openai = new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY! })
  const agentic = new Agentic({ openai })

  const topic = process.argv[2] || 'OpenAI'

  const res = await agentic
    .gpt4({
      messages: [
        {
          role: 'system',
          content: `You are a McKinsey analyst who is an expert at writing executive summaries. Always cite your sources and respond using Markdown.`
        },
        {
          role: 'user',
          content: `Summarize the latest news on: {{topic}}`
        }
      ],
      model: 'gpt-4-32k'
    })
    .tools([new SearchAndCrawlTool()])
    .input(
      z.object({
        topic: z.string()
      })
    )
    .call({ topic })

  console.log(`\n\n\n${res}\n\n\n`)
}

main()
