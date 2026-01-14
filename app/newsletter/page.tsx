"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { client } from "@/lib/sanity"
import { Home, BookOpen, MessageCircle, Megaphone, ArrowLeft } from "lucide-react"
import { Archivo } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const archivo = Archivo({ subsets: ["latin"] })

interface NewsletterItem {
    _id: string
    title: string
    content: string
    link?: string
    publishedAt: string
    isActive: boolean
}

export default function NewsletterPage() {
    const [newsletters, setNewsletters] = useState<NewsletterItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                const query = `*[_type == "newsletter" && isActive == true] | order(publishedAt desc){
          _id,
          title,
          content,
          link,
          publishedAt,
          isActive
        }`

                const data = await client.fetch(query)
                setNewsletters(data)
            } catch (error) {
                console.error("Error fetching newsletters:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNewsletters()
    }, [])

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1 flex justify-start"></div>
                    <nav className="flex-1 flex items-center justify-center gap-6 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-6 py-3 shadow-lg">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <Home className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Strona Główna</span>
                        </Link>
                        <Link
                            href="/menu"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <BookOpen className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
                        </Link>
                        <Link
                            href="/faq"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>FAQ</span>
                        </Link>
                        <Link
                            href="/#contact"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
                        >
                            <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
                        </Link>
                        <Link
                            href="/newsletter"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 -translate-y-1 bg-white/20 shadow-lg text-[#BA9D76] group"
                        >
                            <Megaphone className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Oferty</span>
                        </Link>
                    </nav>
                    <div className="flex-1 flex justify-end"></div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden bg-gradient-to-r from-[#BA9D76]/10 to-[#597FB1]/10">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <Megaphone className="h-16 w-16 mx-auto mb-6 text-[#BA9D76]" />
                        <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-gray-900 ${archivo.className}`}>
                            Aktualności i Oferty
                        </h1>
                        <p className={`text-xl text-gray-700 font-light ${archivo.className}`}>
                            Bądź na bieżąco z najnowszymi promocjami i wydarzeniami w Basma
                        </p>
                    </div>
                </div>
            </section>

            {/* Newsletter Content */}
            <main className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className={`text-gray-600 ${archivo.className}`}>Ładowanie...</p>
                        </div>
                    ) : newsletters.length === 0 ? (
                        <div className="text-center py-12">
                            <p className={`text-gray-600 ${archivo.className}`}>
                                Brak aktualnych ofert. Wróć wkrótce!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                            {newsletters.map((item) => (
                                <Card key={item._id} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <h3 className={`text-xl font-semibold mb-3 text-gray-900 ${archivo.className}`}>
                                            {item.title}
                                        </h3>
                                        <p className={`text-gray-600 mb-4 font-light ${archivo.className}`}>
                                            {item.content}
                                        </p>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-[#BA9D76] hover:text-[#597FB1] transition-colors font-medium ${archivo.className}`}
                                            >
                                                Dowiedz się więcej →
                                            </a>
                                        )}
                                        <p className={`text-xs text-gray-400 mt-4 ${archivo.className}`}>
                                            {new Date(item.publishedAt).toLocaleDateString('pl-PL')}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
