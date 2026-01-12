import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { absenceId, substituteTeacherId, notes } = body

    if (!absenceId || !substituteTeacherId) {
      return NextResponse.json(
        { error: "Absence ID and substitute teacher ID are required" },
        { status: 400 }
      )
    }

    const substitution = await prisma.substitution.create({
      data: {
        absenceId,
        substituteTeacherId,
        notes
      },
      include: {
        absence: {
          include: {
            teacher: true
          }
        },
        substituteTeacher: true
      }
    })

    return NextResponse.json(substitution, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create substitution" },
      { status: 500 }
    )
  }
}
