/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import { Styled } from 'theme-ui'

function LinkButton({children, href, forwardedRef, ...props}) {
	return (
		<Styled.a href={href} ref={forwardedRef} {...props}>
			<span sx={{backgroundColor: "primary", color: "background", border: "none", borderRadius: "5px", padding: "10px"}}>
				{children}
			</span>
		</Styled.a>
	)
}

export default React.forwardRef((props, ref) => <LinkButton {...props} forwardedRef={ref}/>)