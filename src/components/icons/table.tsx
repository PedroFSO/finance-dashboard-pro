import { IconBase, type IconProps } from './IconBase'

export function ArrowDownLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m17 7-10 10" />
      <path d="M7 7v10h10" />
    </IconBase>
  )
}

export function ArrowDownUp(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="m7 10 5-5 5 5" />
      <path d="m17 14-5 5-5-5" />
    </IconBase>
  )
}

export function ChevronDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}

export function ChevronUp(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m18 15-6-6-6 6" />
    </IconBase>
  )
}

export function Pencil(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" />
    </IconBase>
  )
}

export function Trash2(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  )
}
