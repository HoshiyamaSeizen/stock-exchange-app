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
	Snackbar,
	Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { NewBrokerDialog } from './NewBrokerDialog';

import '../styles/List.sass';

let brokersList = [];

export const BrokersList = (props) => {
	const [expanded, setExpanded] = useState(false);
	const [brokers, setBrokers] = useState(brokersList);
	const [dialogOpen, setOpen] = useState(false);
	const [snackbarOpen, setSnackbar] = useState(false);
	const [snackbarText, setSnackbarText] = useState('');

	useEffect(() => {
		if (brokersList.length > 0) return;
		brokersList = [];
		fetch('/api/brokers/', { method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				data.forEach((broker) => brokersList.unshift({ ...broker, visible: true }));
				setBrokers(brokersList);
			});
	}, []);

	const handleClickOpen = () => setOpen(true);
	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setSnackbar(false);
	};
	const handleAccordionChange = (panel) => (e, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const search = (e) => {
		setBrokers(
			brokers.map((broker) => {
				broker.visible = broker.name.toLowerCase().includes(e.target.value.toLowerCase());
				return broker;
			})
		);
	};

	const addBroker = (name, money) => {
		fetch('/api/brokers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, money }),
		})
			.then((res) => res.json())
			.then((broker) => {
				brokersList.unshift({ ...broker, visible: true });
				setExpanded(false);
				setBrokers(brokersList);
				setSnackbarText('Broker added');
				setSnackbar(true);
			});
	};

	const saveBroker = (id, index) => () => {
		const money = +document.getElementById(`money-${index}`).value;
		fetch(`/api/brokers/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ money }),
		})
			.then((res) => res.json())
			.then((broker) => {
				brokersList[index].money = broker.money;
				setBrokers([...brokers]);
				setSnackbarText('Broker changed');
				setSnackbar(true);
			});
	};

	const deleteBroker = (id) => () => {
		if (window.confirm('Do you really want to delete this user?')) {
			fetch(`/api/brokers/${id}`, { method: 'DELETE' }).then(() => {
				brokersList = brokers.filter((broker) => broker.id !== id);
				setBrokers(brokersList);
				setSnackbarText('Broker deleted');
				setSnackbar(true);
			});
		}
	};

	return (
		<div className="list">
			<p>{props.aa}</p>
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
							<Button variant="contained" onClick={saveBroker(broker.id, index)}>
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
			<Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
				<Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
					{snackbarText}
				</Alert>
			</Snackbar>
		</div>
	);
};
