/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import navbarData from '../navbar.yaml'
import ColorModeButton from './ColorModeButton'
import Link from './Link'

function Navbar() {
  return (
    <nav aria-label="Navbar Menu">
      <div sx={{ variant: 'layout.container', textAlign: 'right' , display: "flex", flexDirection: "row", alignItems: "center"}}>
      <Styled.h1 sx={{fontSize: "2em", margin: 0}}>Standard curve database</Styled.h1>
        <ul sx={{ listStyle: 'none', m: 0, ml: 'auto', p: 0 }}>
          {navbarData.items.map(item => (
            <li key={item.link} sx={{ ml: 3, display: 'inline-block' }}>
              <Link to={item.link} sx={{ variant: 'linkStyles.nav' }}>
                {item.title}
              </Link>
            </li>
          ))}
          <li sx={{ display: 'inline-block' }}>
            <ColorModeButton />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
