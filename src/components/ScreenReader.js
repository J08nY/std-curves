/** @jsx jsx */
import { jsx } from 'theme-ui'

const styles = {
  border: 0,
  clip: 'rect(1px, 1px, 1px, 1px)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  wordWrap: 'normal !important',
  ':focus': {
    bg: 'background',
    clip: 'auto !important',
    clipPath: 'none',
    color: 'text',
    display: 'block',
    height: 'auto',
    left: '5px',
    lineHeight: 'text',
    padding: '15px 23px 14px',
    textDecoration: 'none',
    top: '5px',
    width: 'auto',
    zIndex: 100000
  }
}

function ScreenReader({ as: Component = 'span', ...props }) {
  return <Component {...props} sx={styles} />
}

export default ScreenReader
