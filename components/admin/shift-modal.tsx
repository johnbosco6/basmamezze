'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, LogOut } from 'lucide-react'

interface ShiftModalProps {
    isOpen: boolean
    onClose: () => void
    onClockIn: (staffName: string) => Promise<void>
    onClockOut: (newStaffName?: string) => Promise<void>
    mode: 'clock-in' | 'clock-out'
    currentStaff?: string
}

export function ShiftModal({ isOpen, onClose, onClockIn, onClockOut, mode, currentStaff }: ShiftModalProps) {
    const [staffName, setStaffName] = useState('')
    const [newStaffName, setNewStaffName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClockIn = async () => {
        if (!staffName.trim()) return
        setLoading(true)
        try {
            await onClockIn(staffName.trim())
            setStaffName('')
            onClose()
        } catch (error) {
            console.error('Clock in failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClockOut = async () => {
        setLoading(true)
        try {
            await onClockOut(newStaffName.trim() || undefined)
            setNewStaffName('')
            onClose()
        } catch (error) {
            console.error('Clock out failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-[#BA9D76] flex items-center gap-2">
                        {mode === 'clock-in' ? (
                            <>
                                <LogIn className="w-5 h-5" />
                                Rozpocznij zmianę
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                Zakończ zmianę
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        {mode === 'clock-in'
                            ? 'Wprowadź swoje imię, aby rozpocząć zmianę'
                            : `${currentStaff} kończy zmianę. Wprowadź imię następnej osoby (opcjonalne)`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {mode === 'clock-in' ? (
                        <div className="space-y-2">
                            <Label htmlFor="staff-name" className="text-white/80">
                                Imię i Nazwisko
                            </Label>
                            <Input
                                id="staff-name"
                                placeholder="np. Anna Kowalska"
                                value={staffName}
                                onChange={(e) => setStaffName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleClockIn()}
                                className="bg-white/5 border-white/10 text-white"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="new-staff-name" className="text-white/80">
                                Następna osoba (opcjonalne)
                            </Label>
                            <Input
                                id="new-staff-name"
                                placeholder="np. Jan Nowak"
                                value={newStaffName}
                                onChange={(e) => setNewStaffName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleClockOut()}
                                className="bg-white/5 border-white/10 text-white"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="bg-white/5 border-white/10"
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={mode === 'clock-in' ? handleClockIn : handleClockOut}
                        disabled={loading || (mode === 'clock-in' && !staffName.trim())}
                        className="bg-gradient-to-r from-[#BA9D76] to-[#8B7355]"
                    >
                        {loading ? 'Przetwarzanie...' : mode === 'clock-in' ? 'Rozpocznij' : 'Zakończ'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
