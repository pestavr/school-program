import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const schedules = await prisma.schedule.findMany({
      include: {
        teacher: true,
        location: true
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
    })

    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
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
    const { teacherId, locationId, isSubstitutional, dayOfWeek, startTime, endTime } = body

    if (!teacherId || dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

    // Location is required only if not substitutional
    if (!isSubstitutional && !locationId) {
      return NextResponse.json(
        { error: "Location is required for non-substitutional schedules" },
        { status: 400 }
      )
    }

    const schedule = await prisma.schedule.create({
      data: {
        teacherId,
        locationId: isSubstitutional ? null : locationId,
        isSubstitutional: isSubstitutional || false,
        dayOfWeek,
        startTime,
        endTime
      },
      include: {
        teacher: true,
        location: true
      }
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error("Failed to create schedule:", error)
    return NextResponse.json(
      { error: "Failed to create schedule", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
