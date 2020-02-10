/** @jsx jsx */
import { graphql, useStaticQuery } from 'gatsby'
import { jsx } from 'theme-ui'
import Link from '../Link'
import LogoComponent from '../Logo'
import ScreenReader from '../ScreenReader'

const Title = LogoComponent ? ScreenReader : 'span'

const logo = LogoComponent && (
  <LogoComponent aria-hidden sx={{ display: 'block', height: '1.5em' }} />
)

function Branding() {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div sx={{ variant: 'layout.container', px: 0 }}>
      <h3 sx={{ fontSize: 'inherit', m: 0 }}>
        <Link
          to="/"
          sx={{
            variant: 'linkStyles.nav',
            ':hover': { color: 'inherit', textDecoration: 'none' },
            '&.active': { color: 'inherit' }
          }}
        >
          {logo}
          <Title>{site.siteMetadata.title}</Title>
        </Link>
      </h3>
    </div>
  )
}

export default Branding
