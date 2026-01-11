import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updatePassword() {
  const email = process.argv[2]
  const newPassword = process.argv[3]

  if (!email || !newPassword) {
    console.error('Usage: npm run db:password <email> <new-password>')
    console.error('Example: npm run db:password admin@school.com newpass123')
    process.exit(1)
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log(`✅ Password updated successfully for ${email}`)
  } catch (error) {
    console.error('Error updating password:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updatePassword()
