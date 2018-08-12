import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import './App.css';
import matches from './data/matches.json'
import teams from './data/teams.json'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const players = {
  "1": { name: "Jacques", color: "#ff3419" },
  "2": { name: "Nicolas", color: "#0000e5" },
  "3": { name: "Stéphane", color: "#00ff00" },
  "4": { name: "Valérie", color: "#ff00ff" }
}

const regions = ["Europe", "Amérique du Nord & Centrale", "Amérique du Sud", "Afrique", "Asie & Océanie"]

const bareme = {
  "Groupe": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
  "1/8": { "BVBS": 6, "BVBD": 4, "BV": 2, "MV": 0 },
  "1/4": { "BVBS": 8, "BVBD": 5, "BV": 3, "MV": 0 },
  "1/2": { "BVBS": 10, "BVBD": 6, "BV": 4, "MV": 0 },
  "Petite Finale": { "BVBS": 12, "BVBD": 7, "BV": 5, "MV": 0 },
  "Finale": { "BVBS": 14, "BVBD": 8, "BV": 6, "MV": 0 },
}

const bareme2 = {
  "Groupe": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
  "1/8": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
  "1/4": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
  "1/2": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
  "Petite Finale": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
  "Finale": { "BVBS": 3, "BVBD": 2, "BV": 1, "MV": 0 },
}

const outcome = (prono, result) => {
  // pas de prono
  if (prono.A < 0 || prono.B < 0) {
    return "MV"
  }
  let pronoDiff = prono.A - prono.B
  let resultDiff = result.A - result.B
  let pronoWinner = prono.winner || (pronoDiff > 0 ? "A" : pronoDiff < 0 ? "B" : "")
  let resultWinner = result.winner || (resultDiff > 0 ? "A" : resultDiff < 0 ? "B" : "")
  // mauvais vainqueur
  if (pronoWinner !== resultWinner) {
    return "MV"
  }
  // bon vainqueur et bon score
  if (prono.A === result.A && prono.B === result.B) {
    return "BVBS"
  }
  // bon vainqueur et bonne différence de but mais pas bon score
  if (pronoDiff === resultDiff) {
    return "BVBD"
  }
  // bon vainqueur mais mauvais score et mauvaise diff
  return "BV"
}

const buildPronosResultsFromMatch = (match) => {
  return Object.entries(match.players).reduce((pronosResults, [playerId, prono]) => {
    pronosResults[players[playerId].name] = bareme[match.stage.type][outcome(prono, match.result)]
    return pronosResults
  }, {})
}

const underline = (matchResult) => {
  if (matchResult.winner) {
    if (matchResult.winner === "A") {
      return <div style={{ display: "flex" }}><div className="underline">{matchResult.A}</div><div>-{matchResult.B}</div></div>
    }
    return <div style={{ display: "flex" }}><div>{matchResult.A}-</div><div className="underline">{matchResult.B}</div></div>
  } else {
    return <div style={{ display: "flex" }}>{`${matchResult.A}-${matchResult.B}`}</div>
  }
}

const buildPronosResultsFromMatches = (matches) => {
  return matches.reduce((pronosResults, match) => {
    pronosResults[match.id] = {
      shortName: `${match.teams.A}-${match.teams.B}`,
      fullName:
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{marginRight:5}}>{match.teams.A}</div>
          {underline(match.result)}
          <div style={{marginLeft:5}}>{match.teams.B}</div>
        </div>,
      rawPronos: Object.entries(match.players).reduce((ps, [playerId, prono]) => {
        ps[players[playerId].name] = underline(prono)
        return ps
      }, {}),
      pronosResults: buildPronosResultsFromMatch(match)
    }
    return pronosResults
  }, {})
}

const buildAggregatedResultFromMatches = (matches) => {
  let results = buildPronosResultsFromMatches(matches)
  // temp variable to store the result after previous match so that we can compute the new total
  let previousTotals = Object.values(players).reduce((ps, { name }) => { ps[name] = 0; return ps; }, {})
  let dataForGraph = Object.entries(results).reduce((matchesForGraph, [_, match], i) => {
    let matchForGraph = Object.values(players).reduce((totals, { name }) => {
      totals[name] = match.pronosResults[name] + (i > 0 ? previousTotals[name] : 0)
      // store the pronos results on totals so that the tooltip can use it
      totals.additionalData = match
      if (!totals.additionalData.previousTotals) {
        totals.additionalData.previousTotals = {}
        Object.assign(totals.additionalData.previousTotals, previousTotals)
      }
      // update previousTotals
      previousTotals[name] = totals[name]
      return totals
    }, { name: match.shortName })
    matchesForGraph.push(matchForGraph)
    return matchesForGraph
  },
    // {name:"FRA-CRO",Jacques:0,Nicolas:0}
    [Object.values(players).reduce((ps, { name }) => { ps[name] = 0; return ps; }, { name: "DEBUT" })])
  console.log(dataForGraph)
  return dataForGraph
}

// Input: [ [1, 2, 3], [101, 2, 1, 10], [2, 1] ]
// Output: [1, 2, 3, 101, 10]
const mergeDedupe = (arr) => [...new Set([].concat(...arr))]

// return the array without the specified element
const removeElement = (element, array) => {
  array.splice(array.indexOf(element), 1)
  return array
}

const removeElements = (elements, array) => {
  let result = elements.reduce((newarray, e) =>
    newarray = removeElement(e, newarray), array)
  return result
}

const computeRankings = (totals) => {
  return Object.entries(totals).sort((a,b) => a.value < b.value).reduce((ps, p) => {

    return ps
  }, {})
}

const CustomToolTip = (props) => {
  const { active } = props;

  if (active) {
    const { payload } = props;
    console.log(payload)
    let currentPlace = 0
    let skippedPlaces = 0
    let scoreOfThePreviousPlayer = Number.MAX_SAFE_INTEGER
    let dd = payload[0].payload.additionalData.previousTotals

    return (
      payload[0].payload.additionalData ?
        <div style={{ backgroundColor: "white", border: "1px solid rgb(204,204,204)" }}>
          <div style={{marginTop:10, marginBottom:10}}>{payload[0].payload.additionalData.fullName}</div>
          <table>
            <tbody>
              {payload.sort((a, b) => a.value < b.value)
                .map((pl) => {
                  if (pl.value !== scoreOfThePreviousPlayer) {
                    currentPlace += 1 + skippedPlaces
                    skippedPlaces = 0
                  } else {
                    skippedPlaces += 1
                  }
                  scoreOfThePreviousPlayer = pl.value
                  return (
                    <tr style={{ color: pl.color }} key={pl.name}>
                      <td>{currentPlace}</td>
                      <td>(+1)</td>
                      <td>{pl.name}</td>
                      <td>{pl.value} pts</td>
                      <td>(+{pl.payload.additionalData.pronosResults[pl.name]})</td>
                      <td>{pl.payload.additionalData.rawPronos[pl.name]}</td>
                    </tr>)
                })
              }
            </tbody>
          </table>
        </div> : null
    );
  }

  return null;
}

const SimpleLineChart = ({ data }) => (
  <LineChart width={1000} height={500} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <XAxis dataKey="name" />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip content={<CustomToolTip />} />
    {/* <Tooltip /> */}
    <Legend />
    {Object.values(players).map(p => <Line key={p.name} type="monotone" dataKey={p.name} stroke={p.color} />)}
  </LineChart>
);

const getTeamsFromGroup = (grp) =>
  Object.entries(teams).filter(([_, { group }]) => group === grp).map(([k]) => k).sort().join("<br/>")

const getTeamsFromDirtyGroup = (dgrp) => (dgrp.startsWith("Grp") ? getTeamsFromGroup(dgrp.slice(-1)) : '')

const CheckBox = ({ id, onChange, checked, buildTip }) => (
  <div>
    <input type="checkbox" id={id} name={id} onChange={onChange} checked={checked} />
    <label data-tip={buildTip(id)} data-multiline="true" htmlFor={id}>{id}</label>
  </div>)

const getTeamsFromRegion = (reg) =>
  Object.entries(teams).filter(([_, { region }]) => region === regions.indexOf(reg)).map(([k]) => k).sort().join("<br/>")

const filters = [
  { type: "Groupe", name: "A" },
  { type: "Groupe", name: "B" },
  { type: "Groupe", name: "C" },
  { type: "Groupe", name: "D" },
  { type: "Groupe", name: "E" },
  { type: "Groupe", name: "F" },
  { type: "Groupe", name: "G" },
  { type: "Groupe", name: "H" },
  { type: "1/8" },
  { type: "1/4" },
  { type: "1/2" },
  { type: "Petite Finale" },
  { type: "Finale" }
]

const getDisplayName = (filter) => filter.type === "Groupe" ? `Grp.${filter.name}` : filter.type

const getPhase = (match) => match.stage.type === "Groupe" ? `Grp.${teams[match.teams.A].group}` : match.stage.type

class App extends Component {
  state = {
    filterType: "Phases",
    dataPhases: matches,
    dataRegions: matches,
    uncheckedPhases: [],
    checkedRegions: regions
  }

  togglePhase = (event) => {
    //console.log(event.target.id + " " + event.target.name + " " + event.target.checked)
    // deep copy the array
    // https://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript 
    let uncheckedPhases = this.state.uncheckedPhases.slice()
    let clickedItem = event.target.name

    if (event.target.checked) {
      uncheckedPhases = removeElement(clickedItem, uncheckedPhases)
    } else {
      uncheckedPhases.push(clickedItem)
    }

    let newData = matches.filter(match => !uncheckedPhases.includes(getPhase(match)))

    this.setState({ uncheckedPhases: uncheckedPhases, dataPhases: newData })
  }

  toggleRegion = (event) => {
    let checkedRegions = this.state.checkedRegions.slice()
    let clickedItem = event.target.name

    if (event.target.checked) {
      checkedRegions = mergeDedupe([checkedRegions, [clickedItem]])
    } else {
      checkedRegions = removeElement(clickedItem, checkedRegions)
    }

    let newData = matches.filter(match =>
      checkedRegions.includes(regions[teams[match.teams.A].region]) &&
      checkedRegions.includes(regions[teams[match.teams.B].region]))

    this.setState({ checkedRegions: checkedRegions, dataRegions: newData })
  }

  changeFilterType = (event) => {
    this.setState({ filterType: event.target.value })
  }

  render() {
    const { filterType, dataPhases, dataRegions, uncheckedPhases, checkedRegions } = this.state
    return (
      <div className="App">
        <table style={{ width: 1000 }}>
          <tbody>
            <tr>
              <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {["Phases", "Regions"].map(ft =>
                    <div key={ft}>
                      <input type="radio" name="filterType" value={ft} checked={filterType === ft}
                        onChange={this.changeFilterType} />
                      <label htmlFor="filterType">{ft}</label>
                    </div>)}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: (filterType === "Phases" ? "flex" : "none"), justifyContent: "center" }}>
                  {filters.map((filter) => {
                    let displayName = getDisplayName(filter)
                    return (
                      <div key={displayName}>
                        <CheckBox id={displayName} onChange={this.togglePhase}
                          checked={!uncheckedPhases.includes(displayName)}
                          buildTip={getTeamsFromDirtyGroup} />
                      </div>)
                  })}
                </div>
                <div style={{ display: (filterType === "Regions" ? "flex" : "none"), justifyContent: "center" }}>
                  {regions.map((region) => (
                    <div key={region}>
                      <CheckBox id={region} onChange={this.toggleRegion}
                        checked={checkedRegions.includes(region)}
                        buildTip={getTeamsFromRegion} />
                    </div>))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ReactTooltip />
        <SimpleLineChart data={buildAggregatedResultFromMatches(filterType === "Phases" ? dataPhases : dataRegions)} />
      </div>
    );
  }
}

export default App;
