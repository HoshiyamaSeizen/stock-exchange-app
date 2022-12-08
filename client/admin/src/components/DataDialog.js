import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { DataTable } from './DataTable';
import { DataGraph } from './DataGraph';

export const DataDialog = (props) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		if (!props.opened) return;
		fetch(`/api/trade/history/${props.abbr}`, { method: 'GET' })
			.then((res) => res.json())
			.then(({ data }) => setData(data));
	}, [props.abbr, props.opened]);

	const handleClose = () => props.close();

	return (
		<Dialog className="data-dialog" onClose={handleClose} open={props.opened}>
			<DialogTitle>{props.isTable ? 'Data Table' : 'Data Graph'}</DialogTitle>
			<h4>
				<span className="abbr">{props.abbr}</span>
				{props.name}
			</h4>
			{props.isTable && <DataTable data={data} />}
			{!props.isTable && <DataGraph data={data} />}
		</Dialog>
	);
};
