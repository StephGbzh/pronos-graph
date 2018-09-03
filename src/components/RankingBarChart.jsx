import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

import players from '../data/players.json';

import '../css/RankingBarChart.css';

// j "#ff3419" n "#0000e5" s "#00ff00" v "#ff00ff"
const RankingBarChart = ({ chartDataRaw }) => {
  let finalResult = chartDataRaw[chartDataRaw.length - 1];
  let chartData = Object.values(players).reduce((data, p) => {
    data.push({ name: p.name, result: finalResult[p.name] });
    return data;
  }, []);
  //console.log(chartData);
  return (
    <div className="ranking-barchart">
      <BarChart width={600} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, (dataMax) => Math.floor(dataMax * 1.1)]} />
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
  chartDataRaw: PropTypes.array.isRequired,
};

export default RankingBarChart;
