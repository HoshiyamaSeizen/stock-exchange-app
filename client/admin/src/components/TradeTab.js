import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
	Button,
	TextField,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataDialog } from './DataDialog';

import '../styles/TradeTab.sass';

export const TradeTab = () => {
	const [date, setDate] = useState(dayjs('2020-01-01T0:0:0'));
	const [speed, setSpeed] = useState(1);
	const [started, setStarted] = useState(false);
	const [stocks, setStocks] = useState([]);
	const [dialogOpen, setOpen] = useState(false);
	const [currentStock, setCurrentStock] = useState(null);

	useEffect(() => {
		const _stocks = [
			{ id: 0, abbr: 'AAPL', name: 'Apple, Inc.', visible: true, checked: false },
			{ id: 1, abbr: 'SBUX', name: 'Starbucks, Inc.', visible: true, checked: true },
			{ id: 2, abbr: 'MSFT', name: 'Microsoft, Inc.', visible: true, checked: true },
			{ id: 3, abbr: 'CSCO', name: 'Cisco Systems, Inc.', visible: true, checked: true },
			{ id: 4, abbr: 'AAPL', name: 'Apple, Inc.', visible: true, checked: false },
			{ id: 5, abbr: 'SBUX', name: 'Starbucks, Inc.', visible: true, checked: true },
			{ id: 6, abbr: 'MSFT', name: 'Microsoft, Inc.', visible: true, checked: true },
			{ id: 7, abbr: 'CSCO', name: 'Cisco Systems, Inc.', visible: true, checked: true },
			{ id: 8, abbr: 'AAPL', name: 'Apple, Inc.', visible: true, checked: false },
			{ id: 9, abbr: 'SBUX', name: 'Starbucks, Inc.', visible: true, checked: true },
			{ id: 10, abbr: 'MSFT', name: 'Microsoft, Inc.', visible: true, checked: true },
			{ id: 11, abbr: 'CSCO', name: 'Cisco Systems, Inc.', visible: true, checked: true },
		];
		_stocks.reverse();
		setStocks(_stocks);
	}, []);

	const handleClickOpen = (id) => (e) => {
		setOpen(true);
		setCurrentStock(stocks.find((s) => s.id === id));
	};

	const toggle = () => {
		if (!started) {
			console.log(`${date.$m}/${date.$D}/${date.$y}`, speed);
			setStarted(true);
		} else {
			setStarted(false);
		}
	};

	return (
		<div className="trade-tab">
			<div className="settings">
				<h2>Stocks</h2>
				<FormControl fullWidth sx={{ marginY: 1 }}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DesktopDatePicker
							label="Start date"
							inputFormat="MM/DD/YYYY"
							value={date}
							onChange={(value) => setDate(value)}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</FormControl>
				<FormControl fullWidth sx={{ marginY: 1 }}>
					<InputLabel htmlFor="speed">Pace</InputLabel>
					<OutlinedInput
						id="speed"
						startAdornment={<InputAdornment position="start">sec/day</InputAdornment>}
						label="Pace"
						type="number"
						defaultValue={speed}
						onChange={(e) => setSpeed(+e.target.value)}
					/>
				</FormControl>
				<Button color={(started && 'danger') || 'primary'} onClick={toggle} variant="contained">
					{!started && 'Start trading'}
					{started && 'Stop trading'}
				</Button>
			</div>
			<div className="status">
				<h2>Status</h2>
				{started && (
					<div className="board">
						{stocks
							.filter((stock) => stock.checked)
							.map((stock) => (
								<div
									key={stock.id}
									className="container"
									onClick={handleClickOpen(stock.id)}
								>
									<h4>
										<span className="abbr">{stock.abbr}</span>
										{stock.name}
									</h4>
								</div>
							))}
					</div>
				)}
				{!started && <p>OFFLINE</p>}
			</div>
			<DataDialog
				opened={dialogOpen}
				close={() => setOpen(false)}
				isTable={false}
				abbr={currentStock?.abbr}
				name={currentStock?.name}
			/>
		</div>
	);
};
