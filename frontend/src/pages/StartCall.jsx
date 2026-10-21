import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, User, Building2, Briefcase, FileText, Loader2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { createCall } from '../services/api'

export default function StartCall() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        prospect_name: '',
        company: '',
        prospect_role: '',
        pre_call_notes: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!form.prospect_name.trim()) e.prospect_name = 'Prospect name is required.'
        if (!form.company.trim()) e.company = 'Company name is required.'
        return e
    }

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setSubmitting(true)
        try {
            const call = await createCall(form)
            toast.success('Call started!')
            navigate(`/call/${call.id}`)
        } catch (err) {
            toast.error(err.message || 'Failed to create call.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-200">
                        <Zap size={26} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Start a Call</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Enter prospect details to begin your guided cold-call session.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                    {/* Prospect name */}
                    <div>
                        <label className="label" htmlFor="prospect_name">
                            <User size={13} className="inline mr-1 text-gray-400" />
                            Prospect Name *
                        </label>
                        <input
                            id="prospect_name"
                            type="text"
                            value={form.prospect_name}
                            onChange={handleChange('prospect_name')}
                            className={`input ${errors.prospect_name ? 'border-red-400 focus:ring-red-400' : ''}`}
                            placeholder="Alex Morgan"
                            autoFocus
                        />
                        {errors.prospect_name && (
                            <p className="text-xs text-red-500 mt-1">{errors.prospect_name}</p>
                        )}
                    </div>

                    {/* Company */}
                    <div>
                        <label className="label" htmlFor="company">
                            <Building2 size={13} className="inline mr-1 text-gray-400" />
                            Company *
                        </label>
                        <input
                            id="company"
                            type="text"
                            value={form.company}
                            onChange={handleChange('company')}
                            className={`input ${errors.company ? 'border-red-400 focus:ring-red-400' : ''}`}
                            placeholder="Northstar Solutions"
                        />
                        {errors.company && (
                            <p className="text-xs text-red-500 mt-1">{errors.company}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="label" htmlFor="prospect_role">
                            <Briefcase size={13} className="inline mr-1 text-gray-400" />
                            Role / Title
                            <span className="ml-1 text-gray-400 font-normal text-xs">optional</span>
                        </label>
                        <input
                            id="prospect_role"
                            type="text"
                            value={form.prospect_role}
                            onChange={handleChange('prospect_role')}
                            className="input"
                            placeholder="Head of Operations"
                        />
                    </div>

                    {/* Pre-call notes */}
                    <div>
                        <label className="label" htmlFor="pre_call_notes">
                            <FileText size={13} className="inline mr-1 text-gray-400" />
                            Pre-Call Notes
                            <span className="ml-1 text-gray-400 font-normal text-xs">optional</span>
                        </label>
                        <textarea
                            id="pre_call_notes"
                            value={form.pre_call_notes}
                            onChange={handleChange('pre_call_notes')}
                            rows={3}
                            className="input resize-none"
                            placeholder="Research notes, context, or talking points before the call…"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full justify-center py-3 text-base"
                    >
                        {submitting ? (
                            <><Loader2 size={18} className="animate-spin" /> Starting call…</>
                        ) : (
                            <><Phone size={18} /> Start Call</>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    All fields marked * are required. Your call will be saved automatically.
                </p>
            </div>
        </div>
    )
}
