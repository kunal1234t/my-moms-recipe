// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firebase';
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const subscribed = await firestoreService.newsletter.subscribe(email);

    if (subscribed) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully subscribed to newsletter' 
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email already subscribed' 
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}