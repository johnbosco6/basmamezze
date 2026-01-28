import { defineField, defineType } from 'sanity'

export const shiftLogType = defineType({
    name: 'shiftLog',
    title: 'Shift Log',
    type: 'document',
    fields: [
        defineField({
            name: 'staffName',
            title: 'Staff Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clockInTime',
            title: 'Clock In Time',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clockOutTime',
            title: 'Clock Out Time',
            type: 'datetime',
        }),
        defineField({
            name: 'shiftDate',
            title: 'Shift Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ordersHandled',
            title: 'Orders Handled',
            type: 'number',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'staffName',
            subtitle: 'clockInTime',
        },
    },
})
