import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { draftMode } from 'next/headers'

/** Chrome for the template's generic routes (pages, posts, search). The one-page site brings its own. */
export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  return (
    <>
      <AdminBar adminBarProps={{ preview: isEnabled }} />
      <Header />
      {children}
      <Footer />
    </>
  )
}
