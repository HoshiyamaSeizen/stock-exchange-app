import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from './components/MainPage';
import { NotFound } from './components/NotFound';

export const Router = createBrowserRouter([
	{
		path: '/',
		element: <MainPage />,
		errorElement: <NotFound />,
	},
]);
