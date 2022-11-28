import { createBrowserRouter, redirect } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { BrokersList } from './components/BrokersList';
import { StocksList } from './components/StocksList';
import { TradeTab } from './components/TradeTab';
import { Tabs } from './components/Tabs';

export const Router = createBrowserRouter([
	{
		path: '/brokers',
		element: (
			<Tabs>
				<BrokersList />
			</Tabs>
		),
	},
	{
		path: '/stocks',
		element: (
			<Tabs>
				<StocksList />
			</Tabs>
		),
	},
	{
		path: '/trade',
		element: (
			<Tabs>
				<TradeTab />
			</Tabs>
		),
	},
	{
		path: '/',
		element: <></>,
		loader: () => redirect('/trade'),
		errorElement: <NotFound />,
	},
]);
