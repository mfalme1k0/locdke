'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useSyncExternalStore } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey, themePreferenceChangeEvent } from './types'

const getThemeValue = () => window.localStorage.getItem(themeLocalStorageKey) ?? 'auto'
const getServerThemeValue = () => 'auto'

const subscribeToThemeValue = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  window.addEventListener(themePreferenceChangeEvent, onChange)

  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(themePreferenceChangeEvent, onChange)
  }
}

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const value = useSyncExternalStore(subscribeToThemeValue, getThemeValue, getServerThemeValue)

  const onThemeChange = (themeToSet: Theme | 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
    } else {
      setTheme(themeToSet)
    }
  }

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
