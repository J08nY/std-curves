/** @jsx jsx */
import { useCallback } from 'react'
import { jsx } from 'theme-ui'
import Hamburger from '../Hamburger'
import SidebarOverlay from './Overlay'
import { alpha } from '@theme-ui/color'
import ScreenReader from '../ScreenReader'

const togglerStyle = {
  display: ['block', null, 'none'],
  position: 'fixed',
  right: 4,
  bottom: 4,
  zIndex: 100,
  button: {
    bg: 'transparent',
    border: 0,
    p: 0
  }
}

function SidebarToggler({ sidebar, open, setOpen, toggler }) {
  const toggleSidebar = useCallback(() => {
    let wasOpen

    setOpen(open => {
      wasOpen = open
      return !open
    })

    if (!wasOpen) {
      setTimeout(() => sidebar.current.focus(), 50)
    }
  }, [setOpen, sidebar])

  return (
    <span sx={togglerStyle}>
      <button
        ref={toggler}
        onClick={toggleSidebar}
        aria-controls="__sidebar"
        aria-expanded={open}
      >
        <Hamburger open={open} aria-hidden />
        <ScreenReader>{open ? 'Close' : 'Open'} Sidebar</ScreenReader>
      </button>

      {open && (
        <SidebarOverlay>
          <div
            role="presentation"
            onMouseDown={toggleSidebar}
            sx={{
              display: ['block', null, 'none'],
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bg: alpha('background', 0.7)
            }}
          />
        </SidebarOverlay>
      )}
    </span>
  )
}

export default SidebarToggler
