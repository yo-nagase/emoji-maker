import { NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import { auth, clerkClient } from '@clerk/nextjs/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  const { prompt } = await request.json()
  const { userId } = auth();

  try {
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    const userName = user?.firstName || user?.lastName || 'Anonymous'
    console.log("👦", userId)
    console.log( userName)

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      {
        input: {
          // prompt,
          // apply_watermark: false,
          // nsfw_checker: true, // NSFWチェッカーを有効化
          width: 1024,
          height: 1024,
          prompt: prompt,
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 0,
          negative_prompt: "worst quality, low quality",
          num_inference_steps: 4
        }
      }
    )

    if (!Array.isArray(output) || output.length === 0) {
      throw new Error('Replicate APIからの予期しない出力形式です')
    }

    const emojiUrl = output[0]

    // 生成された絵文字をデータベースに保存
    const { data, error } = await supabase
      .from('emojis')
      .insert({
        url: emojiUrl, likes: 0,
        prompt: prompt,
        user_id: userId || null,
        user_name: userName || null
      })
      .select()

    if (error) throw error

    return NextResponse.json({ emoji: data[0] })
  } catch (error: unknown) {
    console.error('絵文字の生成中にエラーが発生しました:', error instanceof Error ? error.message : String(error))

    // NSFWコンテンツエラーの特別な処理
    if (error instanceof Error && error.message.includes('NSFW content detected')) {
      return NextResponse.json({ error: '不適切なコンテンツが検出されました。別のプロンプトを試してください。' }, { status: 400 })
    }

    return NextResponse.json({ error: '絵文字の生成に失敗しました。もう一度お試しください。' }, { status: 500 })
  }
}