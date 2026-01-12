import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// Substitutions are now automatically assigned when an absence is created
// This endpoint is disabled as manual substitution assignment is no longer needed
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Substitutions are now automatically assigned. Simply create an absence and a substitutional teacher will be assigned automatically." },
    { status: 400 }
  )
}
