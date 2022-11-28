import React, { useEffect, useState } from 'react';
import {
	TextField,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControlLabel,
	Checkbox,
	Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataDialog } from './DataDialog';

import '../styles/List.sass';

export const StocksList = () => {
	const [expanded, setExpanded] = useState(false);
	const [stocks, setStocks] = useState([]);
	const [dialogOpen, setOpen] = useState(false);
	const [isTable, setTable] = useState(true);
	const [currentStock, setCurrentStock] = useState(null);

	useEffect(() => {
		const _stocks = [
			{ id: 0, abbr: 'AAPL', name: 'Apple, Inc.', visible: true, checked: false },
			{ id: 1, abbr: 'SBUX', name: 'Starbucks, Inc.', visible: true, checked: true },
			{ id: 2, abbr: 'MSFT', name: 'Microsoft, Inc.', visible: true, checked: true },
			{ id: 3, abbr: 'CSCO', name: 'Cisco Systems, Inc.', visible: true, checked: true },
		];
		_stocks.reverse();
		setStocks(_stocks);
	}, []);

	const handleClickOpen = (isTable, id) => (e) => {
		e.target.blur();
		setTable(isTable);
		setCurrentStock(stocks.find((s) => s.id === id));
		setOpen(true);
	};

	const handleAccordionChange = (panel) => (e, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const search = (e) => {
		setStocks(
			stocks.map((stock) => {
				stock.visible = stock.name.includes(e.target.value);
				return stock;
			})
		);
	};

	const saveStock = (index) => () => {
		const value = document.getElementById(`checked-${index}`).checked;
		const newStocks = [...stocks];
		newStocks[index].checked = value;
		setStocks(newStocks);
		console.log(value);
	};

	return (
		<div className="list">
			<header>
				<h2>Stocks</h2>
				<TextField
					id="outlined-search"
					label="Search field"
					type="search"
					size="small"
					fullWidth
					onChange={search}
				/>
			</header>
			<main>
				{stocks.map((stock, index) => (
					<Accordion
						key={stock.id}
						expanded={expanded === stock.id}
						onChange={handleAccordionChange(stock.id)}
						hidden={!stock.visible}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<h4>
								<span className="abbr">{stock.abbr}</span>
								{stock.name}
							</h4>
						</AccordionSummary>
						<AccordionDetails>
							<FormControlLabel
								control={
									<Checkbox
										id={`checked-${index}`}
										checked={stock.checked}
										onChange={saveStock(index)}
									/>
								}
								label="Include in trade:"
								labelPlacement="start"
							/>
						</AccordionDetails>
						<div className="data-buttons">
							<p>History:</p>
							<Button
								className="data-btn"
								variant="contained"
								onClick={handleClickOpen(true, stock.id)}
							>
								Table
							</Button>
							<Button
								className="data-btn"
								variant="contained"
								onClick={handleClickOpen(false, stock.id)}
							>
								Graph
							</Button>
						</div>
					</Accordion>
				))}
			</main>
			<DataDialog
				opened={dialogOpen}
				close={() => setOpen(false)}
				isTable={isTable}
				abbr={currentStock?.abbr}
				name={currentStock?.name}
			/>
		</div>
	);
};
