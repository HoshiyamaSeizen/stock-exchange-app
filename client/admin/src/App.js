import { RouterProvider } from 'react-router-dom';
import { Router } from './Router';
import { Theme } from './Theme';

import './styles/App.sass';

function App() {
	return (
		<Theme>
			<RouterProvider router={Router} />
		</Theme>
	);
}

export default App;
