"use client"

import { OTPGenerator } from "@/components/otp-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <OTPGenerator />
    </main>
  )
}
