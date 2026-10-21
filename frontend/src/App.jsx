import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import StartCall from './pages/StartCall'
import LiveCall from './pages/LiveCall'
import CallHistory from './pages/CallHistory'
import CallDetail from './pages/CallDetail'

export default function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1f2937',
                        color: '#f9fafb',
                        borderRadius: '10px',
                        fontSize: '14px',
                    },
                    success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/call/new" replace />} />
                    <Route path="call/new" element={<StartCall />} />
                    <Route path="call/:id" element={<LiveCall />} />
                    <Route path="history" element={<CallHistory />} />
                    <Route path="history/:id" element={<CallDetail />} />
                    <Route path="*" element={<Navigate to="/call/new" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
