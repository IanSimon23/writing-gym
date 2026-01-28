import Anthropic from '@anthropic-ai/sdk'

// Shared Anthropic client instance
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

/**
 * Parse JSON from Claude response, stripping markdown code blocks if present
 * @param {string} text - Raw response text from Claude
 * @returns {object} Parsed JSON object
 * @throws {Error} If JSON parsing fails
 */
export function parseJsonResponse(text) {
  try {
    const stripped = text
      .replace(/^```(?:json)?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim()
    return JSON.parse(stripped)
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${err.message}`)
  }
}
