/** @jsx jsx */
import { useRef } from 'react'
import { jsx } from 'theme-ui'
import ItemTitle from './ItemTitle'

export const isItemActive = (activeItemParentLinks, item) => {
  if (activeItemParentLinks) {
    for (const parentLink of activeItemParentLinks) {
      if (parentLink === item.link) {
        return true
      }
    }
  }

  return false
}

function Item({
  item,
  location,
  openItems,
  activeItem,
  activeItemParentLinks,
  toggleItem
}) {
  const isParentOfActiveItem = isItemActive(activeItemParentLinks, item)
  const isActive = item.link === location.pathname || isParentOfActiveItem

  const isExpanded = openItems[item.link]

  const id = useRef(item.link.replace(/\W+/g, '')).current

  return (
    <li>
      <ItemTitle
        id={id}
        item={item}
        isActive={isActive}
        isExpanded={isExpanded}
        toggleItem={toggleItem}
      />

      {item.items && (
        <ul
          id={id}
          aria-expanded={isExpanded}
          sx={{ display: isExpanded ? 'block' : 'none' }}
        >
          {item.items.map(subitem => (
            <Item
              key={subitem.link}
              item={subitem}
              location={location}
              openItems={openItems}
              activeItem={activeItem}
              activeItemParentLinks={activeItemParentLinks}
              toggleItem={toggleItem}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Item
