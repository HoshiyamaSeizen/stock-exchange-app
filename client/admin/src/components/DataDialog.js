import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';

export const DataDialog = (props) => {
	const handleClose = () => props.close();

	return (
		<Dialog className="data-dialog" onClose={handleClose} open={props.opened}>
			<DialogTitle>{props.isTable ? 'Data Table' : 'Data Graph'}</DialogTitle>
			<h4>
				<span className="abbr">{props.abbr}</span>
				{props.name}
			</h4>
		</Dialog>
	);
};
