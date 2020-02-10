import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

function SidebarOverlay({ children }) {
  const overlay = useRef(document.createElement('div'))

  useEffect(() => {
    const node = overlay.current
    const rootNode = document.getElementById('___a11y')
    rootNode.appendChild(node)

    return () => rootNode.removeChild(node)
  }, [])

  return ReactDOM.createPortal(children, overlay.current)
}

export default SidebarOverlay
