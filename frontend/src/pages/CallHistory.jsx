import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getCalls } from '../services/api'
import {
    Search,
    Filter,
    Phone,
    Clock,
    CheckCircle,
    ExternalLink,
    Loader2,
    InboxIcon,
    AlertCircle,
    ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { STAGES } from '../data/stages'

const OUTCOME_LABELS = {
    meeting_booked: { label: 'Meeting Booked', color: 'bg-green-100 text-green-700' },
    follow_up_scheduled: { label: 'Follow-up Scheduled', color: 'bg-blue-100 text-blue-700' },
    next_step_agreed: { label: 'Next Step Agreed', color: 'bg-blue-100 text-blue-700' },
    info_sent: { label: 'Info Sent', color: 'bg-purple-100 text-purple-700' },
    not_interested: { label: 'Not Interested', color: 'bg-red-100 text-red-700' },
    no_response: { label: 'No Response', color: 'bg-gray-100 text-gray-600' },
    wrong_contact: { label: 'Wrong Contact', color: 'bg-yellow-100 text-yellow-700' },
    nurture: { label: 'Nurture', color: 'bg-orange-100 text-orange-700' },
    other: { label: 'Other', color: 'bg-gray-100 text-gray-600' },
}

export default function CallHistory() {
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [outcomeFilter, setOutcomeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const fetchCalls = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getCalls({
                search: search || undefined,
                outcome: outcomeFilter || undefined,
                status: statusFilter || undefined,
            })
            setCalls(data.calls || [])
        } catch (err) {
            setError(err.message || 'Failed to load call history.')
        } finally {
            setLoading(false)
        }
    }, [search, outcomeFilter, statusFilter])

    useEffect(() => {
        const debounce = setTimeout(fetchCalls, 300)
        return () => clearTimeout(debounce)
    }, [fetchCalls])

    return (
        <div className="p-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {loading ? 'Loading…' : `${calls.length} call${calls.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>
                <Link to="/call/new" className="btn-primary">
                    <Phone size={15} /> New Call
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-56">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by prospect or company…"
                        className="input pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={15} className="text-gray-400" />
                    <select
                        value={outcomeFilter}
                        onChange={(e) => setOutcomeFilter(e.target.value)}
                        className="input w-44"
                    >
                        <option value="">All outcomes</option>
                        {Object.entries(OUTCOME_LABELS).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input w-36"
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="animate-spin text-brand-600" size={28} />
                </div>
            )}

            {!loading && error && (
                <div className="card p-6 text-center border-red-200">
                    <AlertCircle className="mx-auto text-red-400 mb-2" size={28} />
                    <p className="text-red-600 font-medium">{error}</p>
                    <button onClick={fetchCalls} className="btn-secondary mt-3">Retry</button>
                </div>
            )}

            {!loading && !error && calls.length === 0 && (
                <div className="card p-12 text-center">
                    <InboxIcon className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500 font-medium">No calls found</p>
                    <p className="text-gray-400 text-sm mt-1">
                        {search || outcomeFilter || statusFilter
                            ? 'Try adjusting your filters.'
                            : 'Start your first call to see it here.'}
                    </p>
                    {!search && !outcomeFilter && !statusFilter && (
                        <Link to="/call/new" className="btn-primary mt-4 inline-flex">
                            <Phone size={15} /> Start a Call
                        </Link>
                    )}
                </div>
            )}

            {/* Calls table */}
            {!loading && !error && calls.length > 0 && (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Prospect
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Started
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                    Last Stage
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Outcome
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Status
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {calls.map((call) => {
                                const stageName = STAGES.find((s) => s.id === call.current_stage)?.shortName || `Stage ${call.current_stage}`
                                const outcome = OUTCOME_LABELS[call.outcome]
                                return (
                                    <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <p className="font-medium text-gray-900">{call.prospect_name}</p>
                                            <p className="text-gray-500 text-xs">{call.company}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                                            {call.started_at
                                                ? format(new Date(call.started_at), 'MMM d, yyyy HH:mm')
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            <span className="badge bg-gray-100 text-gray-600">{stageName}</span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {outcome ? (
                                                <span className={`badge ${outcome.color}`}>{outcome.label}</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 hidden md:table-cell">
                                            {call.status === 'completed' ? (
                                                <span className="badge bg-green-50 text-green-700">
                                                    <CheckCircle size={11} className="mr-1" /> Done
                                                </span>
                                            ) : (
                                                <span className="badge bg-blue-50 text-blue-700">
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse" />
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {call.status === 'completed' ? (
                                                <Link
                                                    to={`/history/${call.id}`}
                                                    className="text-brand-600 hover:text-brand-800 flex items-center gap-1 text-xs font-medium"
                                                >
                                                    View <ExternalLink size={12} />
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/call/${call.id}`}
                                                    className="text-brand-600 hover:text-brand-800 flex items-center gap-1 text-xs font-medium"
                                                >
                                                    Resume <ChevronRight size={12} />
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
