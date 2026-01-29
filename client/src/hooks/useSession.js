import { useState } from 'react'
import { API_ENDPOINTS } from '../config'

const INITIAL_SESSION = {
  context: {
    audience: '',
    intent: '',
    concerns: '',
    type: ''
  },
  criteria: [],
  iterations: [],
  workingDraft: '',
  currentIterationId: null
}

/**
 * Custom hook for managing writing session state and API interactions
 */
export function useSession() {
  const [session, setSession] = useState(INITIAL_SESSION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const updateContext = (newContext) => {
    setSession(prev => ({ ...prev, context: newContext }))
  }

  const extractCriteria = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.EXTRACT_CRITERIA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: session.context })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to extract criteria')
      }

      setSession(prev => ({ ...prev, criteria: data.criteria }))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const submitDraft = (draft) => {
    const newIterationId = session.iterations.length + 1
    const newIteration = {
      id: newIterationId,
      draft,
      selfAssessment: null,
      aiAssessment: null
    }

    setSession(prev => ({
      ...prev,
      iterations: [...prev.iterations, newIteration],
      currentIterationId: newIterationId
    }))

    return newIterationId
  }

  const submitSelfAssessment = async (iterationId, scores) => {
    // Update self-assessment immediately
    setSession(prev => ({
      ...prev,
      iterations: prev.iterations.map(iter =>
        iter.id === iterationId
          ? { ...iter, selfAssessment: scores }
          : iter
      )
    }))

    setIsLoading(true)
    setError(null)

    try {
      const iteration = session.iterations.find(i => i.id === iterationId)
      const response = await fetch(API_ENDPOINTS.ASSESS_DRAFT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: iteration.draft,
          criteria: session.criteria,
          context: session.context
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to get AI assessment')
      }

      setSession(prev => ({
        ...prev,
        iterations: prev.iterations.map(iter =>
          iter.id === iterationId
            ? { ...iter, aiAssessment: data }
            : iter
        ),
        workingDraft: iteration.draft,
        currentIterationId: null
      }))

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Derived state
  const editorDisabled = session.currentIterationId !== null
  const hasCriteria = session.criteria.length > 0

  return {
    // State
    session,
    isLoading,
    error,

    // Derived state
    editorDisabled,
    hasCriteria,

    // Actions
    clearError,
    updateContext,
    extractCriteria,
    submitDraft,
    submitSelfAssessment
  }
}
