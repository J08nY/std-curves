/** @jsx jsx */
import { Link as GatsbyLink } from 'gatsby'
import isAbsoluteURL from 'is-absolute-url'
import { jsx } from 'theme-ui'

const linkStyles = { variant: 'styles.a' }

function Link({ to = '', href = to, children, ...props }) {
  const isAbsoluteLink = isAbsoluteURL(href)

  return isAbsoluteLink || href.startsWith("http://") || href.startsWith("https://") ? (
    <a {...props} href={href} sx={linkStyles}>
      {children}
    </a>
  ) : (
    <GatsbyLink {...props} to={href} activeClassName="active" sx={linkStyles}>
      {children}
    </GatsbyLink>
  )
}

export default Link
