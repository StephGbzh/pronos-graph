import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import CustomToolTip from './CustomToolTip';

import players from '../data/players.json';

const buildAggregatedResultFromMatches = (matches, bareme) => {
  let results = buildPronosResultsFromMatches(matches, bareme);
  // temp variable to store the result after previous match so that we can compute the new total
  let previousTotals = Object.values(players).reduce((ps, { name }) => {
    ps[name] = 0;
    return ps;
  }, {});
  let dataForGraph = Object.entries(results).reduce(
    (matchesForGraph, [_, match], i) => {
      let matchForGraph = Object.values(players).reduce(
        (totals, { name }) => {
          totals[name] = match.pronosResults[name] + (i > 0 ? previousTotals[name] : 0);
          // store the pronos results on totals so that the tooltip can use it
          totals.additionalData = match;
          if (!totals.additionalData.previousTotals) {
            totals.additionalData.previousTotals = {};
            Object.assign(totals.additionalData.previousTotals, previousTotals);
          }
          // update previousTotals
          previousTotals[name] = totals[name];
          return totals;
        },
        { name: match.shortName },
      );
      matchesForGraph.push(matchForGraph);
      return matchesForGraph;
    },
    // {name:'FRA-CRO',Jacques:0,Nicolas:0}
    [
      Object.values(players).reduce(
        (ps, { name }) => {
          ps[name] = 0;
          return ps;
        },
        { name: 'DEBUT' },
      ),
    ],
  );
  //console.log(dataForGraph)
  return dataForGraph;
};

const buildPronosResultsFromMatches = (matches, bareme) => {
  return matches.reduce((pronosResults, match) => {
    pronosResults[match.id] = {
      shortName: `${match.teams.A}-${match.teams.B}`,
      fullName: (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ marginRight: 5 }}>{match.teams.A}</div>
          {underline(match.result)}
          <div style={{ marginLeft: 5 }}>{match.teams.B}</div>
        </div>
      ),
      rawPronos: Object.entries(match.players).reduce((ps, [playerId, prono]) => {
        ps[players[playerId].name] = underline(prono);
        return ps;
      }, {}),
      pronosResults: buildPronosResultsFromMatch(match, bareme),
    };
    return pronosResults;
  }, {});
};

const buildPronosResultsFromMatch = (match, bareme) => {
  return Object.entries(match.players).reduce((pronosResults, [playerId, prono]) => {
    pronosResults[players[playerId].name] = outcome(prono, match.result, bareme);
    return pronosResults;
  }, {});
};

// calcule le nb de points gagnés sur un prono
const outcome = (prono, matchResult, bareme) => {
  let resultProno = 0;
  // pas de prono
  if (prono.A < 0 || prono.B < 0) {
    return Math.min(...Object.values(bareme.vainqueur)) + Math.min(...Object.values(bareme.score)) + Math.min(...Object.values(bareme.diff));
  }
  let pronoDiff = prono.A - prono.B;
  let resultDiff = matchResult.A - matchResult.B;
  let pronoWinner = prono.winner || (pronoDiff > 0 ? 'A' : pronoDiff < 0 ? 'B' : '');
  let resultWinner = matchResult.winner || (resultDiff > 0 ? 'A' : resultDiff < 0 ? 'B' : '');

  if (pronoWinner === resultWinner) {
    resultProno += bareme.vainqueur.exact;
  } else {
    resultProno += bareme.vainqueur.faux;
  }

  if (pronoDiff === resultDiff) {
    resultProno += bareme.diff.exact;
  } else if (Math.abs(pronoDiff - resultDiff) === 1) {
    resultProno += bareme.diff.ecart1;
  } else if (Math.abs(pronoDiff - resultDiff) > 2) {
    resultProno += bareme.diff.faux;
  }

  if (prono.A === matchResult.A) {
    resultProno += bareme.score.exact;
  } else if (Math.abs(prono.A - matchResult.A) === 1) {
    resultProno += bareme.score.ecart1;
  } else if (Math.abs(prono.A - matchResult.A) === 2) {
    resultProno += bareme.score.ecart2;
  } else if (Math.abs(prono.A - matchResult.A) > 2) {
    resultProno += bareme.score.faux;
  }

  if (prono.B === matchResult.B) {
    resultProno += bareme.score.exact;
  } else if (Math.abs(prono.B - matchResult.B) === 1) {
    resultProno += bareme.score.ecart1;
  } else if (Math.abs(prono.B - matchResult.B) === 2) {
    resultProno += bareme.score.ecart2;
  } else if (Math.abs(prono.B - matchResult.B) > 2) {
    resultProno += bareme.score.faux;
  }

  return resultProno;
};

const underline = (matchResult) => {
  if (matchResult.winner) {
    if (matchResult.winner === 'A') {
      return (
        <div style={{ display: 'flex' }}>
          <div className="underline">{matchResult.A}</div>
          <div>-{matchResult.B}</div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex' }}>
        <div>{matchResult.A}-</div>
        <div className="underline">{matchResult.B}</div>
      </div>
    );
  } else {
    return <div style={{ display: 'flex' }}>{`${matchResult.A}-${matchResult.B}`}</div>;
  }
};

const SimpleLineChart = ({ filterType, dataPhases, dataRegions, bareme }) => (
  <LineChart
    width={1000}
    height={500}
    data={buildAggregatedResultFromMatches(filterType === 'Phases' ? dataPhases : dataRegions, bareme)}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <XAxis dataKey="name" />
    <YAxis type="number" domain={[0, 'dataMax']} />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip content={<CustomToolTip />} />
    <Legend />
    {Object.values(players).map((p) => (
      <Line key={p.name} type="monotone" dataKey={p.name} stroke={p.color} />
    ))}
  </LineChart>
);

SimpleLineChart.propTypes = {
  filterType: PropTypes.string.isRequired,
  dataPhases: PropTypes.array.isRequired,
  dataRegions: PropTypes.array.isRequired,
  bareme: PropTypes.object.isRequired,
};

export default SimpleLineChart;
