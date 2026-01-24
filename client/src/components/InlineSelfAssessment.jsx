import { useState } from 'react'

const SCALE_LABELS = {
  1: 'Strongly disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly agree'
}

function InlineSelfAssessment({ criteria, onSubmit, isLoading = false }) {
  const [scores, setScores] = useState(() => {
    const initial = {}
    criteria.forEach(c => { initial[c.id] = null })
    return initial
  })

  const allScored = Object.values(scores).every(s => s !== null)

  const handleScore = (criterionId, score) => {
    setScores(prev => ({ ...prev, [criterionId]: score }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (allScored && !isLoading) {
      onSubmit(scores)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900">Rate your draft</h4>
        <p className="text-xs text-gray-500 mt-0.5">
          Be honest - this is where learning happens
        </p>
      </div>

      <div className="space-y-3">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 mb-2">
              {criterion.description}
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleScore(criterion.id, score)}
                  title={SCALE_LABELS[score]}
                  className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors
                    ${scores[criterion.id] === score
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!allScored || isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors"
      >
        {isLoading ? 'Getting AI assessment...' : 'See AI Assessment'}
      </button>
      {!allScored && (
        <p className="text-xs text-gray-500 text-center">
          Rate all {criteria.length} criteria to continue
        </p>
      )}
    </form>
  )
}

export default InlineSelfAssessment
