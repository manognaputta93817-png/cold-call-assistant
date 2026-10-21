import { useState } from 'react'
import {
    Target,
    MessageSquare,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Save,
    Loader2,
    CheckCircle,
    Lightbulb,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { saveStageResult, getStageSuggestion } from '../services/api'

export default function StageCard({
    stage,
    callId,
    savedResult,
    onSaved,
    onPrev,
    onNext,
    isFirst,
    isLast,
    callStatus,
}) {
    const [result, setResult] = useState(savedResult?.result || '')
    const [prospectWords, setProspectWords] = useState(savedResult?.prospect_words || '')
    const [callerNotes, setCallerNotes] = useState(savedResult?.caller_notes || '')
    const [saving, setSaving] = useState(false)
    const [loadingAI, setLoadingAI] = useState(false)
    const [aiSuggestion, setAiSuggestion] = useState(null)
    const [isDirty, setIsDirty] = useState(false)

    const isCompleted = callStatus === 'completed'

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
        setIsDirty(true)
    }

    const handleSave = async () => {
        if (!result) {
            toast.error('Please select a result for this stage.')
            return
        }
        setSaving(true)
        try {
            const saved = await saveStageResult(callId, {
                stage_number: stage.id,
                result,
                prospect_words: prospectWords,
                caller_notes: callerNotes,
            })
            setIsDirty(false)
            toast.success('Stage result saved!')
            onSaved(saved)
        } catch (err) {
            toast.error(err.message || 'Failed to save stage result.')
        } finally {
            setSaving(false)
        }
    }

    const handleNext = async () => {
        if (isDirty) {
            const confirmed = window.confirm('You have unsaved changes. Save before moving to the next stage?')
            if (confirmed) {
                await handleSave()
            }
        }
        onNext()
    }

    const handleGetAISuggestion = async () => {
        if (!prospectWords.trim()) {
            toast.error('Enter the prospect\'s words first to get an AI suggestion.')
            return
        }
        setLoadingAI(true)
        setAiSuggestion(null)
        try {
            const suggestion = await getStageSuggestion({
                current_stage: stage.id,
                prospect_words: prospectWords,
                caller_notes: callerNotes,
            })
            setAiSuggestion(suggestion)
        } catch (err) {
            toast.error(err.message || 'AI suggestion failed.')
        } finally {
            setLoadingAI(false)
        }
    }

    return (
        <div className="flex flex-col h-full overflow-auto">
            {/* Stage title banner */}
            <div className="card mx-4 mt-4 mb-0 p-4 border-brand-100 bg-gradient-to-r from-brand-50 to-white">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge bg-brand-100 text-brand-700">Stage {stage.id} of 8</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{stage.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{stage.purpose}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-4 p-4">
                {/* LEFT COLUMN: Guidance */}
                <div className="space-y-4">
                    {/* Caller Goal */}
                    <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                            <Target size={15} className="text-brand-600" /> Your Goal
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{stage.callerGoal}</p>
                    </div>

                    {/* Typical Prospect Responses */}
                    <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                            <MessageSquare size={15} className="text-purple-600" /> What They Commonly Say
                        </h3>
                        <ul className="space-y-1.5">
                            {stage.typicalProspectResponses.map((r, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                    <span className="text-purple-400 mt-0.5">›</span>
                                    <span className="italic">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Talking Points */}
                    <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                            <Lightbulb size={15} className="text-amber-500" /> Suggested Talking Points
                        </h3>
                        <ul className="space-y-1.5">
                            {stage.suggestedTalkingPoints.map((p, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                    <span className="text-amber-400 font-bold mt-0.5">·</span>
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Objections */}
                    {stage.objections && stage.objections.length > 0 && (
                        <div className="card p-4">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                <HelpCircle size={15} className="text-red-500" /> Objection Handling
                            </h3>
                            <div className="space-y-3">
                                {stage.objections.map((obj, i) => (
                                    <div key={i} className="border-l-2 border-red-200 pl-3">
                                        <p className="text-xs font-semibold text-red-600 mb-1">"{obj.objection}"</p>
                                        <p className="text-xs text-gray-600">→ {obj.response}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tip */}
                    <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
                        <p className="text-xs text-amber-800">
                            <span className="font-semibold">💡 Tip: </span>
                            {stage.tipForCaller}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Record results */}
                <div className="space-y-4">
                    {/* Result selector */}
                    <div className="card p-4">
                        <label className="label">Stage Outcome *</label>
                        <select
                            value={result}
                            onChange={handleChange(setResult)}
                            disabled={isCompleted}
                            className="input"
                        >
                            <option value="">— Select what happened —</option>
                            {stage.availableResults.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Prospect words */}
                    <div className="card p-4">
                        <label className="label">
                            Prospect's Actual Words
                            <span className="ml-1 text-gray-400 font-normal text-xs">(type what they said)</span>
                        </label>
                        <textarea
                            value={prospectWords}
                            onChange={handleChange(setProspectWords)}
                            disabled={isCompleted}
                            rows={4}
                            className="input resize-none"
                            placeholder="e.g. We already have a process, but it takes too much time."
                        />

                        {/* AI Suggestion button */}
                        {!isCompleted && (
                            <button
                                onClick={handleGetAISuggestion}
                                disabled={loadingAI}
                                className="mt-2 btn-secondary text-xs !py-1.5"
                            >
                                {loadingAI ? (
                                    <><Loader2 size={12} className="animate-spin" /> Getting AI suggestion…</>
                                ) : (
                                    <>✨ Get AI suggestion</>
                                )}
                            </button>
                        )}
                    </div>

                    {/* AI Suggestion panel */}
                    {aiSuggestion && (
                        <div className="card p-4 border-brand-200 bg-brand-50">
                            <h4 className="text-sm font-semibold text-brand-800 mb-2">
                                ✨ AI Suggestion{' '}
                                <span className="text-xs font-normal text-brand-600">
                                    (suggestion only — you decide)
                                </span>
                            </h4>
                            {aiSuggestion.suggested_stage_name && (
                                <p className="text-xs text-brand-700 mb-1">
                                    <span className="font-medium">Suggested stage:</span>{' '}
                                    {aiSuggestion.suggested_stage_name}
                                </p>
                            )}
                            {aiSuggestion.explanation && (
                                <p className="text-sm text-gray-700 mb-2">{aiSuggestion.explanation}</p>
                            )}
                            {aiSuggestion.suggested_question && (
                                <div className="bg-white rounded-lg border border-brand-200 p-3 mt-2">
                                    <p className="text-xs font-semibold text-brand-700 mb-1">Suggested next question:</p>
                                    <p className="text-sm text-gray-800 italic">"{aiSuggestion.suggested_question}"</p>
                                    {aiSuggestion.question_rationale && (
                                        <p className="text-xs text-gray-500 mt-1">{aiSuggestion.question_rationale}</p>
                                    )}
                                </div>
                            )}
                            {aiSuggestion.confidence && (
                                <p className="text-xs text-brand-600 mt-2">
                                    Confidence: <span className="font-medium">{aiSuggestion.confidence}</span>
                                </p>
                            )}
                            <button
                                className="text-xs text-gray-400 mt-2 hover:text-gray-600"
                                onClick={() => setAiSuggestion(null)}
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Caller notes */}
                    <div className="card p-4">
                        <label className="label">
                            Caller Notes
                            <span className="ml-1 text-gray-400 font-normal text-xs">(optional internal notes)</span>
                        </label>
                        <textarea
                            value={callerNotes}
                            onChange={handleChange(setCallerNotes)}
                            disabled={isCompleted}
                            rows={3}
                            className="input resize-none"
                            placeholder="Any notes for your follow-up or CRM…"
                        />
                    </div>

                    {/* Save button */}
                    {!isCompleted && (
                        <button
                            onClick={handleSave}
                            disabled={saving || !result}
                            className="btn-primary w-full justify-center"
                        >
                            {saving ? (
                                <><Loader2 size={15} className="animate-spin" /> Saving…</>
                            ) : (
                                <><Save size={15} /> Save Stage Result</>
                            )}
                        </button>
                    )}

                    {savedResult?.updated_at && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle size={12} /> Last saved: {new Date(savedResult.updated_at).toLocaleTimeString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom navigation */}
            <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
                <button onClick={onPrev} disabled={isFirst || isCompleted} className="btn-secondary">
                    <ChevronLeft size={16} /> Previous
                </button>
                <button onClick={handleNext} disabled={isLast} className="btn-primary">
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}
