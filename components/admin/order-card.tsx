'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Phone, MapPin, Clock, CheckCircle, Truck, Utensils, Archive, MessageCircle, Check } from 'lucide-react'
import { updateOrderStatus } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Archivo } from 'next/font/google'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

// Status mapping for visual styles with Polish labels
const statusConfig: { [key: string]: { label: string; color: string; icon: any; glow: string } } = {
    pending: { label: 'Oczekujące', color: 'bg-yellow-500', icon: Clock, glow: 'shadow-[0_0_10px_rgba(234,179,8,0.4)]' },
    preparing: { label: 'W przygotowaniu', color: 'bg-orange-500', icon: Utensils, glow: 'shadow-[0_0_10px_rgba(249,115,22,0.4)]' },
    out_for_delivery: { label: 'W drodze', color: 'bg-blue-500', icon: Truck, glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]' },
    delivered: { label: 'Dostarczone', color: 'bg-green-500', icon: CheckCircle, glow: 'shadow-[0_0_10px_rgba(34,197,94,0.4)]' },
    cancelled: { label: 'Anulowane', color: 'bg-red-500', icon: Archive, glow: 'shadow-[0_0_10px_rgba(239,68,68,0.4)]' },
}

interface OrderCardProps {
    order: any
}

export function OrderCard({ order }: OrderCardProps) {
    const [loading, setLoading] = useState(false)
    const [sentNotifications, setSentNotifications] = useState({
        received: false,
        preparing: false,
        on_way: false
    })

    const status = order.status || 'pending'
    const config = statusConfig[status] || statusConfig.pending

    const allNotificationsSent = sentNotifications.received && sentNotifications.preparing && sentNotifications.on_way

    const sendNotification = (type: 'received' | 'preparing' | 'on_way') => {
        let message = ''
        switch (type) {
            case 'received':
                message = `Dzień dobry ${order.customerName}, Twoje zamówienie z Basma Mezze zostało przyjęte! Zaraz zaczniemy je przygotowywać. 🥙`
                break
            case 'preparing':
                message = `Dzień dobry ${order.customerName}, Twoje zamówienie jest właśnie przygotowywane przez naszego szefa kuchni! 👨‍🍳🔥`
                break
            case 'on_way':
                message = `Dzień dobry ${order.customerName}, Twoje zamówienie z Basma Mezze jest już w drodze! 🚗💨 smacznego!`
                break
        }

        const url = `https://wa.me/${order.customerPhone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')

        setSentNotifications(prev => ({ ...prev, [type]: true }))
    }

    const handleStatusUpdate = async (newStatus: string) => {
        setLoading(true)
        try {
            const result = await updateOrderStatus(order._id, newStatus)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('Wystąpił błąd')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={`w-full backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden text-white ${archivo.className} ${config.glow}`}>
            <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <span className="text-[#BA9D76]">#{order.orderNumber?.slice(-4) || '----'}</span>
                            <Badge className={`${config.color} text-white border-0 shadow-lg px-3 py-1`}>
                                <config.icon className="w-3.5 h-3.5 mr-1.5" />
                                {config.label}
                            </Badge>
                        </CardTitle>
                        <p className="text-xs text-white/50 mt-1 uppercase tracking-wider font-light">
                            {order.orderDate ? format(new Date(order.orderDate), 'PPp', { locale: pl }) : 'Przed chwilą'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-2xl text-[#BA9D76]">{order.totalAmount?.toFixed(2)} zł</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="py-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-3 font-semibold text-lg">
                        <span className="text-[#BA9D76]">👤</span>
                        <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                        <Phone className="w-3.5 h-3.5 text-[#BA9D76]" />
                        <a href={`tel:${order.customerPhone}`} className="hover:text-[#BA9D76] transition-colors">{order.customerPhone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                        <MapPin className="w-3.5 h-3.5 text-[#BA9D76]" />
                        <span className="truncate">{order.customerAddress || 'Brak adresu'}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest pl-1">Produkty</h4>
                    </div>
                    <div className="space-y-2.5">
                        {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-start text-sm py-3 border-b border-white/5 last:border-0 group">
                                <div className="flex gap-4">
                                    <span className="font-bold text-center bg-[#BA9D76]/80 text-white min-w-[28px] h-[28px] flex items-center justify-center rounded-lg shadow-sm">
                                        {item.quantity}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-medium group-hover:text-[#BA9D76] transition-colors">
                                            {item.menuItem?.title || 'Nieznany produkt'}
                                        </span>
                                        {item.additions && (
                                            <span className="text-white/40 text-xs italic mt-0.5">
                                                + {item.additions}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="font-semibold text-white/90">{(item.price * item.quantity).toFixed(2)} zł</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-4 border-t border-white/5 flex flex-col gap-4">
                {/* WhatsApp Notification Center */}
                <div className="w-full space-y-2">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <MessageCircle className="w-3 h-3" /> Powiadomienia (Wszystkie 3 wymagane)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`text-[10px] h-9 border border-white/10 uppercase font-bold tracking-tight transition-all ${sentNotifications.received ? 'bg-green-600/50 border-green-500/50' : 'bg-white/5 hover:bg-white/10'}`}
                            onClick={() => sendNotification('received')}
                        >
                            {sentNotifications.received && <Check className="w-3 h-3 mr-1" />} Przyjęte
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`text-[10px] h-9 border border-white/10 uppercase font-bold tracking-tight transition-all ${sentNotifications.preparing ? 'bg-green-600/50 border-green-500/50' : 'bg-white/5 hover:bg-white/10'}`}
                            onClick={() => sendNotification('preparing')}
                        >
                            {sentNotifications.preparing && <Check className="w-3 h-3 mr-1" />} Gotowanie
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`text-[10px] h-9 border border-white/10 uppercase font-bold tracking-tight transition-all ${sentNotifications.on_way ? 'bg-green-600/50 border-green-500/50' : 'bg-white/5 hover:bg-white/10'}`}
                            onClick={() => sendNotification('on_way')}
                        >
                            {sentNotifications.on_way && <Check className="w-3 h-3 mr-1" />} W drodze
                        </Button>
                    </div>
                </div>

                {/* Primary Action Button */}
                <div className="w-full mt-2">
                    {status !== 'delivered' && (
                        <Button
                            className={`w-full font-bold h-14 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${allNotificationsSent ? 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]' : 'bg-white/10 text-white/40 cursor-not-allowed opacity-50'}`}
                            onClick={() => {
                                if (allNotificationsSent) {
                                    handleStatusUpdate('delivered')
                                } else {
                                    toast.error('Wyślij wszystkie 3 powiadomienia, aby zakończyć!')
                                }
                            }}
                            disabled={loading}
                        >
                            <CheckCircle className="h-6 w-6" />
                            {allNotificationsSent ? 'ZAKOŃCZ ZAMÓWIENIE' : 'WYŚLIJ POWIADOMIENIA'}
                        </Button>
                    )}

                    {status === 'delivered' && (
                        <div className="flex items-center justify-center gap-2 py-4 text-[#BA9D76] font-semibold bg-white/5 rounded-xl border border-[#BA9D76]/20">
                            <CheckCircle className="w-5 h-5" />
                            Zamówienie Zakończone
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}



