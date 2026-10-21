import { format, formatDistanceToNow } from 'date-fns'
import { Clock, User, Building2, ArrowLeft, CheckCircle } from 'lucide-react'
import { STAGES } from '../data/stages'
import { useNavigate } from 'react-router-dom'

export default function CallHeader({ call, currentStage }) {
    const navigate = useNavigate()
    const progress = call ? Math.round(((currentStage - 1) / 8) * 100) : 0

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
                {/* Back button */}
                <button
                    onClick={() => navigate('/history')}
                    className="btn-secondary !px-2.5 !py-2"
                    title="Back to history"
                >
                    <ArrowLeft size={16} />
                </button>

                {/* Prospect info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                                <User size={18} className="text-brand-600" />
                                {call?.prospect_name || '—'}
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                <Building2 size={13} />
                                {call?.company || '—'}
                                {call?.prospect_role && (
                                    <span className="text-gray-400">· {call.prospect_role}</span>
                                )}
                            </p>
                        </div>

                        {/* Status badge */}
                        <span
                            className={`badge ${call?.status === 'completed'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}
                        >
                            {call?.status === 'completed' ? (
                                <><CheckCircle size={11} className="mr-1" /> Completed</>
                            ) : (
                                <><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse" />Active</>
                            )}
                        </span>
                    </div>
                </div>

                {/* Call stats */}
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {call?.started_at
                            ? formatDistanceToNow(new Date(call.started_at), { addSuffix: true })
                            : '—'}
                    </div>
                    <div className="text-gray-300">|</div>
                    <div className="font-medium text-gray-700">
                        Stage {currentStage} / {STAGES.length}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">
                        {STAGES.find((s) => s.id === currentStage)?.name || 'Stage 1'}
                    </span>
                    <span className="text-xs font-medium text-brand-600">{progress}% complete</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
