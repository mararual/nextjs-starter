/**
 * Scenario Component
 * Renders a single scenario with steps and examples
 */

import React from 'react';
import { Scenario as ScenarioType } from '@/app/lib/features/types';
import Step from './Step';

interface ScenarioProps {
  readonly scenario: ScenarioType;
}

export default function Scenario({ scenario }: ScenarioProps): React.ReactElement {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Scenario Header */}
      <div className="border-b border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Scenario: {scenario.name}</h3>
        </div>

        {scenario.tags && scenario.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {scenario.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                  tag === '@not-implemented'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Scenario Description */}
      {scenario.description && (
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm text-gray-600">
          {scenario.description}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-0 px-6 py-4">
        {scenario.steps.map((step, idx) => (
          <Step key={idx} step={step} />
        ))}
      </div>

      {/* Examples Table */}
      {scenario.examples && scenario.examples.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <h4 className="mb-3 font-semibold text-gray-900">Examples:</h4>

          {scenario.examples.map((example, exIdx) => (
            <div key={exIdx} className="mb-4">
              {example.name && (
                <p className="mb-2 text-sm font-medium text-gray-700">{example.name}</p>
              )}

              <div className="overflow-x-auto rounded border border-gray-300 bg-white">
                <table className="w-full">
                  {example.header && example.header.length > 0 && (
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-200">
                        {example.header.map((header, hIdx) => (
                          <th
                            key={hIdx}
                            className="border-r border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900 last:border-r-0"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}

                  <tbody>
                    {example.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx % 2 === 0
                            ? 'border-b border-gray-200 bg-white'
                            : 'border-b border-gray-200 bg-gray-50'
                        }
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="border-r border-gray-200 px-4 py-2 text-sm text-gray-700 last:border-r-0"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
