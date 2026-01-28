'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportOrdersToCSV } from '@/app/actions/export-actions'
import { useState } from 'react'

interface ExportButtonProps {
    startDate?: string
    endDate?: string
}

export function ExportButton({ startDate, endDate }: ExportButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        try {
            const result = await exportOrdersToCSV(startDate, endDate)

            if (result.success && result.csv) {
                // Create blob and download
                const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = result.filename || 'orders.csv'
                link.click()
                URL.revokeObjectURL(link.href)
            } else {
                alert('Nie udało się wyeksportować zamówień')
            }
        } catch (error) {
            console.error('Export failed:', error)
            alert('Błąd podczas eksportowania')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading}
            className="bg-white/5 border-white/10 rounded-2xl h-12 px-6 gap-2 hover:bg-white/10"
        >
            <Download size={18} />
            {loading ? 'Eksportowanie...' : 'Eksportuj CSV'}
        </Button>
    )
}
