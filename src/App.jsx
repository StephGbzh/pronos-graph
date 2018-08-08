import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import './App.css';
import matches from './data/matches.json'
import teams from './data/teams.json'

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const players = {
  "1":{name:"Jacques" , color:"#8f39ff"},
  "2":{name:"Nicolas" , color:"#39ffe5"},
  "3":{name:"Stéphane", color:"#ffc739"},
  "4":{name:"Valérie" , color:"#ff6439"}
}

const regions = ["Europe","Amérique du Nord & Centrale","Amérique du Sud","Afrique","Asie & Océanie"]

const bareme = {
  "Groupe"       :{"BVBS":3, "BVBD":2,"BV":1,"MV":0},
  "1/8"          :{"BVBS":6, "BVBD":4,"BV":2,"MV":0},
  "1/4"          :{"BVBS":8, "BVBD":5,"BV":3,"MV":0},
  "1/2"          :{"BVBS":10,"BVBD":6,"BV":4,"MV":0},
  "Petite Finale":{"BVBS":12,"BVBD":7,"BV":5,"MV":0},
  "Finale"       :{"BVBS":14,"BVBD":8,"BV":6,"MV":0},
}

const bareme2 = {
  "Groupe"       :{"BVBS":3,"BVBD":2,"BV":1,"MV":0},
  "1/8"          :{"BVBS":3,"BVBD":2,"BV":1,"MV":0},
  "1/4"          :{"BVBS":3,"BVBD":2,"BV":1,"MV":0},
  "1/2"          :{"BVBS":3,"BVBD":2,"BV":1,"MV":0},
  "Petite Finale":{"BVBS":3,"BVBD":2,"BV":1,"MV":0},
  "Finale"       :{"BVBS":3,"BVBD":2,"BV":1,"MV":0},
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

const buildResultFromMatch = (match) => {
  return Object.entries(match.players).reduce((results, [playerId, prono]) => {
    results[players[playerId].name] = bareme[match.stage.type][outcome(prono, match.result)]
    return results
  }, {})
}

const buildResultsFromMatches = (matches) => {
  return matches.reduce((results, match) => {
    results[`${match.teams.A}-${match.teams.B}`] = buildResultFromMatch(match)
    return results
  }, {})
}

const buildAggregatedResultFromMatches = (matches) => {
  let results = buildResultsFromMatches(matches)
  let previousTotals = Object.values(players).reduce((ps, { name }) => {ps[name] = 0;return ps;}, {})
  let dataForGraph = Object.entries(results).reduce((matchesForGraph, [matchKey, match], i) => {
    let matchForGraph = Object.values(players).reduce((totals, { name }) => {
      totals[name] = match[name] + (i > 0 ? previousTotals[name] : 0)
      previousTotals[name] = totals[name]
      return totals
    }, {name:matchKey})
    matchesForGraph.push(matchForGraph)
    return matchesForGraph
  },
  // {name:"FRA-CRO",Jacques:0,Nicolas:0}
  [Object.values(players).reduce((ps, { name }) => {ps[name] = 0;return ps;}, {name:"DEBUT"})])
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

const removeElements = (elements, array) => 
{
  let result = elements.reduce((newarray, e) =>
    newarray = removeElement(e, newarray), array)
  return result
}

const SimpleLineChart = ({data}) =>(
    	<LineChart width={1000} height={500} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       {Object.values(players).map(p => <Line key={p.name} type="monotone" dataKey={p.name} stroke={p.color} />)}
      </LineChart>
    );

const CheckBox = ({id, onChange, checked}) => (
  <div>
    <input type="checkbox" id={id} name={id} onChange={onChange} checked={checked}/>
    <label data-tip="UUU" htmlFor={id}>{id}</label>
  </div>
    )

const filters = [
  {title:"Grp.A", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "A")},
  {title:"Grp.B", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "B")},
  {title:"Grp.C", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "C")},
  {title:"Grp.D", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "D")},
  {title:"Grp.E", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "E")},
  {title:"Grp.F", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "F")},
  {title:"Grp.G", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "G")},
  {title:"Grp.H", filter:match => (match.stage.type === "Groupe" && teams[match.teams.A].group === "H")},
  {title:"1/8", filter:match => (match.stage.type === "1/8")},
  {title:"1/4", filter:match => (match.stage.type === "1/4")},
  {title:"1/2", filter:match => (match.stage.type === "1/2")},
  {title:"Petite Finale", filter:match => (match.stage.type === "Petite Finale")},
  {title:"Finale", filter:match => (match.stage.type === "Finale")},
]

class App extends Component {
  state = {
    data: matches,
    dataRegions:matches,
    checkedList:filters.map(e => e.title),
    checkedRegions:regions
  }

  toggleCheckBox = (event) => {
    //console.log(event.target.id + " " + event.target.name + " " + event.target.checked)
    // deep copy the array
    // https://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript 
    let checkedList = this.state.checkedList.slice()
    let clickedItem = event.target.name

    if (event.target.checked) {
      checkedList = mergeDedupe([checkedList, [clickedItem]])
    } else {
      checkedList = removeElement(clickedItem, checkedList)
    }

    let newData = checkedList.reduce((filteredData, checkedElement) =>
      {
        let currentFilter = filters.filter(f => f.title === checkedElement)[0]
        let matchingMatches = matches.filter(match => currentFilter.filter(match))
        return filteredData.concat(matchingMatches)
      }, [])

    this.setState({checkedList:checkedList, data:newData})
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

    this.setState({checkedRegions:checkedRegions, dataRegions:newData})
  }
  
  render() {
    const { data, dataRegions, checkedList, checkedRegions } = this.state
    return (
      <div className="App">
        <table style={{width:1000}}>
          <tbody>
            <tr>
            {filters.map((e) => (
              <td key={e.title}>
                <CheckBox id={e.title} onChange={this.toggleCheckBox} checked={checkedList.includes(e.title)}/>
              </td>))
              }
            </tr>
          </tbody>
        </table>
        <SimpleLineChart data={buildAggregatedResultFromMatches(data)}/>
        <table style={{width:1000}}>
          <tbody>
            <tr>
            {regions.map((region) => (
              <td key={region}>
                <CheckBox id={region} onChange={this.toggleRegion} checked={checkedRegions.includes(region)}/>
              </td>))
              }
            </tr>
          </tbody>
        </table>
        <SimpleLineChart data={buildAggregatedResultFromMatches(dataRegions)}/>
        <ReactTooltip />
      </div>
    );
  }
}

export default App;