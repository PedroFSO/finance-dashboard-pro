import { IconBase, type IconProps } from './IconBase'

export function ArrowDownRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m7 7 10 10" />
      <path d="M17 7v10H7" />
    </IconBase>
  )
}

export function ArrowUpRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m7 17 10-10" />
      <path d="M17 17V7H7" />
    </IconBase>
  )
}

export function Landmark(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 10h18" />
      <path d="M4 10v8" />
      <path d="M8 10v8" />
      <path d="M12 10v8" />
      <path d="M16 10v8" />
      <path d="M20 10v8" />
      <path d="M2 21h20" />
      <path d="m12 3 9 4H3Z" />
    </IconBase>
  )
}

export function TrendingDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7h6v6" />
      <path d="m3 13 7-7 4 4 7-7" />
    </IconBase>
  )
}

export function TrendingUp(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 7h-6V1" />
      <path d="m21 1-7 7-4-4-7 7" />
    </IconBase>
  )
}

export function Wallet(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z" />
    </IconBase>
  )
}

export function PiggyBank(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 11a7 7 0 0 1 7-5h4a4 4 0 0 1 0 8h-1a7 7 0 0 1-7 5H7l-1 2H4l1-3a7 7 0 0 1 0-7Z" />
      <path d="M16 6V4" />
      <path d="M9 10h.01" />
    </IconBase>
  )
}
