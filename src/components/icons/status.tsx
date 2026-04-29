import { IconBase, type IconProps } from './IconBase'

export function AlertTriangle(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 2 20h20Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </IconBase>
  )
}

export function Inbox(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h16v12l-4 4H8l-4-4Z" />
      <path d="M4 14h4l2 3h4l2-3h4" />
    </IconBase>
  )
}

export function Sparkles(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" />
      <path d="m5 16 .9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9Z" />
      <path d="m19 14 .7 1.6L21 16l-1.3.6L19 18l-.7-1.4L17 16l1.3-.4Z" />
    </IconBase>
  )
}
