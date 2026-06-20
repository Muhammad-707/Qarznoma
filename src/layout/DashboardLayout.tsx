import * as React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import MobileNav from "./MobileNav"
export function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#030308] text-foreground flex transition-colors duration-300 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-0 min-w-0 max-w-full">
        <Header />
        <main className="pt-24 sm:pt-26 pb-4 sm:pb-8 px-4 sm:px-8 flex-grow overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}