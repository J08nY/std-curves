/** @jsx jsx */
import { jsx } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import FooterMDX from '../footer.mdx'

function Footer() {
  return (
    <footer sx={{ mt: 6 }}>
      <div sx={{ variant: 'layout.container' }}>
        <MDXProvider>
          <FooterMDX />
        </MDXProvider>
      </div>
    </footer>
  )
}

export default Footer
