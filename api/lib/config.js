// Centralized configuration for API functions
// Override via environment variables in production

export const CONFIG = {
  // Claude model - using Sonnet for speed/cost balance
  // Sonnet is fast enough for interactive use (1-3s vs 5-10s for Opus)
  // Override with CLAUDE_MODEL env var to test other models
  model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',

  // Token limits by endpoint
  maxTokens: {
    extractCriteria: 1024,
    assessDraft: 2048
  },

  // Assessment scale (used for criteria)
  assessmentScale: [1, 5],

  // Criteria extraction limits
  criteria: {
    min: 3,
    max: 5
  }
}
