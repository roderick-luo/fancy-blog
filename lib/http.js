import { NextResponse } from 'next/server'
export const ok = (d = {}, s = 200) => NextResponse.json(d, { status: s })
export const bad = (msg, s = 400) => NextResponse.json({ error: msg }, { status: s })
