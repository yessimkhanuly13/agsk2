"use client"

import { AgskVerification } from "@/components/AgskVerification"
import { Sidebar } from "@/components/Sidebar"

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Сверка АГСК</h1>
        <AgskVerification />
      </div>
    </div>
  )
}

