import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  return NextResponse.json({
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
    allCookies: request.cookies.getAll().map(cookie => ({
      name: cookie.name,
      value: cookie.value.substring(0, 10) + '...'
    }))
  });
}
