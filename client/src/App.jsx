import { useState } from 'react'
import PreDraftQuestions from './components/PreDraftQuestions'
import Workspace from './components/Workspace'
import { useSession } from './hooks/useSession'

const PHASES = {
  CONTEXT: 'context',
  WORKSPACE: 'workspace'
}

function App() {
  const [phase, setPhase] = useState(PHASES.CONTEXT)

  const {
    session,
    isLoading,
    error,
    editorDisabled,
    updateContext,
    resetSession,
    extractCriteria,
    submitDraft,
    submitSelfAssessment
  } = useSession()

  const handleContextSubmit = async () => {
    const result = await extractCriteria()
    if (result.success) {
      setPhase(PHASES.WORKSPACE)
    }
  }

  const renderError = () => {
    if (!error) return null
    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    )
  }

  const renderPhase = () => {
    switch (phase) {
      case PHASES.CONTEXT:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              {renderError()}
              <PreDraftQuestions
                context={session.context}
                onUpdate={updateContext}
                onSubmit={handleContextSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        )
      case PHASES.WORKSPACE:
        return (
          <>
            <div className="max-w-3xl mx-auto">
              {renderError()}
            </div>
            <Workspace
              criteria={session.criteria}
              iterations={session.iterations}
              workingDraft={session.workingDraft}
              currentIterationId={session.currentIterationId}
              onDraftSubmit={submitDraft}
              onSelfAssessSubmit={submitSelfAssessment}
              isLoading={isLoading}
              editorDisabled={editorDisabled}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">The Writing Gym</h1>
            <p className="text-sm text-gray-500">Coach, don't rewrite</p>
          </div>
          {phase === PHASES.WORKSPACE && (
            <button
              onClick={() => { resetSession(); setPhase(PHASES.CONTEXT) }}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderPhase()}
      </main>
    </div>
  )
}

export default App
