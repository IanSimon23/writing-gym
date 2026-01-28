import { anthropic, parseJsonResponse } from './lib/anthropic.js'
import { CONFIG } from './lib/config.js'

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { context } = req.body

  if (!context) {
    return res.status(400).json({ error: 'Context is required' })
  }

  const prompt = `You are a writing coach helping someone prepare to write. Based on their answers below, extract 3-5 specific criteria they can use to assess whether their draft succeeds.

**Audience:** ${context.audience}
**Intent (what they want the reader to think/feel/do):** ${context.intent}
**Concerns:** ${context.concerns}
**Writing type:** ${context.type}

Extract criteria that:
- Are specific and measurable (can be rated 1-5)
- Reflect what THEY said matters, not generic writing advice
- Include both positive goals (what to achieve) and concerns to avoid
- Are phrased as statements to rate agreement with (e.g., "The tone feels supportive, not condescending")

Respond with JSON only, no other text:
{
  "criteria": [
    {
      "id": "1",
      "description": "criterion text here",
      "extracted_from": "audience|intent|concerns|type"
    }
  ]
}`

  try {
    const message = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens.extractCriteria,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].text
    const parsed = parseJsonResponse(responseText)

    // Add scale to each criterion
    const criteria = parsed.criteria.map(c => ({
      ...c,
      scale: CONFIG.assessmentScale
    }))

    res.status(200).json({ criteria })
  } catch (err) {
    console.error('Error extracting criteria:', err)
    res.status(500).json({ error: 'Failed to extract criteria' })
  }
}
