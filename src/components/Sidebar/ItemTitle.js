/** @jsx jsx */
import { alpha } from '@theme-ui/color'
import { jsx } from 'theme-ui'
import Link from '../Link'
import Chevron from './Chevron'

const ChevronIcon = ({ isExpanded }) => (
  <Chevron
    sx={{
      transform: `rotate(${isExpanded ? 180 : 270}deg)`,
      transition: 'transform 100ms cubic-bezier(0.4,0,0.2,1)'
    }}
  />
)

const styles = {
  Root: {
    display: 'block',
    position: 'relative',
    width: '100%',
    p: 0,
    m: 0,
    border: 0,
    background: 'transparent',
    color: 'text',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    textAlign: 'left'
  },
  Button: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '2.5rem',
    background: 'transparent',
    color: 'inherit',
    border: 0,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Title: {
    variant: 'linkStyles.nav',
    display: 'block',
    pr: '2.5rem',
    ':hover': {
      variant: 'linkStyles.nav.:hover',
      bg: alpha('primary', 0.05)
    }
  }
}

function ToggleableItemTitle({ id, item, isActive, isExpanded, toggleItem }) {
  return item.link ? (
    <span sx={styles.Root}>
      <Link
        to={item.link}
        className={isActive ? 'active' : ''}
        sx={styles.Title}
      >
        {item.title}
      </Link>

      <button
        sx={styles.Button}
        aria-controls={id}
        aria-expanded={isExpanded}
        aria-label={item.title + (isExpanded ? ` collapse` : ` expand`)}
        onClick={() => toggleItem(item)}
      >
        <ChevronIcon isExpanded={isExpanded} />
      </button>
    </span>
  ) : (
    <button
      aria-controls={id}
      aria-expanded={isExpanded}
      aria-label={item.title + (isExpanded ? ` collapse` : ` expand`)}
      onClick={() => toggleItem(item)}
      sx={styles.Root}
    >
      <span className={isActive ? 'active' : ''} sx={styles.Title}>
        {item.title}
      </span>

      <span sx={styles.Button}>
        <ChevronIcon isExpanded={isExpanded} />
      </span>
    </button>
  )
}

function ItemTitle({ id, item, isActive, isExpanded, toggleItem }) {
  return item.items ? (
    <ToggleableItemTitle
      id={id}
      item={item}
      isActive={isActive}
      isExpanded={isExpanded}
      toggleItem={toggleItem}
    />
  ) : (
    <span>
      <Link
        to={item.link}
        className={isActive ? 'active' : ''}
        sx={styles.Title}
      >
        {item.title}
      </Link>
    </span>
  )
}

export default ItemTitle
