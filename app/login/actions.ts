"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password" }
    }
    return { success: false, error: "An error occurred" }
  }
}
