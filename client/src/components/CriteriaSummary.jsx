import { useState } from 'react'

function CriteriaSummary({ criteria }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-100 transition-colors rounded-lg"
      >
        <span className="text-sm font-medium text-gray-700">
          Your criteria ({criteria.length})
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <div className="px-3 pb-3">
          <ul className="text-sm text-gray-600 space-y-1">
            {criteria.map((c) => (
              <li key={c.id} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{c.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CriteriaSummary
