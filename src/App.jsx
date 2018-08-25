import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import './App.css';
import matches from './data/matches.json';
import teams from './data/teams.json';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';

const players = {
  '1': { name: 'Jacques', color: '#ff3419' },
  '2': { name: 'Nicolas', color: '#0000e5' },
  '3': { name: 'Stéphane', color: '#00ff00' },
  '4': { name: 'Valérie', color: '#ff00ff' }
};

const regions = ['Europe', 'Amérique du Nord & Centrale', 'Amérique du Sud', 'Afrique', 'Asie & Océanie'];

const bareme = {
  'Groupe': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
  '1/8': { 'BVBS': 6, 'BVBD': 4, 'BV': 2, 'MV': 0 },
  '1/4': { 'BVBS': 8, 'BVBD': 5, 'BV': 3, 'MV': 0 },
  '1/2': { 'BVBS': 10, 'BVBD': 6, 'BV': 4, 'MV': 0 },
  'Petite Finale': { 'BVBS': 12, 'BVBD': 7, 'BV': 5, 'MV': 0 },
  'Finale': { 'BVBS': 14, 'BVBD': 8, 'BV': 6, 'MV': 0 },
};

const bareme2 = {
  'Groupe': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
  '1/8': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
  '1/4': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
  '1/2': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
  'Petite Finale': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
  'Finale': { 'BVBS': 3, 'BVBD': 2, 'BV': 1, 'MV': 0 },
};

const outcome = (prono, result) => {
  // pas de prono
  if (prono.A < 0 || prono.B < 0) {
    return 'MV';
  }
  let pronoDiff = prono.A - prono.B;
  let resultDiff = result.A - result.B;
  let pronoWinner = prono.winner || (pronoDiff > 0 ? 'A' : pronoDiff < 0 ? 'B' : '');
  let resultWinner = result.winner || (resultDiff > 0 ? 'A' : resultDiff < 0 ? 'B' : '');
  // mauvais vainqueur
  if (pronoWinner !== resultWinner) {
    return 'MV';
  }
  // bon vainqueur et bon score
  if (prono.A === result.A && prono.B === result.B) {
    return 'BVBS';
  }
  // bon vainqueur et bonne différence de but mais pas bon score
  if (pronoDiff === resultDiff) {
    return 'BVBD';
  }
  // bon vainqueur mais mauvais score et mauvaise diff
  return 'BV';
};

const buildPronosResultsFromMatch = (match) => {
  return Object.entries(match.players).reduce((pronosResults, [playerId, prono]) => {
    pronosResults[players[playerId].name] = bareme[match.stage.type][outcome(prono, match.result)];
    return pronosResults;
  }, {});
};

const underline = (matchResult) => {
  if (matchResult.winner) {
    if (matchResult.winner === 'A') {
      return <div style={{ display: 'flex' }}><div className='underline'>{matchResult.A}</div><div>-{matchResult.B}</div></div>;
    }
    return <div style={{ display: 'flex' }}><div>{matchResult.A}-</div><div className='underline'>{matchResult.B}</div></div>;
  } else {
    return <div style={{ display: 'flex' }}>{`${matchResult.A}-${matchResult.B}`}</div>;
  }
};

const buildPronosResultsFromMatches = (matches) => {
  return matches.reduce((pronosResults, match) => {
    pronosResults[match.id] = {
      shortName: `${match.teams.A}-${match.teams.B}`,
      fullName:
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ marginRight: 5 }}>{match.teams.A}</div>
          {underline(match.result)}
          <div style={{ marginLeft: 5 }}>{match.teams.B}</div>
        </div>,
      rawPronos: Object.entries(match.players).reduce((ps, [playerId, prono]) => {
        ps[players[playerId].name] = underline(prono);
        return ps;
      }, {}),
      pronosResults: buildPronosResultsFromMatch(match)
    };
    return pronosResults;
  }, {});
};

const buildAggregatedResultFromMatches = (matches) => {
  let results = buildPronosResultsFromMatches(matches);
  // temp variable to store the result after previous match so that we can compute the new total
  let previousTotals = Object.values(players).reduce((ps, { name }) => { ps[name] = 0; return ps; }, {});
  let dataForGraph = Object.entries(results).reduce((matchesForGraph, [_, match], i) => {
    let matchForGraph = Object.values(players).reduce((totals, { name }) => {
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
    }, { name: match.shortName });
    matchesForGraph.push(matchForGraph);
    return matchesForGraph;
  },
  // {name:'FRA-CRO',Jacques:0,Nicolas:0}
  [Object.values(players).reduce((ps, { name }) => { ps[name] = 0; return ps; }, { name: 'DEBUT' })]);
  //console.log(dataForGraph)
  return dataForGraph;
};

// Input: [ [1, 2, 3], [101, 2, 1, 10], [2, 1] ]
// Output: [1, 2, 3, 101, 10]
const mergeDedupe = (arr) => [...new Set([].concat(...arr))];

// return the array without the specified element
const removeElement = (element, array) => {
  array.splice(array.indexOf(element), 1);
  return array;
};

const removeElements = (elements, array) => {
  let result = elements.reduce((newarray, e) =>
    newarray = removeElement(e, newarray), array);
  return result;
};

// in  Object { Jacques: 39, Nicolas: 38, 'Stéphane': 39, 'Valérie': 31 }
// out Object { Jacques: 1, 'Stéphane': 1, Nicolas: 3, 'Valérie': 4 }
const computeRankings = (totals) => {
  let currentPlace = 0;
  let skippedPlaces = 0;
  let scoreOfThePreviousPlayer = Number.MAX_SAFE_INTEGER;
  return Object.entries(totals).sort(([_a, avalue], [_b, bvalue]) => avalue < bvalue).reduce((ps, [key, value]) => {
    if (value !== scoreOfThePreviousPlayer) {
      currentPlace += 1 + skippedPlaces;
      skippedPlaces = 0;
    } else {
      skippedPlaces += 1;
    }
    scoreOfThePreviousPlayer = value;
    ps[key] = currentPlace;
    return ps;
  }, {});
};

const CustomToolTip = (props) => {
  const { active } = props;

  if (active) {
    const { payload } = props;
    //console.log(payload)
    let currentPlace = 0;
    let skippedPlaces = 0;
    let scoreOfThePreviousPlayer = Number.MAX_SAFE_INTEGER;
    let previousRankings;
    if (payload[0].payload.additionalData) {
      previousRankings = computeRankings(payload[0].payload.additionalData.previousTotals);
    }

    return (
      payload[0].payload.additionalData ?
        <div style={{ backgroundColor: 'white', border: '1px solid rgb(204,204,204)' }}>
          <div style={{ marginTop: 10, marginBottom: 10 }}>{payload[0].payload.additionalData.fullName}</div>
          <table>
            <tbody>
              {payload.sort((a, b) => a.value < b.value)
                .map((pl) => {
                  if (pl.value !== scoreOfThePreviousPlayer) {
                    currentPlace += 1 + skippedPlaces;
                    skippedPlaces = 0;
                  } else {
                    skippedPlaces += 1;
                  }
                  scoreOfThePreviousPlayer = pl.value;

                  let previousRank = previousRankings[pl.name];
                  let rankEvolution;
                  if (previousRank === currentPlace) {
                    rankEvolution = '=';
                  } else if (previousRank > currentPlace) {
                    rankEvolution = `+${previousRank - currentPlace}`;
                  } else {
                    rankEvolution = `-${currentPlace - previousRank}`;
                  }

                  return (
                    <tr className='tooltip-row' style={{ color: pl.color }} key={pl.name}>
                      <td>{currentPlace}</td>
                      <td style={{textAlign:'center'}}>({rankEvolution})</td>
                      <td>{pl.name}</td>
                      <td style={{textAlign:'right'}}>{pl.value} pts</td>
                      <td>(+{pl.payload.additionalData.pronosResults[pl.name]})</td>
                      <td>{pl.payload.additionalData.rawPronos[pl.name]}</td>
                    </tr>);
                })
              }
            </tbody>
          </table>
        </div> : null
    );
  }

  return null;
};

CustomToolTip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.array.isRequired,
};

const SimpleLineChart = ({ data }) => (
  <LineChart width={1000} height={500} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <XAxis dataKey='name' />
    <YAxis />
    <CartesianGrid strokeDasharray='3 3' />
    <Tooltip content={<CustomToolTip />} />
    <Legend />
    {Object.values(players).map(p => <Line key={p.name} type='monotone' dataKey={p.name} stroke={p.color} />)}
  </LineChart>
);

SimpleLineChart.propTypes = {
  data: PropTypes.object.isRequired,
};

const getTeamsFromRegion = (reg) =>
  Object.entries(teams).filter(([_, { region }]) => region === regions.indexOf(reg)).map(([k]) => k).sort().join('<br/>');

const getTeamsFromGroup = (grp) =>
  Object.entries(teams).filter(([_, { group }]) => group === grp).map(([k]) => k).sort().join('<br/>');

const getTeamsFromDirtyGroup = (dgrp) => (dgrp.startsWith('Grp') ? getTeamsFromGroup(dgrp.slice(-1)) : '');

const filters = [
  { type: 'Groupe', name: 'A' },
  { type: 'Groupe', name: 'B' },
  { type: 'Groupe', name: 'C' },
  { type: 'Groupe', name: 'D' },
  { type: 'Groupe', name: 'E' },
  { type: 'Groupe', name: 'F' },
  { type: 'Groupe', name: 'G' },
  { type: 'Groupe', name: 'H' },
  { type: '1/8' },
  { type: '1/4' },
  { type: '1/2' },
  { type: 'Petite Finale' },
  { type: 'Finale' }
];

const getDisplayName = (filter) => filter.type === 'Groupe' ? `Grp.${filter.name}` : filter.type;

const getPhase = (match) => match.stage.type === 'Groupe' ? `Grp.${teams[match.teams.A].group}` : match.stage.type;

class App extends Component {
  state = {
    filterType: 'Phases',
    dataPhases: matches,
    dataRegions: matches,
    checkedPhases: filters.map((filter) => getDisplayName(filter)),
    checkedRegions: regions
  }

  togglePhase = (event) => {
    let newData = matches.filter(match => event.includes(getPhase(match)));
    this.setState({ checkedPhases: event, dataPhases: newData });
  }

  toggleRegion = (event) => {
    let newData = matches.filter(match =>
      event.includes(regions[teams[match.teams.A].region]) &&
      event.includes(regions[teams[match.teams.B].region]));
    this.setState({ checkedRegions: event, dataRegions: newData });
  }

  changeFilterType = (event) => {
    this.setState({ filterType: event });
  }

  render() {
    const { filterType, dataPhases, dataRegions, checkedPhases, checkedRegions } = this.state;
    return (
      <div className='App'>
        <table style={{ width: 1000 }}>
          <tbody>
            <tr>
              <td>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ButtonToolbar>
                    <ToggleButtonGroup type='radio' name='options' defaultValue={'Phases'} onChange={this.changeFilterType}>
                      {['Phases', 'Regions'].map(ft => <ToggleButton key={ft} value={ft}>{ft}</ToggleButton>)}
                    </ToggleButtonGroup>
                  </ButtonToolbar>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: (filterType === 'Phases' ? 'flex' : 'none'), justifyContent: 'center' }}>
                  <ToggleButtonGroup type='checkbox' value={checkedPhases} onChange={this.togglePhase}>
                    {filters.map((filter) => {
                      let displayName = getDisplayName(filter);
                      return (<ToggleButton key={displayName} value={displayName}
                        data-tip={getTeamsFromDirtyGroup(displayName)} data-multiline='true'>{displayName}</ToggleButton>);
                    })}
                  </ToggleButtonGroup>
                </div>
                <div style={{ display: (filterType === 'Regions' ? 'flex' : 'none'), justifyContent: 'center' }}>
                  <ToggleButtonGroup type='checkbox' value={checkedRegions} onChange={this.toggleRegion}>
                    {regions.map((region) => <ToggleButton key={region} value={region}
                      data-tip={getTeamsFromRegion(region)} data-multiline='true'>{region}</ToggleButton>)}
                  </ToggleButtonGroup>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ReactTooltip />
        <SimpleLineChart data={buildAggregatedResultFromMatches(filterType === 'Phases' ? dataPhases : dataRegions)} />
      </div>
    );
  }
}

export default App;
