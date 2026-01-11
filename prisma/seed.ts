import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('GymAei@2026', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pgpp.gr' },
    update: {},
    create: {
      email: 'admin@pgpp.gr',
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin'
    }
  })

  console.log('Created admin user:', admin.email)

  // Create teachers
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        name: 'ΜΑΡΙΑ ΠΑΝΑΓΟΥ',
        email: 'panagoumar@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Θεόδωρος Σιδέρης',
        email: 'teosideris@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΔΙΟΝΥΣΙΟΣ ΠΑΝΤΕΛΗΣ',
        email: 'dionisisart@yahoo.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΜΑΡΙΑ ΚΑΡΑΘΑΝΟΥ',
        email: 'markakis@upatras.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΔΕΣΠΟΙΝΑ ΠΛΩΤΑ',
        email: 'despoinaplota@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΒΑΣΙΛΙΚΗ ΡΗΓΑ',
        email: 'valiachios@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Γεωργία Τομαρά',
        email: 'tomarageorgia@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Γιάννης Χιωτέλης',
        email: 'johnchiotelis@yahoo.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Βασιλική Κασελά',
        email: 'vkassela@yahoo.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΑΝΑΣΤΑΣΙΑ ΠΟΤΟΥ',
        email: 'anpotou@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Γκίντα Βαζούρα',
        email: 'gidavazoura@yahoo.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Ελένη Κωνσταντίνα Κούνα',
        email: 'elenikouna@hotmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΚΑΛΛΙΦΡΟΝΗ ΑΒΡΑΜΙΔΟΥ',
        email: 'noniavram@sch.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΕΥΣΤΑΘΙΑ ΔΗΜΗΤΡΟΠΟΥΛΟΥ',
        email: 'effiedimitr@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Μαρία Κονδύλη',
        email: 'taemakoni@yahoo.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Νικολία Βίτσου',
        email: 'nikoliavitsou@yahoo.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΧΡΥΣΟΥΛΑ ΚΑΡΑΒΑΣΕΛΑ',
        email: 'karavasela@hotmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Θεανώ Ποταμιάνου',
        email: 'tpotamianou@yahoo.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΣΤΕΦΑΝΙΑ ΘΕΟΔΩΡΙΔΟΥ',
        email: 'stefantheod@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Ραφαήλ Βασιλόπουλος',
        email: 'rafvasilopoulos@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΕΥΣΤΡΑΤΙΟΣ ΜΑΡΙΝΟΣ',
        email: 'stratosmar@yahoo.gr'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΜΑΡΙΑ ΡΕΝΤΖΗ',
        email: 'marygreece2002@yahoo.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'Δήμητρα Καράμπελα',
        email: 'mkarampela@gmail.com'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'ΚΩΝΣΤΑΝΤΙΝΑ ΜΑΡΑΖΙΩΤΗ',
        email: 'nadiamaraz22@gmail.com'
      }
    })
  ])

  console.log(`Created ${teachers.length} teachers`)

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Προαύλιο Α'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Προαύλιο Β'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Ισόγειο'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Όροφος'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Υπόγειο'
      }
    })
  ])

  console.log(`Created ${locations.length} locations`)

  // Create sample schedules (Monday to Friday, 10:00-10:15 break)
  const schedules = []
  for (let day = 1; day <= 5; day++) {
    schedules.push(
      prisma.schedule.create({
        data: {
          teacherId: teachers[0].id,
          locationId: locations[0].id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '10:15'
        }
      }),
      prisma.schedule.create({
        data: {
          teacherId: teachers[1].id,
          locationId: locations[1].id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '10:15'
        }
      }),
      prisma.schedule.create({
        data: {
          teacherId: teachers[2].id,
          locationId: locations[2].id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '10:15'
        }
      })
    )
  }

  await Promise.all(schedules)
  console.log(`Created ${schedules.length} schedules`)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
