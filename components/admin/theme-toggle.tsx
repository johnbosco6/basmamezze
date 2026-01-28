'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        // Load saved theme from localStorage
        const saved = localStorage.getItem('admin-theme') as 'light' | 'dark' | null
        if (saved) {
            setTheme(saved)
            document.documentElement.setAttribute('data-theme', saved)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('admin-theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-white/10 data-[theme=light]:hover:bg-slate-200"
            title={theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
                <Moon className="h-5 w-5 text-blue-500" />
            )}
        </Button>
    )
}
