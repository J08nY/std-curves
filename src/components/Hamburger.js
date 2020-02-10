/** @jsx jsx */
import { jsx } from 'theme-ui'

const hamburgerStyles = {
  display: 'block',
  cursor: 'pointer',
  bg: 'primary',
  m: 0,
  p: '1rem',
  borderRadius: '50%',

  '.Hamburger-box': {
    display: 'block',
    position: 'relative',
    width: 30,
    height: 30
  },

  '.Hamburger-stick': {
    bg: 'background',
    borderRadius: '4px',
    display: 'block',
    position: 'absolute',
    top: '50%',
    width: 30,
    height: '4px',
    mt: '-2px',
    [[':before', ':after']]: {
      bg: 'background',
      display: 'block',
      content: "''",
      position: 'absolute',
      width: 30,
      height: '4px',
      borderRadius: '4px'
    },
    ':before': {
      top: '-10px'
    },
    ':after': {
      bottom: '-10px'
    }
  },

  '&.active': {
    '.Hamburger-stick': {
      transform: 'rotate(45deg)',
      ':before': {
        top: 0,
        opacity: 0
      },
      ':after': {
        bottom: 0,
        transform: 'rotate(-90deg)'
      }
    }
  }
}

function Hamburger({ open, ...props }) {
  return (
    <span {...props} className={open ? 'active' : ''} sx={hamburgerStyles}>
      <span className="Hamburger-box">
        <span className="Hamburger-stick"></span>
      </span>
    </span>
  )
}

export default Hamburger
