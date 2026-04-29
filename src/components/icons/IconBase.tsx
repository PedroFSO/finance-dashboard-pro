import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

export function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      {...props}
    >
      {children}
    </svg>
  )
}
