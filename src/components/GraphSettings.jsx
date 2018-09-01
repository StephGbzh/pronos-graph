import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import filters from '../data/filters.json';
import regions from '../data/regions.json';
import teams from '../data/teams.json';

const getDisplayName = (filter) => (filter.type === 'Groupe' ? `Grp.${filter.name}` : filter.type);

const getTeamsFromRegion = (reg) =>
  Object.entries(teams)
    .filter(([_, { region }]) => region === regions.indexOf(reg))
    .map(([k]) => k)
    .sort()
    .join('<br/>');

const getTeamsFromGroup = (grp) =>
  Object.entries(teams)
    .filter(([_, { group }]) => group === grp)
    .map(([k]) => k)
    .sort()
    .join('<br/>');

const getTeamsFromDirtyGroup = (dgrp) => (dgrp.startsWith('Grp') ? getTeamsFromGroup(dgrp.slice(-1)) : '');

class GraphSettings extends Component {
  state = {
    checkedPhases: filters.map((filter) => getDisplayName(filter)),
    checkedRegions: regions,
  };

  togglePhase = (newPhases) => {
    this.setState({ checkedPhases: newPhases });
    this.props.setPhases(newPhases);
  };

  toggleRegion = (newRegions) => {
    this.setState({ checkedRegions: newRegions });
    this.props.setRegions(newRegions);
  };

  changeFilterType = (newFilterType) => {
    this.props.setFilterType(newFilterType);
  };

  render() {
    const { filterType } = this.props;
    const { checkedPhases, checkedRegions } = this.state;
    return (
      <table style={{ width: 1000 }}>
        <tbody>
          <tr>
            <td>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="options" defaultValue={'Phases'} onChange={this.changeFilterType}>
                    {['Phases', 'Regions'].map((ft) => (
                      <ToggleButton key={ft} value={ft}>
                        {ft}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </ButtonToolbar>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ display: filterType === 'Phases' ? 'flex' : 'none', justifyContent: 'center' }}>
                <ToggleButtonGroup type="checkbox" value={checkedPhases} onChange={this.togglePhase}>
                  {filters.map((filter) => {
                    let displayName = getDisplayName(filter);
                    return (
                      <ToggleButton key={displayName} value={displayName} data-tip={getTeamsFromDirtyGroup(displayName)} data-multiline="true">
                        {displayName}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              </div>
              <div style={{ display: filterType === 'Regions' ? 'flex' : 'none', justifyContent: 'center' }}>
                <ToggleButtonGroup type="checkbox" value={checkedRegions} onChange={this.toggleRegion}>
                  {regions.map((region) => (
                    <ToggleButton key={region} value={region} data-tip={getTeamsFromRegion(region)} data-multiline="true">
                      {region}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

GraphSettings.propTypes = {
  filterType: PropTypes.string.isRequired,
  setFilterType: PropTypes.func.isRequired,
  setPhases: PropTypes.func.isRequired,
  setRegions: PropTypes.func.isRequired,
};

export default GraphSettings;
