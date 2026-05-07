import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL
    if (!GAS_URL) {
      console.error('[survey] GOOGLE_APPS_SCRIPT_URL 환경변수 미설정')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      redirect: 'follow',
    })

    const result = await response.json()

    if (result.result === 'success') {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'GAS error', detail: result.message }, { status: 500 })
  } catch (err) {
    console.error('[survey]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
