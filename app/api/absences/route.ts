import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") // Optional filter by date

    const where = date ? { date } : {}

    const absences = await prisma.absence.findMany({
      where,
      include: {
        teacher: true,
        substitutions: {
          include: {
            substituteTeacher: true
          }
        }
      },
      orderBy: { date: "desc" }
    })

    return NextResponse.json(absences)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch absences" },
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
    const { teacherId, date, reason } = body

    if (!teacherId || !date) {
      return NextResponse.json(
        { error: "Teacher ID and date are required" },
        { status: 400 }
      )
    }

    const absence = await prisma.absence.create({
      data: {
        teacherId,
        date,
        reason
      },
      include: {
        teacher: true,
        substitutions: true
      }
    })

    return NextResponse.json(absence, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create absence" },
      { status: 500 }
    )
  }
}
