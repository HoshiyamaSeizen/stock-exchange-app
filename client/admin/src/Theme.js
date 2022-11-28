import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#600080',
		},
		secondary: {
			main: '#AC00E5',
		},
		danger: {
			main: '#8B0000',
		},
	},
});

export const Theme = (props) => {
	return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
