// Client-side configuration

export const API_ENDPOINTS = {
  EXTRACT_CRITERIA: '/api/extract-criteria',
  ASSESS_DRAFT: '/api/assess-draft'
}

// Assessment scale: [min, max]
export const ASSESSMENT_SCALE = [1, 5]

// Generate array of scale values from range
export function getScaleValues() {
  const [min, max] = ASSESSMENT_SCALE
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}

// Labels for each scale value
export const SCALE_LABELS = {
  1: 'Strongly disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly agree'
}
