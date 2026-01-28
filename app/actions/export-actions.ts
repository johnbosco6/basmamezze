'use server'

import { createClient } from 'next-sanity'
import { format } from 'date-fns'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

export async function exportOrdersToCSV(startDate?: string, endDate?: string) {
    try {
        // Check if we have Sanity token
        if (!process.env.SANITY_API_TOKEN) {
            console.warn('⚠️ SANITY_API_TOKEN not set. CSV export will use mock data.')

            // Return mock CSV for testing
            const headers = [
                'Order Number',
                'Date',
                'Time',
                'Customer Name',
                'Phone',
                'Address',
                'Items',
                'Total Amount (PLN)',
                'Status',
                'Delivery Method'
            ]

            const mockRow = [
                'MOCK-001',
                new Date().toISOString().split('T')[0],
                new Date().toTimeString().split(' ')[0],
                'Test Customer',
                '+48123456789',
                'Test Address',
                '1x Test Item',
                '50.00',
                'pending',
                'delivery'
            ]

            return {
                success: true,
                csv: [headers.join(','), mockRow.join(',')].join('\n'),
                filename: `basma-orders-mock-${Date.now()}.csv`
            }
        }

        // Fetch orders within date range
        let query = `*[_type == "order"`

        if (startDate && endDate) {
            query += ` && orderDate >= "${startDate}" && orderDate <= "${endDate}"`
        } else if (startDate) {
            query += ` && orderDate >= "${startDate}"`
        }

        query += `] | order(orderDate desc) {
            _id,
            orderNumber,
            orderDate,
            customerName,
            customerPhone,
            customerAddress,
            items,
            totalAmount,
            status,
            deliveryMethod
        }`

        const orders = await client.fetch(query)

        // Generate CSV content
        const headers = [
            'Order Number',
            'Date',
            'Time',
            'Customer Name',
            'Phone',
            'Address',
            'Items',
            'Total Amount (PLN)',
            'Status',
            'Delivery Method'
        ]

        const csvRows = [headers.join(',')]

        for (const order of orders) {
            const orderDate = new Date(order.orderDate)
            const items = order.items?.map((item: any) => `${item.quantity}x ${item.name}`).join('; ') || ''

            const row = [
                order.orderNumber || '',
                format(orderDate, 'yyyy-MM-dd'),
                format(orderDate, 'HH:mm'),
                `"${order.customerName || ''}"`,
                order.customerPhone || '',
                `"${order.customerAddress || ''}"`,
                `"${items}"`,
                order.totalAmount?.toFixed(2) || '0.00',
                order.status || '',
                order.deliveryMethod || ''
            ]

            csvRows.push(row.join(','))
        }

        return {
            success: true,
            csv: csvRows.join('\n'),
            filename: `basma-orders-${startDate || 'all'}-${endDate || 'to-date'}.csv`
        }
    } catch (error) {
        console.error('CSV export failed:', error)
        return {
            success: false,
            error: 'Failed to export orders'
        }
    }
}

export async function getWeeklyOrders(weekStart: string) {
    try {
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 7)

        const query = `*[_type == "order" && orderDate >= "${weekStart}" && orderDate < "${weekEnd.toISOString()}"] | order(orderDate desc)`

        const orders = await client.fetch(query)

        return {
            success: true,
            orders
        }
    } catch (error) {
        console.error('Failed to fetch weekly orders:', error)
        return {
            success: false,
            orders: []
        }
    }
}
