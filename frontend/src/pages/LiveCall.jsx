import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2, FlagOff, CheckCircle } from 'lucide-react'
import { getCall, finishCall } from '../services/api'
import { STAGES, FINAL_OUTCOMES, getStageById } from '../data/stages'
import CallHeader from '../components/CallHeader'
import StageNav from '../components/StageNav'
import StageCard from '../components/StageCard'

export default function LiveCall() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [call, setCall] = useState(null)
    const [stageResults, setStageResults] = useState({}) // { stageNum: result }
    const [currentStage, setCurrentStage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFinish, setShowFinish] = useState(false)
    const [finishing, setFinishing] = useState(false)
    const [finalOutcome, setFinalOutcome] = useState('')
    const [finalNote, setFinalNote] = useState('')

    const loadCall = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getCall(id)
            setCall(data.call)
            // Index stage results by stage_number
            const resultMap = {}
                ; (data.stage_results || []).forEach((r) => {
                    resultMap[r.stage_number] = r
                })
            setStageResults(resultMap)
            setCurrentStage(data.call.current_stage || 1)
        } catch (err) {
            setError(err.message || 'Failed to load call.')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadCall()
    }, [loadCall])

    const handleStageSaved = (saved) => {
        setStageResults((prev) => ({ ...prev, [saved.stage_number]: saved }))
    }

    const completedStages = Object.values(stageResults)
        .filter((r) => r.result)
        .map((r) => r.stage_number)

    const handleFinish = async () => {
        if (!finalOutcome) {
            toast.error('Please select a final outcome.')
            return
        }
        setFinishing(true)
        try {
            await finishCall(id, { outcome: finalOutcome, final_note: finalNote })
            toast.success('Call completed and summary generated!')
            navigate(`/history/${id}`)
        } catch (err) {
            toast.error(err.message || 'Failed to finish call.')
        } finally {
            setFinishing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto text-brand-600 mb-3" size={32} />
                    <p className="text-gray-500 text-sm">Loading call…</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2">Error loading call</p>
                    <p className="text-gray-500 text-sm mb-4">{error}</p>
                    <button onClick={loadCall} className="btn-primary">Retry</button>
                </div>
            </div>
        )
    }

    const stage = getStageById(currentStage)
    const isCompleted = call?.status === 'completed'

    return (
        <div className="flex flex-col h-screen">
            <CallHeader call={call} currentStage={currentStage} />

            <div className="flex flex-1 overflow-hidden">
                <StageNav
                    currentStage={currentStage}
                    completedStages={completedStages}
                    onStageSelect={setCurrentStage}
                    disabled={isCompleted}
                />

                <div className="flex-1 overflow-auto bg-gray-50">
                    {/* Finish Call Banner */}
                    {!isCompleted && (
                        <div className="mx-4 mt-4">
                            {!showFinish ? (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowFinish(true)}
                                        className="btn-danger text-sm"
                                    >
                                        <FlagOff size={15} /> Finish Call
                                    </button>
                                </div>
                            ) : (
                                <div className="card p-4 border-red-200 bg-red-50">
                                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                        <FlagOff size={16} /> Finish Call
                                    </h3>
                                    <p className="text-sm text-red-700 mb-3">
                                        Select the final outcome for this call. This will generate an AI summary of your notes.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="label">Final Outcome *</label>
                                            <select
                                                value={finalOutcome}
                                                onChange={(e) => setFinalOutcome(e.target.value)}
                                                className="input"
                                            >
                                                <option value="">— Select outcome —</option>
                                                {FINAL_OUTCOMES.map((o) => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Final Note (optional)</label>
                                            <input
                                                type="text"
                                                value={finalNote}
                                                onChange={(e) => setFinalNote(e.target.value)}
                                                className="input"
                                                placeholder="Any final comment…"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleFinish}
                                            disabled={finishing || !finalOutcome}
                                            className="btn-danger"
                                        >
                                            {finishing ? (
                                                <><Loader2 size={14} className="animate-spin" /> Finishing…</>
                                            ) : (
                                                <><CheckCircle size={14} /> Confirm &amp; Finish</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowFinish(false)}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Completed banner */}
                    {isCompleted && (
                        <div className="mx-4 mt-4 card p-3 border-green-200 bg-green-50 flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <p className="text-sm text-green-800 font-medium">
                                Call completed — outcome: <span className="font-bold">{call.outcome}</span>
                            </p>
                            <button
                                onClick={() => navigate(`/history/${id}`)}
                                className="ml-auto btn-secondary text-xs !py-1"
                            >
                                View Summary
                            </button>
                        </div>
                    )}

                    <StageCard
                        key={currentStage}
                        stage={stage}
                        callId={id}
                        savedResult={stageResults[currentStage]}
                        onSaved={handleStageSaved}
                        onPrev={() => setCurrentStage((s) => Math.max(1, s - 1))}
                        onNext={() => setCurrentStage((s) => Math.min(STAGES.length, s + 1))}
                        isFirst={currentStage === 1}
                        isLast={currentStage === STAGES.length}
                        callStatus={call?.status}
                    />
                </div>
            </div>
        </div>
    )
}
