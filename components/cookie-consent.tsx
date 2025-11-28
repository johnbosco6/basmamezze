"use client"

import { useState, useEffect } from "react"
import { X, Cookie, Settings, Check, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

const COOKIE_CONSENT_KEY = "basma-cookie-consent"
const COOKIE_PREFERENCES_KEY = "basma-cookie-preferences"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consentValue = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consentValue) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    } else {
      setHasConsent(true)
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      }
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true")
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setHasConsent(true)
    setShowBanner(false)
    setShowSettings(false)

    // Here you would typically initialize analytics/marketing scripts based on preferences
    if (prefs.analytics) {
      // Initialize analytics (e.g., Google Analytics)
      console.log("Analytics cookies accepted")
    }
    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log("Marketing cookies accepted")
    }
    if (prefs.functional) {
      // Initialize functional cookies
      console.log("Functional cookies accepted")
    }
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    savePreferences(allAccepted)
  }

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    savePreferences(necessaryOnly)
  }

  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    if (category === "necessary") return // Cannot disable necessary cookies
    setPreferences((prev) => ({ ...prev, [category]: value }))
  }

  const saveCustomPreferences = () => {
    savePreferences(preferences)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  // Export the consent status and openSettings function for use in other components
  if (typeof window !== "undefined") {
    ;(window as any).basmaOpenCookieSettings = openSettings
    ;(window as any).basmaHasCookieConsent = hasConsent
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-t from-[#2B2B2B]/95 via-[#2B2B2B]/90 to-transparent backdrop-blur-lg border-t border-[#BA9D76]/30">
        <div className="container mx-auto max-w-6xl">
          <Card className="backdrop-blur-lg bg-[#2B2B2B]/80 border border-[#BA9D76]/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="h-6 w-6 text-[#BA9D76] flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Używamy plików cookies</h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Nasza strona używa plików cookies, aby zapewnić najlepsze doświadczenia. Niektóre są niezbędne do
                      funkcjonowania strony, inne pomagają nam ją ulepszać i dostosowywać do Twoich potrzeb.
                    </p>
                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#BA9D76] hover:text-[#BA9D76]/80 hover:bg-white/10 p-0 h-auto"
                        >
                          <span className="text-sm">{isDetailsOpen ? "Ukryj szczegóły" : "Zobacz szczegóły"}</span>
                          {isDetailsOpen ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="space-y-3 text-xs text-white/70">
                          <div>
                            <strong className="text-white/90">Niezbędne:</strong> Umożliwiają podstawowe funkcje strony
                            (zawsze aktywne)
                          </div>
                          <div>
                            <strong className="text-white/90">Analityczne:</strong> Pomagają nam zrozumieć, jak
                            korzystasz ze strony
                          </div>
                          <div>
                            <strong className="text-white/90">Marketingowe:</strong> Służą do personalizacji reklam i
                            treści
                          </div>
                          <div>
                            <strong className="text-white/90">Funkcjonalne:</strong> Zapamiętują Twoje preferencje i
                            ustawienia
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    onClick={acceptAll}
                    className="bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white border border-[#BA9D76]/50 shadow-lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Akceptuj wszystkie
                  </Button>
                  <Button
                    onClick={acceptNecessaryOnly}
                    variant="outline"
                    className="border-[#BA9D76]/50 text-white hover:bg-[#BA9D76]/20 hover:border-[#BA9D76] bg-transparent"
                  >
                    Tylko niezbędne
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Ustawienia
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#BA9D76]/20">
                <p className="text-xs text-white/60">
                  Więcej informacji znajdziesz w naszej{" "}
                  <Link href="/polityka-prywatnosci" className="text-[#BA9D76] hover:underline">
                    Polityce Prywatności
                  </Link>
                  . Możesz zmienić swoje preferencje w każdej chwili.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-lg bg-[#2B2B2B]/95 border border-[#BA9D76]/30 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl text-white">Ustawienia Cookies</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-white/80 leading-relaxed">
                Zarządzaj swoimi preferencjami dotyczącymi plików cookies. Możesz włączyć lub wyłączyć różne kategorie
                zgodnie ze swoimi potrzebami.
              </p>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 rounded-lg bg-white/5 border border-[#BA9D76]/20">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">Niezbędne pliki cookies</h4>
                      <span className="text-xs bg-[#BA9D76]/20 text-[#BA9D76] px-2 py-1 rounded-full">Wymagane</span>
                    </div>
                    <p className="text-sm text-white/70">
                      Te pliki cookies są niezbędne do prawidłowego funkcjonowania strony internetowej i nie można ich
                      wyłączyć.
                    </p>
                    <div className="text-xs text-white/60">
                      Przykłady: sesja użytkownika, preferencje językowe, bezpieczeństwo
                    </div>
                  </div>
                  <Switch checked={true} disabled className="ml-4" />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 rounded-lg bg-white/5 border border-[#BA9D76]/20">
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-white">Pliki cookies analityczne</h4>
                    <p className="text-sm text-white/70">
                      Pomagają nam zrozumieć, jak odwiedzający korzystają z naszej strony, dzięki czemu możemy ją
                      ulepszać.
                    </p>
                    <div className="text-xs text-white/60">
                      Przykłady: Google Analytics, statystyki odwiedzin, analiza zachowań użytkowników
                    </div>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                    className="ml-4"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 rounded-lg bg-white/5 border border-[#BA9D76]/20">
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-white">Pliki cookies marketingowe</h4>
                    <p className="text-sm text-white/70">
                      Służą do wyświetlania spersonalizowanych reklam i treści marketingowych dostosowanych do Twoich
                      zainteresowań.
                    </p>
                    <div className="text-xs text-white/60">
                      Przykłady: Facebook Pixel, Google Ads, remarketing, personalizacja reklam
                    </div>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                    className="ml-4"
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between p-4 rounded-lg bg-white/5 border border-[#BA9D76]/20">
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-white">Pliki cookies funkcjonalne</h4>
                    <p className="text-sm text-white/70">
                      Umożliwiają zapamiętywanie Twoich wyborów i preferencji, aby zapewnić lepsze doświadczenia.
                    </p>
                    <div className="text-xs text-white/60">
                      Przykłady: preferencje językowe, ustawienia motywu, zapamiętane formularze
                    </div>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                    className="ml-4"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#BA9D76]/20">
                <Button
                  onClick={saveCustomPreferences}
                  className="bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white border border-[#BA9D76]/50 flex-1"
                >
                  Zapisz preferencje
                </Button>
                <Button
                  onClick={acceptAll}
                  variant="outline"
                  className="border-[#BA9D76]/50 text-white hover:bg-[#BA9D76]/20 hover:border-[#BA9D76] flex-1 bg-transparent"
                >
                  Akceptuj wszystkie
                </Button>
              </div>

              <div className="text-xs text-white/60 space-y-2">
                <p>
                  <strong>Uwaga:</strong> Wyłączenie niektórych plików cookies może wpłynąć na funkcjonalność strony.
                </p>
                <p>
                  Więcej informacji o przetwarzaniu danych znajdziesz w naszej{" "}
                  <Link href="/polityka-prywatnosci" className="text-[#BA9D76] hover:underline">
                    Polityce Prywatności
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
