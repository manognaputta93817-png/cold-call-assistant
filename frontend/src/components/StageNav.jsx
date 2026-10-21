import { Check } from 'lucide-react'
import { STAGES } from '../data/stages'

export default function StageNav({ currentStage, completedStages = [], onStageSelect, disabled }) {
    return (
        <div className="w-full md:w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="px-3 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stages</p>
            </div>
            <nav className="py-2">
                {STAGES.map((stage) => {
                    const isActive = stage.id === currentStage
                    const isCompleted = completedStages.includes(stage.id)
                    const isPast = stage.id < currentStage

                    return (
                        <button
                            key={stage.id}
                            onClick={() => !disabled && onStageSelect(stage.id)}
                            disabled={disabled}
                            className={[
                                'w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors duration-100',
                                isActive
                                    ? 'bg-brand-50 border-r-2 border-brand-600'
                                    : 'hover:bg-gray-50',
                                disabled ? 'cursor-default' : 'cursor-pointer',
                            ].join(' ')}
                        >
                            {/* Stage number / check icon */}
                            <div
                                className={[
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                                    isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? 'bg-brand-600 text-white'
                                            : isPast
                                                ? 'bg-gray-200 text-gray-500'
                                                : 'bg-gray-100 text-gray-400',
                                ].join(' ')}
                            >
                                {isCompleted ? <Check size={11} /> : stage.id}
                            </div>

                            {/* Stage name */}
                            <div className="min-w-0">
                                <p
                                    className={[
                                        'text-xs font-medium leading-tight truncate',
                                        isActive
                                            ? 'text-brand-700'
                                            : isCompleted
                                                ? 'text-green-700'
                                                : 'text-gray-500',
                                    ].join(' ')}
                                >
                                    {stage.shortName}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
