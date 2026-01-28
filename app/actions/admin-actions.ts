'use server'

import { createClient } from 'next-sanity'
import { revalidatePath } from 'next/cache'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset) {
    console.warn('[Admin Actions] Sanity Project ID or Dataset is missing. Check your environment variables.')
}

const client = createClient({
    projectId: projectId || 'placeholder',
    dataset: dataset || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: token, // Critical for write operations
})

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        await client
            .patch(orderId)
            .set({ status: newStatus })
            .commit()

        revalidatePath('/admin')
        return { success: true, message: `Status updated to ${newStatus}` }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { success: false, message: 'Failed to update status' }
    }
}

export async function getOrders() {
    // MOCK DATA FOR UI PREVIEW
    return [
        {
            _id: '1',
            orderNumber: 'BM-2024-9482',
            customerName: 'Jan Kowalski',
            customerPhone: '123456789',
            customerAddress: 'ul. Krakowskie Przedmieście 12/4, Lublin',
            status: 'pending',
            items: [
                { menuItem: { title: 'Hummus z Jagnięciną' }, quantity: 1, price: 45.00 },
                { menuItem: { title: 'Falafel Wrap' }, quantity: 2, price: 28.00, additions: 'Ostry sos' }
            ],
            totalAmount: 101.00,
            orderDate: new Date().toISOString()
        },
        {
            _id: '2',
            orderNumber: 'BM-2024-9483',
            customerName: 'Anna Nowak',
            customerPhone: '987654321',
            customerAddress: 'ul. Lipowa 15, Lublin',
            status: 'preparing',
            items: [
                { menuItem: { title: 'Mix Grill' }, quantity: 1, price: 85.00 }
            ],
            totalAmount: 85.00,
            orderDate: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
        },
        {
            _id: '3',
            orderNumber: 'BM-2024-9484',
            customerName: 'Piotr Wiśniewski',
            customerPhone: '555123456',
            customerAddress: 'ul. Gabriela Narutowicza 32, Lublin',
            status: 'out_for_delivery',
            items: [
                { menuItem: { title: 'Sałatka Tabouleh' }, quantity: 1, price: 32.00 },
                { menuItem: { title: 'Sambousek z Serem' }, quantity: 1, price: 24.00 }
            ],
            totalAmount: 56.00,
            orderDate: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
        },
        {
            _id: '4',
            orderNumber: 'BM-2024-9485',
            customerName: 'Maria Zielińska',
            customerPhone: '111222333',
            customerAddress: 'ul. Zana 19, Lublin',
            status: 'delivered',
            items: [
                { menuItem: { title: 'Talerz Shoarma' }, quantity: 2, price: 55.00 }
            ],
            totalAmount: 110.00,
            orderDate: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
        }
    ]
}
