import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import BaremeSettings, { defaultBareme } from './BaremeSettings';
import SimpleLineChart from './SimpleLineChart';
import ChartSettings from './ChartSettings';
import RankingBarChart from './RankingBarChart';

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
    chartData: buildAggregatedResultFromMatches(matches, defaultBareme),
  };

  dataPhases = matches;
  dataRegions = matches;
  chartDataPhases = this.state.chartData;
  chartDataRegions = this.state.chartData;

  setPhases = (newPhases) => {
    this.dataPhases = matches.filter((match) => newPhases.includes(getPhase(match)));
    this.chartDataPhases = buildAggregatedResultFromMatches(this.dataPhases, this.state.bareme);
    this.setState({ chartData: this.chartDataPhases });
  };

  setRegions = (newRegions) => {
    this.dataRegions = matches.filter(
      (match) => newRegions.includes(regions[teams[match.teams.A].region]) && newRegions.includes(regions[teams[match.teams.B].region]),
    );
    this.chartDataRegions = buildAggregatedResultFromMatches(this.dataRegions, this.state.bareme);
    this.setState({ chartData: this.chartDataRegions });
  };

  setFilterType = (newFilterType) => {
    this.setState({
      filterType: newFilterType,
      chartData: newFilterType === 'Phases' ? this.chartDataPhases : this.chartDataRegions,
    });
  };

  setBaremeValue = (a, b, isAdd) => {
    let newBareme = {};
    Object.assign(newBareme, this.state.bareme);
    newBareme[a][b] += isAdd ? 1 : -1;
    this.setState({
      bareme: newBareme,
      chartData: buildAggregatedResultFromMatches(this.state.filterType === 'Phases' ? this.dataPhases : this.dataRegions, newBareme),
    });
  };

  render() {
    const { filterType, bareme, chartData } = this.state;
    return (
      <div className="App">
        <BaremeSettings bareme={bareme} setBaremeValue={this.setBaremeValue} />
        <RankingBarChart chartDataRaw={chartData} />
        <ChartSettings filterType={filterType} setFilterType={this.setFilterType} setPhases={this.setPhases} setRegions={this.setRegions} />
        <SimpleLineChart chartData={chartData} />
        <ReactTooltip />
      </div>
    );
  }
}

export default App;
