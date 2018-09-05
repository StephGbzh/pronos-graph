import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

import players from '../data/players.json';

import '../css/RankingBarChart.css';

// j "#ff3419" n "#0000e5" s "#00ff00" v "#ff00ff"
const RankingBarChart = ({ chartDataLast }) => {
  let chartData = Object.values(players).reduce((data, p) => {
    data.push({ name: p.name, result: chartDataLast[p.name] });
    return data;
  }, []);
  //console.log(chartData);
  return (
    <div className="ranking-barchart">
      <BarChart width={600} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis domain={[0, (dataMax) => Math.floor(dataMax * 1.1)]} hide={true} />
        <Tooltip />
        <Bar dataKey="result" label={{ position: 'top' }}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={players[index + 1].color} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

RankingBarChart.propTypes = {
  chartDataLast: PropTypes.object.isRequired,
};

export default RankingBarChart;
