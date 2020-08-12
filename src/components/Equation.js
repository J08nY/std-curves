/** @jsx jsx */
import { jsx } from 'theme-ui'
import { BlockMath } from 'react-katex';
import dracula from '@theme-ui/prism/presets/dracula.json'


function Equation({children, ...props }) {
  if (children) {
    return <div {...props} sx={{".katex":{color:dracula.color, backgroundColor: dracula.backgroundColor, borderRadius: "0.5rem", padding: "10px", boxShadow: "0px 0px 10px -3px rgba(0,0,0,0.5)"}}}><BlockMath>{children}</BlockMath></div>
  } else {
    return <div/>
  }
}

export default Equation
