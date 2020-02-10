import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

const isBrowser = typeof window !== `undefined`

function useSidebar() {
  const sidebar = useRef(null)
  const [open, setOpen] = useState(false)
  const sidebarToggler = useRef(null)

  const [windowHeight, setWindowHeight] = useState(
    isBrowser ? window.innerHeight : 0
  )

  const store = useRef({
    resizeTimer: null,
    top: false,
    bottom: false,
    topOffset: 0,
    lastWindowPos: 0
  })

  const onResizeHandler = useCallback(() => {
    clearTimeout(store.current.resizeTimer)
    store.current.resizeTimer = setTimeout(() => {
      setWindowHeight(window.innerHeight)
    }, 250)
  }, [])

  const onScrollHandler = useCallback(() => {
    const { top, bottom, lastWindowPos } = store.current

    const windowPos = window.scrollY
    const bodyHeight = document.body.offsetHeight
    const sidebarHeight = sidebar.current.offsetHeight
    const sidebarOffsetTop = Math.round(
      windowPos + sidebar.current.getBoundingClientRect().top
    )

    if (sidebarHeight > windowHeight) {
      if (windowPos > lastWindowPos) {
        if (top) {
          store.current.top = false
          store.current.topOffset = sidebarOffsetTop > 0 ? sidebarOffsetTop : 0
          sidebar.current.setAttribute(
            'style',
            `top: ${store.current.topOffset}px;`
          )
        } else if (
          !bottom &&
          windowPos + windowHeight > sidebarHeight + sidebarOffsetTop &&
          sidebarHeight < bodyHeight
        ) {
          store.current.bottom = true
          sidebar.current.setAttribute('style', 'position: fixed; bottom: 0;')
        }
      } else if (windowPos < lastWindowPos) {
        if (bottom) {
          store.current.bottom = false
          store.current.topOffset = sidebarOffsetTop > 0 ? sidebarOffsetTop : 0
          sidebar.current.setAttribute(
            'style',
            `top: ${store.current.topOffset}px;`
          )
        } else if (!top && windowPos < sidebarOffsetTop) {
          store.current.top = true
          sidebar.current.setAttribute('style', 'position: fixed;')
        }
      } else {
        store.current.top = store.current.bottom = false
        store.current.topOffset = sidebarOffsetTop ? sidebarOffsetTop : 0
        sidebar.current.setAttribute(
          'style',
          `top: ${store.current.topOffset}px;`
        )
      }
    } else if (!top) {
      store.current.top = true
      sidebar.current.setAttribute('style', 'position: fixed;')
    }

    store.current.lastWindowPos = windowPos
  }, [windowHeight])

  useLayoutEffect(() => {
    if (isBrowser) {
      onResizeHandler()
      onScrollHandler()

      window.addEventListener('resize', onResizeHandler)
      window.addEventListener('scroll', onScrollHandler)

      return () => {
        window.removeEventListener('resize', onResizeHandler)
        window.removeEventListener('scroll', onScrollHandler)
      }
    }
  }, [onResizeHandler, onScrollHandler])

  const bundle = useMemo(() => [sidebar, open, setOpen, sidebarToggler], [open])

  return bundle
}

export default useSidebar
