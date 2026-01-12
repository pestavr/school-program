import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Use Greece timezone (Europe/Athens)
    const now = new Date()
    
    // Get components in Greek timezone
    const greekTimeString = now.toLocaleString('en-US', { 
      timeZone: 'Europe/Athens',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    })
    
    // Parse the Greek time components
    const greekDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Athens' }))
    const currentDay = greekDate.getDay() // 0-6
    
    // Get time in HH:MM format
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    const currentTime = timeFormatter.format(now) // HH:MM format
    
    // Get date in YYYY-MM-DD format
    const dateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Athens'
    })
    const currentDate = dateFormatter.format(now) // YYYY-MM-DD format

    // Get regular schedules (non-substitutional teachers)
    const schedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek: currentDay,
        startTime: {
          lte: currentTime
        },
        endTime: {
          gte: currentTime
        },
        isSubstitutional: false
      },
      include: {
        teacher: true,
        location: true,
        substituteTeacher: true
      }
    })

    // Get all absences for today
    const todayAbsences = await prisma.absence.findMany({
      where: {
        date: currentDate
      },
      include: {
        teacher: true
      }
    })

    // Get all substitutional teachers (available to cover absences)
    const substitutionalTeachers = await prisma.schedule.findMany({
      where: {
        isSubstitutional: true
      },
      include: {
        teacher: true
      },
      distinct: ['teacherId']
    })

    // Build a map of absent teacher IDs
    const absentTeacherIds = new Set(todayAbsences.map(a => a.teacherId))
    const absenceMap = new Map(todayAbsences.map(a => [a.teacherId, a]))

    // Track which substitutional teachers have been assigned
    let substitutionalIndex = 0

    // Process schedules: replace absent teachers with substitutional teachers
    const schedulesWithSubstitutes = schedules.map(schedule => {
      if (absentTeacherIds.has(schedule.teacherId)) {
        // Teacher is absent, assign a substitutional teacher
        const absence = absenceMap.get(schedule.teacherId)
        
        // Get next available substitutional teacher (round-robin)
        if (substitutionalTeachers.length > 0) {
          const substituteSchedule = substitutionalTeachers[substitutionalIndex % substitutionalTeachers.length]
          substitutionalIndex++

          return {
            ...schedule,
            originalTeacher: schedule.teacher,
            teacher: substituteSchedule.teacher,
            isSubstitute: true,
            absenceReason: absence?.reason
          }
        }
      }

      return {
        ...schedule,
        isSubstitute: false
      }
    })

    return NextResponse.json(schedulesWithSubstitutes)
  } catch (error) {
    console.error('Error fetching current schedules:', error)
    return NextResponse.json(
      { 
        error: "Failed to fetch current schedules",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
