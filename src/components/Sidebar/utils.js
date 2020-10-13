import { Children } from 'react'
import { withPrefix } from 'gatsby'


const simplifyChildren = (children, prefix, depth = 0) => {
  return Children.toArray(children).reduce((items, item) => {

    if (!item.props || !item.props.children) {
      return items
    }

    if (item.props.mdxType === 'a') {
      let href = item.props.href;
      if (href.startsWith(prefix)) {
      	href = href.slice(prefix.length)
      }
      return items.concat({
        link: href,
        title: item.props.children
      })
    }

    if (depth > 0 && item.props.mdxType === 'ul') {
      const last = items[items.length - 1]

      items[items.length - 1] = {
        ...last,
        items: simplifyChildren(item.props.children, prefix)
      }

      return items
    }

    return items.concat(simplifyChildren(item.props.children, prefix, depth + 1))
  }, [])
}

const extendItem = item => {
  if (item.items) {
    for (const childItem of item.items) {
      childItem.level = item.level + 1
      childItem.parentLink = item.link

      extendItem(childItem)
    }
  }
}

export const getItems = (children, prefix) => {
  const items = simplifyChildren(children, prefix)

  for (const item of items) {
    item.level = 0

    extendItem(item)
  }

  return items
}

const isItemActive = (item, location) => {
  const linkMatchesPathname = withPrefix(item.link) === location.pathname

  if (linkMatchesPathname) {
    return item
  }

  return false
}

export const getActiveItem = (items, location) => {
  for (const item of items) {
    if (item.items) {
      const activeSubItem = getActiveItem(item.items, location)

      if (activeSubItem) {
        return activeSubItem
      }
    }

    if (item.link) {
      if (isItemActive(item, location)) {
        return item
      }
    }
  }

  return false
}

const isItemParentActive = (items, parentLink) => {
  for (const item of items) {
    if (item.link === parentLink) {
      return item
    }

    if (item.items) {
      for (const childItem of item.items) {
        const activeChildItem = isItemParentActive([childItem], parentLink)

        if (activeChildItem) {
          return activeChildItem
        }
      }
    }
  }

  return false
}

export const getActiveItemParentLinks = (
  items,
  activeItem,
  activeItemParentLinks
) => {
  if (activeItem.parentLink) {
    const activeParent = isItemParentActive(items, activeItem.parentLink)

    activeItemParentLinks.push(activeParent.link)

    return getActiveItemParentLinks(items, activeParent, activeItemParentLinks)
  }

  return activeItemParentLinks
}
