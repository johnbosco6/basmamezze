import { defineField, defineType } from 'sanity'

export const auditLogType = defineType({
    name: 'auditLog',
    title: 'Audit Log',
    type: 'document',
    fields: [
        defineField({
            name: 'staffName',
            title: 'Staff Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'action',
            title: 'Action',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Login', value: 'login' },
                    { title: 'Logout', value: 'logout' },
                    { title: 'Order Status Changed', value: 'order_status_changed' },
                    { title: 'Notification Sent', value: 'notification_sent' },
                    { title: 'Clock In', value: 'clock_in' },
                    { title: 'Clock Out', value: 'clock_out' },
                ],
            },
        }),
        defineField({
            name: 'details',
            title: 'Details',
            type: 'text',
            description: 'Additional information about the action',
        }),
        defineField({
            name: 'orderId',
            title: 'Related Order ID',
            type: 'string',
        }),
        defineField({
            name: 'timestamp',
            title: 'Timestamp',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'action',
            subtitle: 'staffName',
            description: 'timestamp',
        },
    },
})
