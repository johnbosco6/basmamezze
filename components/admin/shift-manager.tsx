'use client'

import { useEffect, useState } from 'react'
import { ShiftModal } from './shift-modal'
import { clockIn, clockOut, getCurrentStaff } from '@/app/actions/auth-actions'
import { useRouter } from 'next/navigation'

export function ShiftManager() {
    const [showModal, setShowModal] = useState(false)
    const [currentStaff, setCurrentStaff] = useState<string | null>(null)
    const [mode, setMode] = useState<'clock-in' | 'clock-out'>('clock-in')
    const router = useRouter()

    useEffect(() => {
        // Check if staff is already clocked in
        const checkStaff = async () => {
            const staff = await getCurrentStaff()
            if (!staff) {
                setShowModal(true)
                setMode('clock-in')
            } else {
                setCurrentStaff(staff)
            }
        }
        checkStaff()
    }, [])

    const handleClockIn = async (staffName: string) => {
        try {
            console.log('Attempting to clock in:', staffName)
            const result = await clockIn(staffName)
            console.log('Clock in result:', result)

            if (result.success) {
                setCurrentStaff(staffName)
                setShowModal(false)
                router.refresh()
            } else {
                alert(`Błąd rozpoczęcia zmiany: ${result.message || 'Nieznany błąd'}`)
            }
        } catch (error) {
            console.error('Clock in error:', error)
            alert('Nie udało się rozpocząć zmiany. Sprawdź konsolę.')
        }
    }

    const handleClockOut = async (newStaffName?: string) => {
        const result = await clockOut(newStaffName)
        if (result.success) {
            if (newStaffName) {
                setCurrentStaff(newStaffName)
            } else {
                setCurrentStaff(null)
                setMode('clock-in')
                setShowModal(true)
            }
            router.refresh()
        }
    }

    const openClockOutModal = () => {
        setMode('clock-out')
        setShowModal(true)
    }

    return (
        <>
            <ShiftModal
                isOpen={showModal}
                onClose={() => mode === 'clock-out' && setShowModal(false)}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                mode={mode}
                currentStaff={currentStaff || undefined}
            />
            {currentStaff && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">Zmiana:</span>
                    <span className="font-bold text-[#BA9D76]">{currentStaff}</span>
                    <button
                        onClick={openClockOutModal}
                        className="text-xs text-white/40 hover:text-white/80 underline"
                    >
                        Zakończ zmianę
                    </button>
                </div>
            )}
        </>
    )
}
