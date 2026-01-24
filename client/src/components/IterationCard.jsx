import InlineSelfAssessment from './InlineSelfAssessment'
import AssessmentComparison from './AssessmentComparison'

function IterationCard({
  iteration,
  criteria,
  onSelfAssessSubmit,
  isLoading = false,
  isActive = false
}) {
  const { id, draft, selfAssessment, aiAssessment } = iteration
  const needsSelfAssessment = !selfAssessment
  const needsAiAssessment = selfAssessment && !aiAssessment
  const isComplete = selfAssessment && aiAssessment

  return (
    <div className={`border rounded-lg overflow-hidden ${isActive ? 'border-blue-300 shadow-sm' : 'border-gray-200'}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Iteration {id}
          {isComplete && (
            <span className="ml-2 text-xs font-normal text-green-600">Complete</span>
          )}
          {needsSelfAssessment && isActive && (
            <span className="ml-2 text-xs font-normal text-blue-600">Self-assess now</span>
          )}
          {needsAiAssessment && (
            <span className="ml-2 text-xs font-normal text-purple-600">Getting AI feedback...</span>
          )}
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Draft preview */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Draft</p>
          <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {draft}
            </p>
          </div>
        </div>

        {/* Self-assessment form or completed assessment */}
        {needsSelfAssessment && isActive && (
          <InlineSelfAssessment
            criteria={criteria}
            onSubmit={onSelfAssessSubmit}
            isLoading={isLoading}
          />
        )}

        {/* Show comparison when both assessments are complete */}
        {isComplete && (
          <AssessmentComparison
            criteria={criteria}
            selfAssessment={selfAssessment}
            aiAssessment={aiAssessment}
          />
        )}
      </div>
    </div>
  )
}

export default IterationCard
