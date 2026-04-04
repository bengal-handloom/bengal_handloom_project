import { adminAuth } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";


// init app same as firebaseAdmin.ts

const ADMIN_EMAIL = "admin@bengalihandloom.ca"; // or pass argv

export async function POST(req: NextRequest) {
  const user = await adminAuth.getUserByEmail(ADMIN_EMAIL);
  await adminAuth.setCustomUserClaims(user.uid, { admin: true });

  return NextResponse.json({message:"Success"})
}