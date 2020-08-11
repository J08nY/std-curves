/** @jsx jsx */
import { Global } from '@emotion/core'
import { Helmet } from 'react-helmet'
import { css, jsx, Styled, useThemeUI } from 'theme-ui'
import useSidebar from '../hooks/useSidebar'
import Footer from './Footer'
import Navbar from './Navbar'
import ScreenReader from './ScreenReader'
import Sidebar from './Sidebar'
import SidebarToggler from './Sidebar/Toggler'
import Crocs from './Crocs'

function Layout({ children, location }) {
  const [sidebar, sidebarOpen, setSidebarOpen, sidebarToggler] = useSidebar()

  const { theme } = useThemeUI()

  return (
    <Styled.root sx={{ variant: 'layout.root' }}>
      <Helmet meta={[{ name: 'theme-color', content: theme.colors.primary }]} />

      <Global styles={css({ variant: 'layout.global' })} />

      <ScreenReader as="a" href="#__content">
        Skip to main content
      </ScreenReader>

      <SidebarToggler
        sidebar={sidebar}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        toggler={sidebarToggler}
      />
      <Sidebar
        location={location}
        sidebar={sidebar}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        toggler={sidebarToggler}
      />

      <div
        className={sidebarOpen ? 'pushed' : ''}
        sx={{ variant: 'layout.main' }}
      >
        <Navbar />

        <main
          id="__content"
          sx={{
            variant: 'layout.container',
            '& > p:first-of-type': { pt: '0.75rem' }
          }}
        >
          {children}
        </main>
        <a href="https://crocs.fi.muni.cz/" title="Visit us at CRoCS lab!">
          <Crocs aria-hidden sx={{ position: "absolute", right: "20px", top: "40px", width: "150px"}}/>
        </a>
        <Footer />
      </div>
    </Styled.root>
  )
}

export default Layout
