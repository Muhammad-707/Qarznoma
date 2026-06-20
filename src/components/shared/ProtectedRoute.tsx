import * as React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useLoginStore, getTokens } from "@/store/AuthStore/LoginStore"

// Защищенный роут: доступен ТОЛЬКО авторизованным пользователям
export function ProtectedRoute() {
  // ИСПРАВЛЕНО: Подписываемся на 'user'. Это дает реактивность изменений без ошибок TypeScript.
  const user = useLoginStore((state) => state.user)
  const token = getTokens()

  // Если токена нет, перенаправляем на страницу входа
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

// Гостевой роут: не пустит авторизованного обратно на Login / SignUp
export function PublicRoute() {
  // ИСПРАВЛЕНО: Подписываемся на 'user' для отслеживания изменений состояния входа/выхода
  const user = useLoginStore((state) => state.user)
  const token = getTokens()

  // Если токен есть, перенаправляем авторизованного пользователя в дашборд
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}