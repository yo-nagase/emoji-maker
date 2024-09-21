import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  console.log("superbaseに接続します")
  const { url } = await request.json()

  try {
    const { data, error } = await supabase
      .from('emojis')
      .insert({ url, likes: 0 })
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error storing emoji:', error)
    return NextResponse.json({ error: 'Failed to store emoji' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('emojis')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching emojis:', error)
    return NextResponse.json({ error: 'Failed to fetch emojis' }, { status: 500 })
  }
}
