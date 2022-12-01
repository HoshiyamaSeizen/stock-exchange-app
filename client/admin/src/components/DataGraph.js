import React, { useEffect, useState } from 'react';
import { CategoryScale, LinearScale, PointElement, LineElement, Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';

export const DataGraph = (props) => {
	const [chartData, setData] = useState({ labels: [], datasets: [{ data: [] }] });

	Chart.register(CategoryScale);
	Chart.register(LinearScale);
	Chart.register(PointElement);
	Chart.register(LineElement);

	useEffect(() => {
		if (props.data.length === 0) return;
		setData({
			labels: props.data.Date,
			datasets: [
				{
					data: props.data.Open,
					borderColor: 'darkgreen',
					borderWidth: 2,
				},
			],
		});
	}, [props]);

	return (
		<Line
			data={chartData}
			options={{
				elements: {
					point: {
						radius: 0,
					},
				},
			}}
		/>
	);
};
