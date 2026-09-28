import type { Access } from 'payload'

export const isAuthenticated: Access = ({ req }) => {
  return Boolean(req.user)
}

export const isSuperadmin: Access = ({ req }) => {
  return req.user?.role === 'superadmin'
}

export const isAdminOrSuperadmin: Access = ({ req }) => {
  return (
    req.user?.role === 'admin' ||
    req.user?.role === 'superadmin'
  )
}