import { useState, useEffect } from 'react'

function DraftEditor({ initialValue = '', onSubmit, disabled = false }) {
  const [draft, setDraft] = useState(initialValue)

  useEffect(() => {
    setDraft(initialValue)
  }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (draft.trim() && !disabled) {
      onSubmit(draft)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-2">
          Your draft
        </label>
        <textarea
          id="draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Start writing..."
          disabled={disabled}
          className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            font-mono text-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-sm text-gray-500">
          {draft.length} characters
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!draft.trim() || disabled}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          Submit for Assessment
        </button>
      </div>
    </form>
  )
}

export default DraftEditor
