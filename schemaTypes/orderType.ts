import { defineField, defineType } from 'sanity'

export const orderType = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
        }),
        defineField({
            name: 'customerPhone',
            title: 'Customer Phone',
            type: 'string',
            description: 'Used for WhatsApp notifications',
        }),
        defineField({
            name: 'customerAddress',
            title: 'Delivery Address',
            type: 'string', // Could be an object if we need more detail later
        }),
        defineField({
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Preparing', value: 'preparing' },
                    { title: 'Out for Delivery', value: 'out_for_delivery' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' },
                ],
                layout: 'radio', // Easier for admin to see
            },
            initialValue: 'pending',
        }),
        defineField({
            name: 'items',
            title: 'Order Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'menuItem',
                            title: 'Menu Item',
                            type: 'reference',
                            to: [{ type: 'post' }], // Assuming 'post' is used for menu items based on previous context, usually it should be a dedicated 'dish' type but stick to existing
                        }),
                        defineField({
                            name: 'quantity',
                            title: 'Quantity',
                            type: 'number',
                        }),
                        defineField({
                            name: 'price',
                            title: 'Price at Order',
                            type: 'number',
                        }),
                        defineField({
                            name: 'additions',
                            title: 'Additions/Notes',
                            type: 'string',
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'menuItem.title',
                            subtitle: 'quantity',
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'totalAmount',
            title: 'Total Amount',
            type: 'number',
        }),
        defineField({
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'customerName',
            subtitle: 'status',
            media: 'items.0.menuItem.mainImage',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection
            return {
                title: title || 'No Name',
                subtitle: `Status: ${subtitle ? subtitle.toUpperCase() : 'UNKNOWN'}`,
                media: media,
            }
        },
    },
})
