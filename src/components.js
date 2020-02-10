import Prism from '@theme-ui/prism'
import Link from './components/Link'

export default {
  a: Link,
  code: Prism,
  pre: props => props.children
}