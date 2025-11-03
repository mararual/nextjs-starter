/**
 * Step Component
 * Renders individual Given/When/Then steps with syntax highlighting
 */

import React from 'react';
import { Step as StepType } from '@/app/lib/features/types';

interface StepProps {
  readonly step: StepType;
}

const keywordColors: Record<string, string> = {
  Given: 'text-blue-600',
  When: 'text-purple-600',
  Then: 'text-green-600',
  And: 'text-gray-600',
  But: 'text-gray-600',
  '*': 'text-gray-600',
};

export default function Step({ step }: StepProps): React.ReactElement {
  const keywordClass = keywordColors[step.keyword.trim()] || 'text-gray-600';

  return (
    <div className="mb-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <span className={`font-semibold ${keywordClass}`}>{step.keyword}</span>
      <div className="flex-1">
        <p className="text-gray-900">{step.text}</p>

        {step.docString && (
          <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-2 text-sm text-gray-100">
            <code>{step.docString}</code>
          </pre>
        )}

        {step.dataTable && step.dataTable.length > 0 && (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {step.dataTable.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={
                      rowIdx === 0
                        ? 'border-b-2 border-gray-400 bg-gray-200'
                        : 'border-b border-gray-200'
                    }
                  >
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border-r border-gray-200 px-2 py-1">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
