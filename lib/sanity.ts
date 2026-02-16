import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dtk1tgvl'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId || !dataset) {
    console.warn('Sanity environment variables are not properly configured')
}

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
})


const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}
