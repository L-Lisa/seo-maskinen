import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type { CookieOptions } from '@supabase/ssr'

// Error messages in Swedish
const ERRORS = {
  MISSING_FIELDS: 'Alla fält måste fyllas i',
  INVALID_EMAIL: 'Ogiltig e-postadress',
  SAVE_FAILED: 'Kunde inte spara meddelandet. Försök igen senare.',
  GENERIC_ERROR: 'Något gick fel. Försök igen senare.',
} as const

// Helper function to create Supabase client
async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        }
      }
    }
  )
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, error: ERRORS.MISSING_FIELDS },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: ERRORS.INVALID_EMAIL },
        { status: 400 }
      )
    }

    // Store contact request
    const { error } = await supabase
      .from('contact_requests')
      .insert([{
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
        status: 'new'
      }])

    if (error) {
      console.error('Error storing contact request:', error)
      throw new Error(ERRORS.SAVE_FAILED)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tack för ditt meddelande! Vi återkommer så snart som möjligt.'
    })

  } catch (error) {
    console.error('Contact error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : ERRORS.GENERIC_ERROR 
      },
      { status: 500 }
    )
  }
}