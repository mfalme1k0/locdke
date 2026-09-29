import type { Access, FieldAccess } from 'payload'

/**
 * Roles
 *  - superadmin: developer. Structural changes, users, deletions, everything.
 *  - admin:      the stylist. Day-to-day content: media, services, portfolio,
 *                bookings, profile and site text. Cannot delete or touch structure.
 */
export type Role = 'admin' | 'superadmin'

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const isSuperadmin: Access = ({ req }) => req.user?.role === 'superadmin'

export const isAdminOrSuperadmin: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'superadmin'

/** Field-level: only superadmins may edit (e.g. the `role` field itself). */
export const superadminField: FieldAccess = ({ req }) => req.user?.role === 'superadmin'

/** Collection access: superadmin sees everyone, admins only see themselves. */
export const selfOrSuperadmin: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'superadmin') return true
  return { id: { equals: req.user.id } }
}

/** Used with `admin.hidden` to keep structural collections out of the client's sidebar. */
export const hideFromAdmins = ({ user }: { user?: { [key: string]: any } | null }): boolean =>
  user?.role !== 'superadmin'
