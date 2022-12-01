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

import { useDispatch } from 'react-redux';
import { set, remove, add } from '../store/StocksReducer';

import '../styles/List.sass';

let stocksList = [];

export const StocksList = () => {
	const [expanded, setExpanded] = useState(false);
	const [stocks, setStocks] = useState(stocksList);
	const [dialogOpen, setOpen] = useState(false);
	const [isTable, setTable] = useState(true);
	const [currentStock, setCurrentStock] = useState(null);

	const dispatch = useDispatch();

	useEffect(() => {
		if (stocksList.length > 0) return;
		stocksList = [];
		fetch('/api/stocks/', { method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				data.forEach((stock) => stocksList.push({ ...stock, visible: true }));
				setStocks(stocksList);
				dispatch(set(stocksList.filter((s) => s.checked).map((s) => ({ ...s }))));
			});
	}, [dispatch]);

	const handleClickOpen = (isTable, id) => (e) => {
		e.target.blur();
		setTable(isTable);
		setCurrentStock(stocks.find((s) => s.id === id));
		setOpen(true);
	};

	const handleAccordionChange = (panel) => (e, isExpanded) => {
		if (e.target.tagName !== 'INPUT') setExpanded(isExpanded ? panel : false);
	};

	const search = (e) => {
		setStocks(
			stocks.map((stock) => {
				stock.visible =
					stock.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
					stock.abbr.toLowerCase().includes(e.target.value.toLowerCase());
				return stock;
			})
		);
	};

	const saveStock = (id, index) => () => {
		const checked = document.getElementById(`checked-${index}`).checked;
		fetch(`/api/stocks/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ checked }),
		})
			.then((res) => res.json())
			.then((stock) => {
				stocksList[index].checked = stock.checked;
				setStocks([...stocks]);

				const action = stock.checked ? add : remove;
				dispatch(action({ ...stock }));
			});
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
								<FormControlLabel
									control={
										<Checkbox
											id={`checked-${index}`}
											checked={stock.checked}
											onChange={saveStock(stock.id, index)}
										/>
									}
								/>
								<span className="abbr">{stock.abbr}</span>
								{stock.name}
							</h4>
						</AccordionSummary>
						<AccordionDetails>
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
						</AccordionDetails>
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
