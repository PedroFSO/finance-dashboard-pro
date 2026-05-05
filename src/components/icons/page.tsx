import { IconBase, type IconProps } from './IconBase'

export function ArrowDownAZ(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 3v16" />
      <path d="m2 16 3 3 3-3" />
      <path d="M11 7h6l-6 10h6" />
      <path d="M13 7h4" />
      <path d="M11 17h6" />
    </IconBase>
  )
}

export function ChevronsLeftRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 7-5 5 5 5" />
      <path d="m15 7 5 5-5 5" />
    </IconBase>
  )
}

export function Clock3(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5h4" />
    </IconBase>
  )
}

export function Download(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </IconBase>
  )
}

export function FileText(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </IconBase>
  )
}

export function CalendarRange(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h8" />
      <path d="M8 17h5" />
    </IconBase>
  )
}

export function Bookmark(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 3h12v18l-6-4-6 4Z" />
    </IconBase>
  )
}

export function Layers3(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </IconBase>
  )
}

export function ShieldCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z" />
      <path d="m9 12 2 2 4-5" />
    </IconBase>
  )
}
