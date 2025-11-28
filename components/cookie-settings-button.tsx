"use client"

import { useState, useEffect } from "react"

const COOKIE_CONSENT_KEY = "basma-cookie-consent"

export function CookieSettingsButton() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consentValue = localStorage.getItem(COOKIE_CONSENT_KEY)
    setHasConsent(!!consentValue)

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) {
        setHasConsent(!!e.newValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const openCookieSettings = () => {
    // Use the global function exposed by CookieConsent component
    if (typeof window !== "undefined" && (window as any).basmaOpenCookieSettings) {
      ;(window as any).basmaOpenCookieSettings()
    }
  }

  // Don't show the floating button if user hasn't given consent yet (banner is showing)
  // or if they have given consent (no need for persistent floating button)
  if (!hasConsent) {
    return null
  }

  // For now, we'll hide the floating button entirely once consent is given
  // Users can access cookie settings through footer or other means
  return null

  // If you want to keep a floating button for users who have already consented,
  // uncomment the code below:
  /*
  return (
    <Button
      onClick={openCookieSettings}
      className="fixed bottom-6 left-6 z-40 bg-[#2B2B2B]/80 hover:bg-[#2B2B2B]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-3 border border-[#BA9D76]/30"
      size="sm"
      title="Ustawienia cookies"
    >
      <Settings className="h-4 w-4" />
    </Button>
  )
  */
}
