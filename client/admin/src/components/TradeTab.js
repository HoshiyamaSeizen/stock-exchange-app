import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
	Button,
	TextField,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	Snackbar,
	Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useSelector } from 'react-redux';

import '../styles/TradeTab.sass';
import { socketConnect } from '../socket';

let activeStocks;
let socket;

export const TradeTab = () => {
	const [date, setDate] = useState(dayjs('2017-11-29T0:0:0'));
	const [speed, setSpeed] = useState(1);
	const [started, setStarted] = useState(false);
	const [stocks, setStocks] = useState([]);
	const [snackbarOpen, setSnackbar] = useState(false);
	const [snackbarText, setSnackbarText] = useState('');
	const [currentDate, setCurrentDate] = useState('');
	const [prices, setPrices] = useState([]);

	activeStocks = useSelector((state) => state.reducer.stocks);

	useEffect(() => {
		if (activeStocks.length > 0) return setStocks(activeStocks);
		activeStocks = [];
		fetch('/api/stocks/', { method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				activeStocks = data.filter((s) => s.checked);
				setStocks(activeStocks);
			});
	}, []);

	useEffect(() => {
		fetch('/api/trade/', { method: 'GET' })
			.then((res) => res.json())
			.then(({ running }) => {
				socket = socketConnect();
				socket.on('status', ({ started }) => {
					setSnackbarText(
						started ? 'Trade started' : "Stock exchange wasn't active on this day"
					);
					setSnackbar(true);
					setStarted(started);
				});
				socket.on('stopped', () => console.log('stopped'));
				socket.on('data', (data) => {
					setCurrentDate(data.date);
					setPrices(data.stocks);
				});
				if (running) setStarted(true);
			});
	}, []);

	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') return;
		setSnackbar(false);
	};

	const toggle = () => {
		if (!started) {
			socket.emit('start', {
				date: date.format('MM/DD/YYYY'),
				pace: speed,
				stocks: stocks.map((s) => s.abbr),
			});
			setStarted(true);
		} else {
			socket.emit('stop');
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
				<Button
					className="start-btn"
					color={(started && 'danger') || 'primary'}
					onClick={toggle}
					variant="contained"
				>
					{!started && 'Start trading'}
					{started && 'Stop trading'}
				</Button>
			</div>
			<div className="status">
				<h2>Status</h2>
				{started && <p className="date">Date: {currentDate}</p>}
				{started && (
					<div className="board">
						{stocks
							.filter((stock) => stock.checked)
							.map((stock) => (
								<div key={stock.id} className="container">
									<h4>
										<span className="abbr">{stock.abbr}</span>
										{stock.name}
										<p className="price">
											{(() => {
												const price = prices.find((s) => s.abbr === stock.abbr)?.price;
												return price ? price + '$' : 'Not in trade';
											})()}
										</p>
									</h4>
								</div>
							))}
					</div>
				)}
				{!started && <p>OFFLINE</p>}
			</div>
			<Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
				<Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
					{snackbarText}
				</Alert>
			</Snackbar>
		</div>
	);
};
