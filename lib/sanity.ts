import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
    console.warn('Sanity Project ID or Dataset is missing. Check your environment variables.')
}

export const client = createClient({
    projectId: projectId || 'placeholder',
    dataset: dataset || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    useCdn: false,
})


const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}
