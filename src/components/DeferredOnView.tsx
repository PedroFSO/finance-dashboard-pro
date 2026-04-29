import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

interface DeferredOnViewProps extends PropsWithChildren {
  fallback: ReactNode
  rootMargin?: string
}

export function DeferredOnView({
  children,
  fallback,
  rootMargin = '120px',
}: DeferredOnViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = containerRef.current

    if (!node || isVisible) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  return <div ref={containerRef}>{isVisible ? children : fallback}</div>
}
