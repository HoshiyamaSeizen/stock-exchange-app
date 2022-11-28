import React, { useEffect, useState } from 'react';
import {
	TextField,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { NewBrokerDialog } from './NewBrokerDialog';

import '../styles/List.sass';

export const BrokersList = () => {
	const [expanded, setExpanded] = useState(false);
	const [brokers, setBrokers] = useState([]);
	const [dialogOpen, setOpen] = useState(false);

	useEffect(() => {
		const users = [
			{ id: 0, name: 'John Doe 0', visible: true, money: 100 },
			{ id: 1, name: 'John Doe 1', visible: true, money: 100 },
			{ id: 2, name: 'John Doe 2', visible: true, money: 100 },
			{ id: 3, name: 'John Doe 3', visible: true, money: 100 },
			{ id: 4, name: 'John Doe 4', visible: true, money: 100 },
			{ id: 5, name: 'John Doe 5', visible: true, money: 100 },
			{ id: 6, name: 'John Doe 6', visible: true, money: 100 },
			{ id: 7, name: 'John Doe 7', visible: true, money: 100 },
			{ id: 8, name: 'John Doe 8', visible: true, money: 100 },
			{ id: 9, name: 'John Doe 9', visible: true, money: 100 },
			{ id: 10, name: 'John Doe 10', visible: true, money: 100 },
			{ id: 11, name: 'John Doe 11', visible: true, money: 100 },
			{ id: 12, name: 'John Doe 12', visible: true, money: 100 },
			{ id: 13, name: 'John Doe 13', visible: true, money: 100 },
			{ id: 14, name: 'John Doe 14', visible: true, money: 100 },
			{ id: 15, name: 'John Doe 15', visible: true, money: 100 },
			{ id: 16, name: 'John Doe 16', visible: true, money: 100 },
			{ id: 17, name: 'John Doe 17', visible: true, money: 100 },
			{ id: 18, name: 'John Doe 18', visible: true, money: 100 },
			{ id: 19, name: 'John Doe 19', visible: true, money: 100 },
			{ id: 20, name: 'John Doe 20', visible: true, money: 100 },
		];
		users.reverse();
		setBrokers(users);
	}, []);

	const handleClickOpen = () => setOpen(true);

	const handleAccordionChange = (panel) => (e, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const search = (e) => {
		setBrokers(
			brokers.map((broker) => {
				broker.visible = broker.name.includes(e.target.value);
				return broker;
			})
		);
	};

	const addBroker = (name, money) => {
		const id = brokers.at(0).id + 1 || 0;
		setBrokers([{ id, name, money, visible: true }, ...brokers]);
		setExpanded(false);
	};

	const saveBroker = (index) => () => {
		const value = document.getElementById(`money-${index}`).value;
		const newBrokers = [...brokers];
		newBrokers[index].money = +value;
		setBrokers(newBrokers);
		console.log(value);
	};

	const deleteBroker = (id) => () => {
		if (window.confirm('Do you really want to delete this user?')) {
			setBrokers(brokers.filter((broker) => broker.id !== id));
		}
	};

	return (
		<div className="list">
			<header>
				<h2>Brokers</h2>
				<TextField
					id="outlined-search"
					label="Search field"
					type="search"
					size="small"
					fullWidth
					onChange={search}
				/>
				<IconButton color="primary" onClick={handleClickOpen}>
					<AddIcon />
				</IconButton>
			</header>
			<main>
				{brokers.map((broker, index) => (
					<Accordion
						key={broker.id}
						expanded={expanded === broker.id}
						onChange={handleAccordionChange(broker.id)}
						hidden={!broker.visible}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<h4>{broker.name}</h4>
						</AccordionSummary>
						<AccordionDetails>
							<FormControl fullWidth sx={{ m: 1 }}>
								<InputLabel htmlFor={`money-${index}`}>Amount</InputLabel>
								<OutlinedInput
									id={`money-${index}`}
									defaultValue={broker.money}
									startAdornment={<InputAdornment position="start">$</InputAdornment>}
									label="Amount"
									type="number"
								/>
							</FormControl>
							<Button variant="contained" onClick={saveBroker(index)}>
								Save
							</Button>
							<IconButton color="danger" onClick={deleteBroker(broker.id)}>
								<DeleteIcon />
							</IconButton>
						</AccordionDetails>
					</Accordion>
				))}
			</main>
			<NewBrokerDialog opened={dialogOpen} close={() => setOpen(false)} addBroker={addBroker} />
		</div>
	);
};
