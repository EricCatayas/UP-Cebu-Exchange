import { NextRequest, NextResponse } from 'next/server';
// TODO: Test API
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Verify email endpoint' });
}
