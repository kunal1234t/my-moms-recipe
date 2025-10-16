// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // Create user in Firebase Auth
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
  console.error("Registration error:", error);
  const errorMessage = error instanceof Error ? error.message : "Something went wrong";
  
  if (errorMessage.includes('email-already-in-use')) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  return NextResponse.json({ error: errorMessage }, { status: 500 });
}
}