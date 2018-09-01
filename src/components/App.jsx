import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import BaremeSettings from './BaremeSettings';
import SimpleLineChart from './SimpleLineChart';
import GraphSettings from './GraphSettings';

import '../css/App.css';

import matches from '../data/matches.json';
import teams from '../data/teams.json';
import players from '../data/players.json';
import regions from '../data/regions.json';

const bareme = {
  BonVainqueur: 2,
  BonneDiff: 0,
  BonScore: 2,
  QuasiBonneDiff: 0,
  QuasiBonScore: 1,
  MauvaiseDiff: 0,
  MauvaisScore: -1,
  PasDeProno: -3,
};

const buildAggregatedResultFromMatches = (matches) => {
  let results = buildPronosResultsFromMatches(matches);
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

const buildPronosResultsFromMatches = (matches) => {
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
      pronosResults: buildPronosResultsFromMatch(match),
    };
    return pronosResults;
  }, {});
};

const buildPronosResultsFromMatch = (match) => {
  return Object.entries(match.players).reduce((pronosResults, [playerId, prono]) => {
    //pronosResults[players[playerId].name] = bareme[match.stage.type][outcome(prono, match.result)];
    pronosResults[players[playerId].name] = outcome(prono, match.result).reduce((points, oc) => {
      return points + bareme[oc];
    }, 0);
    return pronosResults;
  }, {});
};

const outcome = (prono, result) => {
  // pas de prono
  if (prono.A < 0 || prono.B < 0) {
    return ['PasDeProno'];
  }
  let pronoDiff = prono.A - prono.B;
  let resultDiff = result.A - result.B;
  let pronoWinner = prono.winner || (pronoDiff > 0 ? 'A' : pronoDiff < 0 ? 'B' : '');
  let resultWinner = result.winner || (resultDiff > 0 ? 'A' : resultDiff < 0 ? 'B' : '');

  let resultProno = [];
  if (pronoWinner === resultWinner) {
    resultProno.push('BonVainqueur');
  }

  if (pronoDiff === resultDiff) {
    resultProno.push('BonneDiff');
  } else if (Math.abs(pronoDiff - resultDiff) === 1) {
    resultProno.push('QuasiBonneDiff');
  } else if (Math.abs(pronoDiff - resultDiff) > 2) {
    resultProno.push('MauvaiseDiff');
  }

  if (prono.A === result.A) {
    resultProno.push('BonScore');
  } else if (Math.abs(prono.A - result.A) === 1) {
    resultProno.push('QuasiBonScore');
  } else if (Math.abs(prono.A - result.A) > 2) {
    resultProno.push('MauvaisScore');
  }

  if (prono.B === result.B) {
    resultProno.push('BonScore');
  } else if (Math.abs(prono.B - result.B) === 1) {
    resultProno.push('QuasiBonScore');
  } else if (Math.abs(prono.B - result.B) > 2) {
    resultProno.push('MauvaisScore');
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

const getPhase = (match) => (match.stage.type === 'Groupe' ? `Grp.${teams[match.teams.A].group}` : match.stage.type);

class App extends Component {
  state = {
    filterType: 'Phases',
    dataPhases: matches,
    dataRegions: matches,
  };

  setPhases = (newPhases) => {
    let newData = matches.filter((match) => newPhases.includes(getPhase(match)));
    this.setState({ dataPhases: newData });
  };

  setRegions = (newRegions) => {
    let newData = matches.filter(
      (match) => newRegions.includes(regions[teams[match.teams.A].region]) && newRegions.includes(regions[teams[match.teams.B].region]),
    );
    this.setState({ dataRegions: newData });
  };

  setFilterType = (newFilterType) => {
    this.setState({ filterType: newFilterType });
  };

  render() {
    const { filterType, dataPhases, dataRegions } = this.state;
    return (
      <div className="App">
        <BaremeSettings />
        <GraphSettings setFilterType={this.setFilterType} setPhases={this.setPhases} setRegions={this.setRegions} />
        <ReactTooltip />
        <SimpleLineChart data={buildAggregatedResultFromMatches(filterType === 'Phases' ? dataPhases : dataRegions)} />
      </div>
    );
  }
}

export default App;
