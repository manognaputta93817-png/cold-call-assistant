import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCall } from '../services/api'
import {
    Loader2,
    ArrowLeft,
    CheckCircle,
    User,
    Building2,
    Clock,
    Briefcase,
    FileText,
    AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { STAGES } from '../data/stages'

export default function CallDetail() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getCall(id)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-brand-600" size={28} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="card p-6 text-center border-red-200">
                    <AlertCircle className="mx-auto text-red-400 mb-2" size={28} />
                    <p className="text-red-600 font-medium">{error}</p>
                    <Link to="/history" className="btn-secondary mt-3 inline-flex">Back to History</Link>
                </div>
            </div>
        )
    }

    const { call, stage_results: stageResults = [] } = data
    const resultMap = {}
    stageResults.forEach((r) => { resultMap[r.stage_number] = r })

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
                <ArrowLeft size={14} /> Back to History
            </Link>

            {/* Call overview */}
            <div className="card p-5 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <User size={20} className="text-brand-600" />
                            {call.prospect_name}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                            <Building2 size={14} /> {call.company}
                            {call.prospect_role && <span className="text-gray-400">· {call.prospect_role}</span>}
                        </p>
                    </div>
                    <span className={`badge ${call.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {call.status === 'completed' ? <><CheckCircle size={11} className="mr-1" /> Completed</> : 'Active'}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Started</p>
                        <p className="font-medium">
                            {call.started_at ? format(new Date(call.started_at), 'MMM d, yyyy HH:mm') : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Ended</p>
                        <p className="font-medium">
                            {call.ended_at ? format(new Date(call.ended_at), 'MMM d, yyyy HH:mm') : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Final Outcome</p>
                        <p className="font-medium capitalize">{call.outcome?.replace(/_/g, ' ') || '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Stages Reached</p>
                        <p className="font-medium">{stageResults.length} / 8</p>
                    </div>
                </div>

                {call.pre_call_notes && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-400 mb-1">Pre-call Notes</p>
                        <p className="text-sm text-gray-600">{call.pre_call_notes}</p>
                    </div>
                )}
            </div>

            {/* AI Summary */}
            {call.summary && (
                <div className="card p-5 mb-6 border-brand-200 bg-brand-50">
                    <h2 className="font-semibold text-brand-800 flex items-center gap-2 mb-3">
                        ✨ AI Call Summary
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {call.summary}
                    </div>
                </div>
            )}

            {/* Stage results */}
            <h2 className="font-semibold text-gray-900 mb-3">Stage Notes</h2>
            <div className="space-y-3">
                {STAGES.map((stage) => {
                    const result = resultMap[stage.id]
                    if (!result) {
                        return (
                            <div key={stage.id} className="card p-4 flex items-center gap-3 opacity-50">
                                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0">
                                    {stage.id}
                                </span>
                                <p className="text-sm text-gray-400">{stage.name} — not reached</p>
                            </div>
                        )
                    }
                    return (
                        <div key={stage.id} className="card p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                                    <CheckCircle size={12} />
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{stage.name}</p>
                                    <span className="badge bg-gray-100 text-gray-600 capitalize">
                                        {result.result?.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <p className="ml-auto text-xs text-gray-400">
                                    {result.updated_at
                                        ? format(new Date(result.updated_at), 'HH:mm')
                                        : ''}
                                </p>
                            </div>

                            {result.prospect_words && (
                                <div className="bg-purple-50 rounded-lg p-3 mb-2 border border-purple-100">
                                    <p className="text-xs font-semibold text-purple-600 mb-1">Prospect's Words</p>
                                    <p className="text-sm text-gray-700 italic">"{result.prospect_words}"</p>
                                </div>
                            )}

                            {result.caller_notes && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Caller Notes</p>
                                    <p className="text-sm text-gray-600">{result.caller_notes}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
