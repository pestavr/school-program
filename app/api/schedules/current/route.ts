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
        teacher: true,
        substitutions: {
          include: {
            substituteTeacher: true
          }
        }
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

    // Build a map: if manual substitution exists, use it; otherwise auto-assign
    const absentTeacherMap = new Map()
    let substitutionalIndex = 0

    todayAbsences.forEach(absence => {
      if (absence.substitutions.length > 0) {
        // Manual substitution exists - use it
        absentTeacherMap.set(absence.teacherId, {
          substitute: absence.substitutions[0].substituteTeacher,
          reason: absence.reason,
          isManual: true
        })
      } else {
        // No manual substitution - auto-assign a substitutional teacher
        if (substitutionalTeachers.length > 0) {
          const substituteSchedule = substitutionalTeachers[substitutionalIndex % substitutionalTeachers.length]
          substitutionalIndex++
          
          absentTeacherMap.set(absence.teacherId, {
            substitute: substituteSchedule.teacher,
            reason: absence.reason,
            isManual: false
          })
        }
      }
    })

    // Process schedules: replace absent teachers with their substitutes
    const schedulesWithSubstitutes = schedules.map(schedule => {
      const substitutionInfo = absentTeacherMap.get(schedule.teacherId)
      
      if (substitutionInfo) {
        // Teacher is absent and has a substitute
        return {
          ...schedule,
          originalTeacher: schedule.teacher,
          teacher: substitutionInfo.substitute,
          isSubstitute: true,
          absenceReason: substitutionInfo.reason
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
