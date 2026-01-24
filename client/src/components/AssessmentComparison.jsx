function ScoreBadge({ score, variant = 'default' }) {
  const colors = {
    default: 'bg-gray-100 text-gray-700',
    self: 'bg-blue-100 text-blue-700',
    ai: 'bg-purple-100 text-purple-700'
  }

  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${colors[variant]}`}>
      {score}
    </span>
  )
}

function DeltaIndicator({ selfScore, aiScore }) {
  const delta = selfScore - aiScore

  if (delta === 0) {
    return <span className="text-xs text-gray-500">Match</span>
  }

  const isOverconfident = delta > 0

  return (
    <span className={`text-xs font-medium ${isOverconfident ? 'text-amber-600' : 'text-teal-600'}`}>
      {isOverconfident ? `+${delta}` : delta}
    </span>
  )
}

function AssessmentComparison({ criteria, selfAssessment, aiAssessment }) {
  const getDeltaClass = (selfScore, aiScore) => {
    const delta = Math.abs(selfScore - aiScore)
    if (delta === 0) return 'border-gray-200 bg-white'
    if (delta === 1) return 'border-amber-200 bg-amber-50'
    return 'border-amber-400 bg-amber-50'
  }

  const totalSelf = criteria.reduce((sum, c) => sum + (selfAssessment[c.id] || 0), 0)
  const totalAi = criteria.reduce((sum, c) => sum + (aiAssessment.scores[c.id] || 0), 0)
  const avgSelf = (totalSelf / criteria.length).toFixed(1)
  const avgAi = (totalAi / criteria.length).toFixed(1)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-600 font-medium">You</p>
          <p className="text-lg font-bold text-blue-700">{avgSelf}</p>
        </div>
        <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center">
          <p className="text-xs text-purple-600 font-medium">AI</p>
          <p className="text-lg font-bold text-purple-700">{avgAi}</p>
        </div>
      </div>

      <div className="space-y-2">
        {criteria.map((criterion) => {
          const selfScore = selfAssessment[criterion.id]
          const aiScore = aiAssessment.scores[criterion.id]
          const reasoning = aiAssessment.reasoning[criterion.id]

          return (
            <div
              key={criterion.id}
              className={`border rounded-lg p-3 ${getDeltaClass(selfScore, aiScore)}`}
            >
              <p className="text-sm font-medium text-gray-900 mb-2">
                {criterion.description}
              </p>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">You:</span>
                  <ScoreBadge score={selfScore} variant="self" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">AI:</span>
                  <ScoreBadge score={aiScore} variant="ai" />
                </div>
                <DeltaIndicator selfScore={selfScore} aiScore={aiScore} />
              </div>

              {reasoning && (
                <p className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                  {reasoning}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AssessmentComparison
