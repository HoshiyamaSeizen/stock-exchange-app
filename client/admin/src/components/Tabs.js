import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs as TabsMUI } from '@mui/material';

export const Tabs = (props) => {
	return (
		<div className="window">
			<TabsMUI value={window.location.pathname} variant="fullWidth">
				<Tab label="Brokers" value="/brokers" component={Link} to="/brokers" />
				<Tab label="Stocks" value="/stocks" component={Link} to="/stocks" />
				<Tab label="Trade" value="/trade" component={Link} to="/trade" />
			</TabsMUI>
			{props.children}
		</div>
	);
};
