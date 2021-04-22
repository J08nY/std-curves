/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import LinkButton from './LinkButton'
import Snackbar from '@material-ui/core/Snackbar'

function CopyButton({ children, title, value, duration=3000, forwardedRef, ...props }) {
	const [open, setOpen] = React.useState(false);

	const copyChild = (event) => {
		event.currentTarget.children[0].children[0].select();
		event.currentTarget.children[0].children[0].setSelectionRange(0, 99999);
		document.execCommand("copy");
	  }

	const handleClick = (event) => {
		copyChild(event);
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	return (
		<div ref={forwardedRef}>
			<LinkButton onClick={handleClick} title={title} href="javascript:;" {...props}>
				<textarea type="text" sx={{ position: "absolute", left: "-1000px" }} readOnly value={value} />
				{children}
			</LinkButton>
			<Snackbar open={open} autoHideDuration={duration} onClose={handleClose} message="Copied!" 
						anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
						}}/>
		</div>
	)
}

export default React.forwardRef((props, ref) => <CopyButton {...props} forwardedRef={ref}/>)
