'use client'

import { useEffect } from 'react'

export function PWARegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((reg) => console.log('Admin Service Worker registered', reg))
                .catch((err) => console.log('Admin Service Worker failed', err))
        }
    }, [])

    return null
}
