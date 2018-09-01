import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import BaremeSettings from './BaremeSettings';
import SimpleLineChart from './SimpleLineChart';
import GraphSettings from './GraphSettings';

import '../css/App.css';

import matches from '../data/matches.json';
import teams from '../data/teams.json';
import regions from '../data/regions.json';

const getPhase = (match) => (match.stage.type === 'Groupe' ? `Grp.${teams[match.teams.A].group}` : match.stage.type);

class App extends Component {
  state = {
    filterType: 'Phases',
    dataPhases: matches,
    dataRegions: matches,
    bareme: {
      vainqueur: { exact: 1, faux: 0 },
      score: { exact: 1, ecart1: 0, ecart2: 0, faux: 0 },
      diff: { exact: 1, ecart1: 0, faux: 0 },
    },
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

  setBaremeValue = (a, b, isAdd) => {
    let newBareme = {};
    Object.assign(newBareme, this.state.bareme);
    newBareme[a][b] += isAdd ? 1 : -1;
    this.setState({ bareme: newBareme });
  };

  render() {
    const { filterType, dataPhases, dataRegions, bareme } = this.state;
    return (
      <div className="App">
        <BaremeSettings bareme={bareme} setBaremeValue={this.setBaremeValue} />
        <GraphSettings filterType={filterType} setFilterType={this.setFilterType} setPhases={this.setPhases} setRegions={this.setRegions} />
        <SimpleLineChart filterType={filterType} dataPhases={dataPhases} dataRegions={dataRegions} bareme={bareme} />
        <ReactTooltip />
      </div>
    );
  }
}

export default App;
