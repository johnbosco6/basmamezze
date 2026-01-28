import { getOrders } from '@/app/actions/admin-actions'
import { OrderCard } from '@/components/admin/order-card'
import { RefreshCw, TrendingUp, Users, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Archivo } from 'next/font/google'
import { AdminSidebar } from '@/components/admin/sidebar'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const orders = await getOrders() || []

    const activeOrders = orders.filter((o: any) => o.status !== 'cancelled' && o.status !== 'delivered')
    const completedToday = orders.filter((o: any) => o.status === 'delivered')

    // Calculate daily stats
    const totalTodayAmount = completedToday.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const totalItems = completedToday.reduce((sum, o) => sum + (o.items?.length || 0), 0)

    return (
        <div className={`flex min-h-screen bg-gradient-to-br from-[#1a2c44] via-[#2B2B2B] to-[#121212] text-white ${archivo.className}`}>
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/5 p-4 md:px-8 flex justify-between items-center h-20">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight text-[#BA9D76]">Panel Operacyjny</h1>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Na żywo: {new Date().toLocaleDateString('pl-PL')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <form action={async () => { 'use server'; }}>
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl shadow-xl backdrop-blur-sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Odśwież
                            </Button>
                        </form>
                    </div>
                </header>

                <main className="p-4 md:p-10 space-y-12 overflow-y-auto">
                    {/* Daily Summary Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <TrendingUp size={48} />
                            </div>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Dziś Sprzedano</p>
                            <h3 className="text-3xl font-bold text-[#BA9D76]">{totalTodayAmount.toFixed(2)} zł</h3>
                        </div>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ShoppingBag size={48} />
                            </div>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Zakończone Zamówienia</p>
                            <h3 className="text-3xl font-bold">{completedToday.length}</h3>
                        </div>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <UtensilsCrossed size={48} />
                            </div>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Wydane Potrawy</p>
                            <h3 className="text-3xl font-bold">{totalItems}</h3>
                        </div>
                        <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group border-l-4 border-l-[#BA9D76]">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Users size={48} />
                            </div>
                            <p className="text-xs font-bold text-[#BA9D76] uppercase tracking-widest mb-1">Aktywni Klienci</p>
                            <h3 className="text-3xl font-bold">{activeOrders.length}</h3>
                        </div>
                    </section>

                    {/* Active Orders Section */}
                    <section>
                        <div className="flex items-center gap-6 mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#BA9D76] rounded-full"></span>
                                Aktywne Zamówienia
                            </h2>
                            <div className="h-px bg-white/5 flex-1"></div>
                        </div>

                        {activeOrders.length === 0 ? (
                            <div className="text-center py-32 backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl shadow-2xl border-dashed">
                                <UtensilsCrossed className="mx-auto h-12 w-12 text-white/10 mb-4" />
                                <p className="text-white/40 text-lg">Aktualnie brak nowych zamówień na liście.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                                {activeOrders.map((order: any) => (
                                    <OrderCard key={order._id} order={order} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Recently Completed Section (Full Info Layout) */}
                    {completedToday.length > 0 && (
                        <section className="pt-10 border-t border-white/5">
                            <div className="flex items-center gap-6 mb-8">
                                <h2 className="text-xl font-bold text-white/60">Historia z Dzisiaj</h2>
                                <div className="h-px bg-white/5 flex-1"></div>
                            </div>
                            <div className="space-y-4">
                                {completedToday.map((order: any) => (
                                    <div key={order._id} className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white/10 transition-all shadow-lg">
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20 text-xs font-bold">
                                                OK
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-[#BA9D76]">#{order.orderNumber?.slice(-4)}</h4>
                                                <p className="text-white/70 text-sm font-medium">{order.customerName} • {order.customerPhone}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center md:text-left">
                                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Zamówienie</p>
                                            <p className="text-xs text-white/80 line-clamp-1 italic">
                                                {order.items?.map((i: any) => `${i.quantity}x ${i.menuItem.title}`).join(', ')}
                                            </p>
                                        </div>

                                        <div className="text-right flex items-center gap-8">
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Kwota</p>
                                                <p className="font-bold text-[#BA9D76]">{order.totalAmount?.toFixed(2)} zł</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}


