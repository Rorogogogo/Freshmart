import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward the registration request to your backend API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5118'
      }/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: body.name?.split(' ')[0] || '',
          lastName: body.name?.split(' ').slice(1).join(' ') || '',
          email: body.email,
          password: body.password,
        }),
      }
    )

    // Check if the response is JSON
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // Handle non-JSON response
      const text = await response.text()
      console.error('Non-JSON response from server:', text)
      return NextResponse.json(
        {
          success: false,
          message:
            'Server returned an invalid response format. Please try again later.',
        },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Registration failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Registration successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
