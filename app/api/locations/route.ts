import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" }
    })

    return NextResponse.json(locations)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const location = await prisma.location.create({
      data: { name, description }
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    )
  }
}
