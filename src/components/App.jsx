import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Navbar } from 'react-bootstrap';

import BaremeSettings, { defaultBareme } from './BaremeSettings';
import SimpleLineChart from './SimpleLineChart';
import ChartSettings from './ChartSettings';
import RankingBarChart from './RankingBarChart';
import ResultsByTeamTable from './ResultsByTeamTable';

import buildAggregatedResultFromMatches from '../js/ranking';

import '../css/App.css';

import matches from '../data/matches.json';
import teams from '../data/teams.json';
import regions from '../data/regions.json';

const getPhase = (match) => (match.stage.type === 'Groupe' ? `Grp.${teams[match.teams.A].group}` : match.stage.type);

class App extends Component {
  state = {
    filterType: 'Phases',
    bareme: defaultBareme,
    rankings: buildAggregatedResultFromMatches(matches, defaultBareme),
  };

  dataPhases = matches;
  dataRegions = matches;
  rankingsPhases = this.state.rankings;
  rankingsRegions = this.state.rankings;

  setPhases = (newPhases) => {
    this.dataPhases = matches.filter((match) => newPhases.includes(getPhase(match)));
    this.rankingsPhases = buildAggregatedResultFromMatches(this.dataPhases, this.state.bareme);
    this.setState({ rankings: this.rankingsPhases });
  };

  setRegions = (newRegions) => {
    this.dataRegions = matches.filter(
      (match) => newRegions.includes(regions[teams[match.teams.A].region]) && newRegions.includes(regions[teams[match.teams.B].region]),
    );
    this.rankingsRegions = buildAggregatedResultFromMatches(this.dataRegions, this.state.bareme);
    this.setState({ rankings: this.rankingsRegions });
  };

  setFilterType = (newFilterType) => {
    this.setState({
      filterType: newFilterType,
      rankings: newFilterType === 'Phases' ? this.rankingsPhases : this.rankingsRegions,
    });
  };

  setBaremeValue = (a, b, isAdd) => {
    let newBareme = {};
    Object.assign(newBareme, this.state.bareme);
    newBareme[a][b] += isAdd ? 1 : -1;
    this.setState({
      bareme: newBareme,
      rankings: buildAggregatedResultFromMatches(this.state.filterType === 'Phases' ? this.dataPhases : this.dataRegions, newBareme),
    });
  };

  render() {
    const { filterType, bareme, rankings } = this.state;
    return (
      <div className="App">
        <Navbar inverse fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <span>Résultats des pronostics de la Coupe du Monde 2018</span>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <BaremeSettings bareme={bareme} setBaremeValue={this.setBaremeValue} />
        <RankingBarChart chartDataLast={rankings.dataForGraph[rankings.dataForGraph.length - 1]} />
        <ResultsByTeamTable resultsByTeam={rankings.resultsByTeam} />
        <ChartSettings filterType={filterType} setFilterType={this.setFilterType} setPhases={this.setPhases} setRegions={this.setRegions} />
        <SimpleLineChart chartData={rankings.dataForGraph} />
        <ReactTooltip />
      </div>
    );
  }
}

export default App;
