import { anthropic, parseJsonResponse } from './lib/anthropic.js'
import { CONFIG } from './lib/config.js'

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { draft, criteria, context } = req.body

  if (!draft || !criteria || !context) {
    return res.status(400).json({ error: 'Draft, criteria, and context are required' })
  }

  const criteriaList = criteria.map((c, i) => `${i + 1}. [ID: ${c.id}] ${c.description}`).join('\n')

  const prompt = `You are a writing coach assessing a draft. Score how well it meets each criterion on a 1-5 scale:
1 = Strongly disagree (criterion not met at all)
2 = Disagree (criterion barely met)
3 = Neutral (criterion partially met)
4 = Agree (criterion mostly met)
5 = Strongly agree (criterion fully met)

**Context:**
- Audience: ${context.audience}
- Intent: ${context.intent}
- Concerns: ${context.concerns}
- Type: ${context.type}

**Criteria to assess:**
${criteriaList}

**Draft to assess:**
${draft}

For each criterion, provide:
- A score (1-5)
- Brief reasoning (1-2 sentences explaining why you gave that score, with specific examples from the draft)

Respond with JSON only, no other text:
{
  "scores": {
    "criterion_id": score_number,
    ...
  },
  "reasoning": {
    "criterion_id": "explanation string",
    ...
  }
}`

  try {
    const message = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens.assessDraft,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].text
    const parsed = parseJsonResponse(responseText)

    res.status(200).json({
      scores: parsed.scores,
      reasoning: parsed.reasoning
    })
  } catch (err) {
    console.error('Error assessing draft:', err)
    res.status(500).json({ error: 'Failed to assess draft' })
  }
}
