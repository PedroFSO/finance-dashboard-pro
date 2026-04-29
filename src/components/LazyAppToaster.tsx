import { lazy } from 'react'

export const LazyAppToaster = lazy(() =>
  import('./AppToaster').then((module) => ({
    default: module.AppToaster,
  })),
)
