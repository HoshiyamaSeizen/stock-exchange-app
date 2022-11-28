import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	Button,
} from '@mui/material';

export const NewBrokerDialog = (props) => {
	const [name, setName] = useState('');
	const [money, setMoney] = useState(0);

	const handleClose = () => props.close();

	const submit = () => {
		props.addBroker(name, money);
		setName('');
		setMoney(0);
		props.close();
	};

	return (
		<Dialog onClose={handleClose} open={props.opened}>
			<DialogTitle>Add new broker</DialogTitle>
			<FormControl fullWidth sx={{ m: 1 }}>
				<InputLabel htmlFor="dialog-name">Name</InputLabel>
				<OutlinedInput
					id="dialog-name"
					label="Name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
			<FormControl fullWidth sx={{ m: 1 }}>
				<InputLabel htmlFor="dialog-money">Money</InputLabel>
				<OutlinedInput
					id="dialog-money"
					startAdornment={<InputAdornment position="start">$</InputAdornment>}
					label="Money"
					type="number"
					defaultValue={money}
					onChange={(e) => setMoney(+e.target.value)}
				/>
			</FormControl>
			<Button variant="contained" onClick={submit}>
				Add
			</Button>
		</Dialog>
	);
};
