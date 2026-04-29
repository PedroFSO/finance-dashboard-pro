import { useEffect, useState } from 'react'
import type { SavedFilterPreset } from '../utils/filterPresets'

const STORAGE_KEY = 'finance-dashboard-pro-filter-presets'

export function useSavedFilterPresets() {
  const [presets, setPresets] = useState<SavedFilterPreset[]>(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    try {
      return JSON.parse(storedValue) as SavedFilterPreset[]
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  }, [presets])

  function savePreset(preset: SavedFilterPreset) {
    setPresets((current) => {
      const nextPresets = [preset, ...current.filter((item) => item.id !== preset.id)]
      return nextPresets.slice(0, 6)
    })
  }

  function removePreset(id: string) {
    setPresets((current) => current.filter((preset) => preset.id !== id))
  }

  return {
    presets,
    removePreset,
    savePreset,
  }
}
