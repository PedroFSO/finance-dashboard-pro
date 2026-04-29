import { IconBase, type IconProps } from './IconBase'

export function CalendarDays(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </IconBase>
  )
}

export function Tag(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m20 10-8 8-9-9V4h5Z" />
      <path d="M7 7h.01" />
    </IconBase>
  )
}

export function X(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  )
}

export function FunnelX(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 5h18l-7 8v5l-4 2v-7Z" />
      <path d="m17 3 4 4" />
      <path d="m21 3-4 4" />
    </IconBase>
  )
}

export function Layers3(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </IconBase>
  )
}
