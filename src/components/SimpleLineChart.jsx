import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import CustomToolTip from './CustomToolTip';

import players from '../data/players.json';

import '../css/SimpleLineChart.css';

const SimpleLineChart = ({ chartData }) => (
  <div className="simple-line-chart">
    <LineChart width={1000} height={500} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis type="number" domain={[0, 'dataMax']} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip content={<CustomToolTip />} />
      <Legend />
      {Object.values(players).map((p) => (
        <Line key={p.name} type="monotone" dataKey={p.name} stroke={p.color} />
      ))}
    </LineChart>
  </div>
);

SimpleLineChart.propTypes = {
  chartData: PropTypes.array.isRequired,
};

export default SimpleLineChart;
