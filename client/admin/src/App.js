import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Router } from './Router';
import { StocksStore } from './store/Store';
import { Theme } from './Theme';

import './styles/App.sass';

function App() {
	return (
		<Provider store={StocksStore}>
			<Theme>
				<RouterProvider router={Router} />
			</Theme>
		</Provider>
	);
}

export default App;
