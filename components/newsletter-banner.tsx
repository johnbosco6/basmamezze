"use client"

import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"
import { X, AlertCircle } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({ subsets: ["latin"] })

interface Newsletter {
    _id: string
    title: string
    content: string
    link?: string
    isActive: boolean
    backgroundColor?: string
    textColor?: string
}

export function NewsletterBanner() {
    const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNewsletter = async () => {
            try {
                const query = `*[_type == "newsletter" && isActive == true][0]{
          _id,
          title,
          content,
          link,
          isActive,
          backgroundColor,
          textColor
        }`

                const data = await client.fetch(query)
                setNewsletter(data)
            } catch (error) {
                console.error("Error fetching newsletter:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNewsletter()
    }, [])

    if (isLoading || !newsletter || !isVisible) {
        return null
    }

    const bgColor = newsletter.backgroundColor || "#BA9D76"
    const textColorClass = newsletter.textColor || "#FFFFFF"

    return (
        <div
            className="relative py-3 px-4 text-center"
            style={{ backgroundColor: bgColor, color: textColorClass }}
        >
            <div className="container mx-auto flex items-center justify-center gap-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div className={`flex-1 ${archivo.className}`}>
                    <span className="font-semibold">{newsletter.title}</span>
                    {newsletter.content && (
                        <span className="ml-2 font-light">{newsletter.content}</span>
                    )}
                    {newsletter.link && (
                        <a
                            href={newsletter.link}
                            className="ml-2 underline hover:opacity-80 transition-opacity"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Dowiedz się więcej
                        </a>
                    )}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    aria-label="Close banner"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
