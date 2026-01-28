'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'basma2024'
const SESSION_COOKIE = 'admin_session'

export async function loginAdmin(formData: FormData) {
    const password = formData.get('password') as string

    if (!password) {
        return { success: false, message: 'Proszę wprowadzić hasło' }
    }

    if (password === ADMIN_PASSWORD) {
        // Set secure session cookie
        cookies().set(SESSION_COOKIE, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        redirect('/admin')
    }

    return { success: false, message: 'Nieprawidłowe hasło' }
}

export async function logoutAdmin() {
    cookies().delete(SESSION_COOKIE)
    redirect('/admin/login')
}

export async function isAuthenticated(): Promise<boolean> {
    const session = cookies().get(SESSION_COOKIE)
    return session?.value === 'authenticated'
}
