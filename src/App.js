import React, { Component } from 'react';
import './App.css';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const players = {
  "1":{name:"Jacques" , color:"#8f39ff"},
  "2":{name:"Nicolas" , color:"#39ffe5"},
  "3":{name:"Stéphane", color:"#ffc739"},
  "4":{name:"Valérie" , color:"#ff6439"}
}

const regions = ["Europe","Amérique du Nord & Centrale","Amérique du Sud","Afrique","Asie & Océanie"]
const countries = {
  "SUI":0,"RUS":0,"ARA":4,"EGY":3,"URU":2,"MAR":3,"IRA":4,"POR":0,"ESP":0,"FRA":0,"AUS":4,
  "ARG":2,"ISL":0,"PER":2,"DAN":0,"CRO":0,"NIG":3,"COS":1,"SER":0,"ALL":0,"MEX":1,"BRE":2,
  "SUE":0,"COR":4,"BEL":0,"PAN":1,"TUN":3,"ANG":0,"COL":2,"JAP":4,"POL":0,"SEN":3}

const data0 = [
{"teams":{"A":"RUS","B":"ARA"},"stage":{"type":"Groupe","name":"A"},"result":{"A":5,"B":0},"players":{"1":{"A":4,"B":1},"2":{"A":2,"B":1},"3":{"A":1,"B":2},"4":{"A":2,"B":0}}},
{"teams":{"A":"EGY","B":"URU"},"stage":{"type":"Groupe","name":"A"},"result":{"A":0,"B":1},"players":{"1":{"A":1,"B":2},"2":{"A":0,"B":2},"3":{"A":0,"B":3},"4":{"A":0,"B":3}}},
{"teams":{"A":"MAR","B":"IRA"},"stage":{"type":"Groupe","name":"B"},"result":{"A":0,"B":1},"players":{"1":{"A":3,"B":1},"2":{"A":1,"B":1},"3":{"A":2,"B":1},"4":{"A":1,"B":1}}},
{"teams":{"A":"POR","B":"ESP"},"stage":{"type":"Groupe","name":"B"},"result":{"A":3,"B":3},"players":{"1":{"A":2,"B":2},"2":{"A":2,"B":2},"3":{"A":2,"B":2},"4":{"A":1,"B":1}}},
{"teams":{"A":"FRA","B":"AUS"},"stage":{"type":"Groupe","name":"C"},"result":{"A":2,"B":1},"players":{"1":{"A":3,"B":1},"2":{"A":3,"B":0},"3":{"A":2,"B":0},"4":{"A":2,"B":1}}},
{"teams":{"A":"ARG","B":"ISL"},"stage":{"type":"Groupe","name":"D"},"result":{"A":1,"B":1},"players":{"1":{"A":4,"B":1},"2":{"A":1,"B":0},"3":{"A":1,"B":1},"4":{"A":2,"B":1}}},
{"teams":{"A":"PER","B":"DAN"},"stage":{"type":"Groupe","name":"C"},"result":{"A":0,"B":1},"players":{"1":{"A":1,"B":1},"2":{"A":1,"B":0},"3":{"A":2,"B":0},"4":{"A":0,"B":0}}},
{"teams":{"A":"CRO","B":"NIG"},"stage":{"type":"Groupe","name":"D"},"result":{"A":2,"B":0},"players":{"1":{"A":2,"B":0},"2":{"A":2,"B":1},"3":{"A":3,"B":2},"4":{"A":0,"B":1}}},
{"teams":{"A":"COS","B":"SER"},"stage":{"type":"Groupe","name":"E"},"result":{"A":0,"B":1},"players":{"1":{"A":1,"B":1},"2":{"A":0,"B":2},"3":{"A":1,"B":2},"4":{"A":1,"B":0}}},
{"teams":{"A":"ALL","B":"MEX"},"stage":{"type":"Groupe","name":"F"},"result":{"A":0,"B":1},"players":{"1":{"A":4,"B":1},"2":{"A":3,"B":0},"3":{"A":3,"B":1},"4":{"A":4,"B":0}}},
{"teams":{"A":"BRE","B":"SUI"},"stage":{"type":"Groupe","name":"E"},"result":{"A":1,"B":1},"players":{"1":{"A":3,"B":0},"2":{"A":2,"B":1},"3":{"A":2,"B":2},"4":{"A":3,"B":0}}},
{"teams":{"A":"SUE","B":"COR"},"stage":{"type":"Groupe","name":"F"},"result":{"A":1,"B":0},"players":{"1":{"A":3,"B":1},"2":{"A":2,"B":0},"3":{"A":4,"B":0},"4":{"A":1,"B":0}}},
{"teams":{"A":"BEL","B":"PAN"},"stage":{"type":"Groupe","name":"G"},"result":{"A":3,"B":0},"players":{"1":{"A":4,"B":1},"2":{"A":3,"B":0},"3":{"A":5,"B":2},"4":{"A":2,"B":0}}},
{"teams":{"A":"TUN","B":"ANG"},"stage":{"type":"Groupe","name":"G"},"result":{"A":1,"B":2},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":2},"3":{"A":1,"B":1},"4":{"A":0,"B":3}}},
{"teams":{"A":"COL","B":"JAP"},"stage":{"type":"Groupe","name":"H"},"result":{"A":1,"B":2},"players":{"1":{"A":1,"B":1},"2":{"A":2,"B":0},"3":{"A":3,"B":0},"4":{"A":2,"B":0}}},
{"teams":{"A":"POL","B":"SEN"},"stage":{"type":"Groupe","name":"H"},"result":{"A":1,"B":2},"players":{"1":{"A":2,"B":3},"2":{"A":2,"B":1},"3":{"A":1,"B":2},"4":{"A":1,"B":1}}},
{"teams":{"A":"RUS","B":"EGY"},"stage":{"type":"Groupe","name":"A"},"result":{"A":3,"B":1},"players":{"1":{"A":3,"B":2},"2":{"A":2,"B":2},"3":{"A":2,"B":1},"4":{"A":1,"B":0}}},
{"teams":{"A":"POR","B":"MAR"},"stage":{"type":"Groupe","name":"B"},"result":{"A":1,"B":0},"players":{"1":{"A":4,"B":0},"2":{"A":3,"B":1},"3":{"A":3,"B":1},"4":{"A":3,"B":0}}},
{"teams":{"A":"URU","B":"ARA"},"stage":{"type":"Groupe","name":"A"},"result":{"A":1,"B":0},"players":{"1":{"A":5,"B":1},"2":{"A":3,"B":1},"3":{"A":4,"B":0},"4":{"A":2,"B":0}}},
{"teams":{"A":"IRA","B":"ESP"},"stage":{"type":"Groupe","name":"B"},"result":{"A":0,"B":1},"players":{"1":{"A":1,"B":3},"2":{"A":1,"B":2},"3":{"A":0,"B":4},"4":{"A":0,"B":2}}},
{"teams":{"A":"DAN","B":"AUS"},"stage":{"type":"Groupe","name":"C"},"result":{"A":1,"B":1},"players":{"1":{"A":2,"B":1},"2":{"A":2,"B":1},"3":{"A":2,"B":2},"4":{"A":2,"B":0}}},
{"teams":{"A":"FRA","B":"PER"},"stage":{"type":"Groupe","name":"C"},"result":{"A":1,"B":0},"players":{"1":{"A":3,"B":1},"2":{"A":2,"B":1},"3":{"A":2,"B":1},"4":{"A":3,"B":0}}},
{"teams":{"A":"ARG","B":"CRO"},"stage":{"type":"Groupe","name":"D"},"result":{"A":0,"B":3},"players":{"1":{"A":2,"B":0},"2":{"A":2,"B":1},"3":{"A":2,"B":2},"4":{"A":2,"B":1}}},
{"teams":{"A":"BRE","B":"COS"},"stage":{"type":"Groupe","name":"E"},"result":{"A":2,"B":0},"players":{"1":{"A":3,"B":0},"2":{"A":3,"B":0},"3":{"A":2,"B":0},"4":{"A":3,"B":0}}},
{"teams":{"A":"NIG","B":"ISL"},"stage":{"type":"Groupe","name":"D"},"result":{"A":2,"B":0},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":2},"3":{"A":1,"B":2},"4":{"A":1,"B":2}}},
{"teams":{"A":"SER","B":"SUI"},"stage":{"type":"Groupe","name":"E"},"result":{"A":1,"B":2},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":3},"3":{"A":1,"B":1},"4":{"A":0,"B":2}}},
{"teams":{"A":"BEL","B":"TUN"},"stage":{"type":"Groupe","name":"G"},"result":{"A":5,"B":2},"players":{"1":{"A":3,"B":0},"2":{"A":3,"B":0},"3":{"A":2,"B":1},"4":{"A":3,"B":0}}},
{"teams":{"A":"COR","B":"MEX"},"stage":{"type":"Groupe","name":"F"},"result":{"A":1,"B":2},"players":{"1":{"A":0,"B":2},"2":{"A":1,"B":2},"3":{"A":0,"B":1},"4":{"A":0,"B":2}}},
{"teams":{"A":"ALL","B":"SUE"},"stage":{"type":"Groupe","name":"F"},"result":{"A":2,"B":1},"players":{"1":{"A":2,"B":1},"2":{"A":2,"B":1},"3":{"A":2,"B":2},"4":{"A":3,"B":1}}},
{"teams":{"A":"ANG","B":"PAN"},"stage":{"type":"Groupe","name":"G"},"result":{"A":6,"B":1},"players":{"1":{"A":3,"B":1},"2":{"A":2,"B":0},"3":{"A":3,"B":1},"4":{"A":3,"B":0}}},
{"teams":{"A":"JAP","B":"SEN"},"stage":{"type":"Groupe","name":"H"},"result":{"A":2,"B":2},"players":{"1":{"A":3,"B":3},"2":{"A":1,"B":1},"3":{"A":1,"B":2},"4":{"A":1,"B":2}}},
{"teams":{"A":"POL","B":"COL"},"stage":{"type":"Groupe","name":"H"},"result":{"A":0,"B":3},"players":{"1":{"A":3,"B":1},"2":{"A":0,"B":2},"3":{"A":1,"B":2},"4":{"A":1,"B":2}}},
{"teams":{"A":"URU","B":"RUS"},"stage":{"type":"Groupe","name":"A"},"result":{"A":3,"B":0},"players":{"1":{"A":2,"B":2},"2":{"A":-1,"B":-1},"3":{"A":2,"B":2},"4":{"A":3,"B":2}}},
{"teams":{"A":"ARA","B":"EGY"},"stage":{"type":"Groupe","name":"A"},"result":{"A":2,"B":1},"players":{"1":{"A":1,"B":1},"2":{"A":-1,"B":-1},"3":{"A":0,"B":2},"4":{"A":0,"B":3}}},
{"teams":{"A":"ESP","B":"MAR"},"stage":{"type":"Groupe","name":"B"},"result":{"A":2,"B":2},"players":{"1":{"A":3,"B":0},"2":{"A":2,"B":1},"3":{"A":3,"B":1},"4":{"A":4,"B":0}}},
{"teams":{"A":"IRA","B":"POR"},"stage":{"type":"Groupe","name":"B"},"result":{"A":1,"B":1},"players":{"1":{"A":1,"B":4},"2":{"A":1,"B":2},"3":{"A":0,"B":2},"4":{"A":1,"B":4}}},
{"teams":{"A":"DAN","B":"FRA"},"stage":{"type":"Groupe","name":"C"},"result":{"A":0,"B":0},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":3},"3":{"A":1,"B":3},"4":{"A":1,"B":2}}},
{"teams":{"A":"AUS","B":"PER"},"stage":{"type":"Groupe","name":"C"},"result":{"A":0,"B":2},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":1},"3":{"A":1,"B":2},"4":{"A":1,"B":3}}},
{"teams":{"A":"ISL","B":"CRO"},"stage":{"type":"Groupe","name":"D"},"result":{"A":1,"B":2},"players":{"1":{"A":0,"B":3},"2":{"A":0,"B":3},"3":{"A":0,"B":2},"4":{"A":0,"B":2}}},
{"teams":{"A":"NIG","B":"ARG"},"stage":{"type":"Groupe","name":"D"},"result":{"A":1,"B":2},"players":{"1":{"A":2,"B":2},"2":{"A":1,"B":2},"3":{"A":2,"B":3},"4":{"A":0,"B":1}}},
{"teams":{"A":"MEX","B":"SUE"},"stage":{"type":"Groupe","name":"F"},"result":{"A":0,"B":3},"players":{"1":{"A":2,"B":1},"2":{"A":1,"B":1},"3":{"A":2,"B":1},"4":{"A":3,"B":1}}},
{"teams":{"A":"COR","B":"ALL"},"stage":{"type":"Groupe","name":"F"},"result":{"A":2,"B":0},"players":{"1":{"A":0,"B":3},"2":{"A":0,"B":2},"3":{"A":0,"B":2},"4":{"A":0,"B":5}}},
{"teams":{"A":"SER","B":"BRE"},"stage":{"type":"Groupe","name":"E"},"result":{"A":0,"B":2},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":2},"3":{"A":1,"B":2},"4":{"A":1,"B":3}}},
{"teams":{"A":"SUI","B":"COS"},"stage":{"type":"Groupe","name":"E"},"result":{"A":2,"B":2},"players":{"1":{"A":3,"B":0},"2":{"A":4,"B":1},"3":{"A":1,"B":1},"4":{"A":2,"B":0}}},
{"teams":{"A":"SEN","B":"COL"},"stage":{"type":"Groupe","name":"H"},"result":{"A":0,"B":1},"players":{"1":{"A":0,"B":2},"2":{"A":1,"B":2},"3":{"A":0,"B":2},"4":{"A":1,"B":3}}},
{"teams":{"A":"JAP","B":"POL"},"stage":{"type":"Groupe","name":"H"},"result":{"A":0,"B":1},"players":{"1":{"A":3,"B":0},"2":{"A":2,"B":0},"3":{"A":1,"B":1},"4":{"A":1,"B":1}}},
{"teams":{"A":"ANG","B":"BEL"},"stage":{"type":"Groupe","name":"G"},"result":{"A":0,"B":1},"players":{"1":{"A":2,"B":2},"2":{"A":1,"B":2},"3":{"A":1,"B":3},"4":{"A":1,"B":2}}},
{"teams":{"A":"PAN","B":"TUN"},"stage":{"type":"Groupe","name":"G"},"result":{"A":1,"B":2},"players":{"1":{"A":1,"B":2},"2":{"A":0,"B":2},"3":{"A":0,"B":2},"4":{"A":0,"B":1}}},
{"teams":{"A":"FRA","B":"ARG"},"stage":{"type":"1/8"},"result":{"A":4,"B":3},"players":{"1":{"A":2,"B":1},"2":{"A":2,"B":1},"3":{"A":2,"B":1},"4":{"A":2,"B":1}}},
{"teams":{"A":"URU","B":"POR"},"stage":{"type":"1/8"},"result":{"A":2,"B":1},"players":{"1":{"A":2,"B":1},"2":{"A":1,"B":2},"3":{"A":2,"B":2, "winner":"A"},"4":{"A":1,"B":2}}},
{"teams":{"A":"ESP","B":"RUS"},"stage":{"type":"1/8"},"result":{"A":1,"B":1, "winner":"B"},"players":{"1":{"A":3,"B":1},"2":{"A":1,"B":1, "winner":"A"},"3":{"A":2,"B":0},"4":{"A":2,"B":0}}},
{"teams":{"A":"CRO","B":"DAN"},"stage":{"type":"1/8"},"result":{"A":1,"B":1, "winner":"A"},"players":{"1":{"A":2,"B":0},"2":{"A":2,"B":0},"3":{"A":1,"B":1, "winner":"A"},"4":{"A":1,"B":1, "winner":"A"}}},
{"teams":{"A":"BRE","B":"MEX"},"stage":{"type":"1/8"},"result":{"A":2,"B":0},"players":{"1":{"A":2,"B":1},"2":{"A":2,"B":1},"3":{"A":3,"B":2},"4":{"A":3,"B":1}}},
{"teams":{"A":"BEL","B":"JAP"},"stage":{"type":"1/8"},"result":{"A":3,"B":2},"players":{"1":{"A":1,"B":1, "winner":"A"},"2":{"A":2,"B":1},"3":{"A":4,"B":0},"4":{"A":3,"B":0}}},
{"teams":{"A":"SUE","B":"SUI"},"stage":{"type":"1/8"},"result":{"A":1,"B":0},"players":{"1":{"A":2,"B":1},"2":{"A":1,"B":2},"3":{"A":1,"B":0},"4":{"A":1,"B":1, "winner":"A"}}},
{"teams":{"A":"COL","B":"ANG"},"stage":{"type":"1/8"},"result":{"A":1,"B":1, "winner":"B"},"players":{"1":{"A":2,"B":1},"2":{"A":1,"B":1, "winner":"B"},"3":{"A":2,"B":1},"4":{"A":1,"B":2}}},
{"teams":{"A":"FRA","B":"URU"},"stage":{"type":"1/4"},"result":{"A":2,"B":0},"players":{"1":{"A":2,"B":1},"2":{"A":2,"B":1},"3":{"A":2,"B":2, "winner":"A"},"4":{"A":2,"B":1}}},
{"teams":{"A":"BRE","B":"BEL"},"stage":{"type":"1/4"},"result":{"A":1,"B":2},"players":{"1":{"A":3,"B":2},"2":{"A":2,"B":1},"3":{"A":3,"B":1},"4":{"A":1,"B":1, "winner":"A"}}},
{"teams":{"A":"SUE","B":"ANG"},"stage":{"type":"1/4"},"result":{"A":0,"B":2},"players":{"1":{"A":2,"B":1},"2":{"A":1,"B":0},"3":{"A":1,"B":2},"4":{"A":1,"B":2}}},
{"teams":{"A":"RUS","B":"CRO"},"stage":{"type":"1/4"},"result":{"A":2,"B":2, "winner":"B"},"players":{"1":{"A":1,"B":3},"2":{"A":1,"B":1, "winner":"B"},"3":{"A":0,"B":2},"4":{"A":1,"B":3}}},
{"teams":{"A":"FRA","B":"BEL"},"stage":{"type":"1/2"},"result":{"A":1,"B":0},"players":{"1":{"A":3,"B":2},"2":{"A":2,"B":2, "winner":"A"},"3":{"A":3,"B":2},"4":{"A":2,"B":0}}},
{"teams":{"A":"CRO","B":"ANG"},"stage":{"type":"1/2"},"result":{"A":2,"B":1},"players":{"1":{"A":1,"B":2},"2":{"A":1,"B":2},"3":{"A":1,"B":2},"4":{"A":1,"B":3}}},
{"teams":{"A":"BEL","B":"ANG"},"stage":{"type":"Petite Finale"},"result":{"A":2,"B":0},"players":{"1":{"A":3,"B":1},"2":{"A":2,"B":1},"3":{"A":3,"B":0},"4":{"A":2,"B":1}}},
{"teams":{"A":"FRA","B":"CRO"},"stage":{"type":"Finale"},"result":{"A":4,"B":2},"players":{"1":{"A":4,"B":1},"2":{"A":2,"B":1},"3":{"A":2,"B":0},"4":{"A":3,"B":1}}}
]

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
    <label htmlFor={id}>{id}</label>
  </div>
    )

const filters = [
  {title:"Grp.A", filter:d => (d.stage.type === "Groupe" && d.stage.name === "A")},
  {title:"Grp.B", filter:d => (d.stage.type === "Groupe" && d.stage.name === "B")},
  {title:"Grp.C", filter:d => (d.stage.type === "Groupe" && d.stage.name === "C")},
  {title:"Grp.D", filter:d => (d.stage.type === "Groupe" && d.stage.name === "D")},
  {title:"Grp.E", filter:d => (d.stage.type === "Groupe" && d.stage.name === "E")},
  {title:"Grp.F", filter:d => (d.stage.type === "Groupe" && d.stage.name === "F")},
  {title:"Grp.G", filter:d => (d.stage.type === "Groupe" && d.stage.name === "G")},
  {title:"Grp.H", filter:d => (d.stage.type === "Groupe" && d.stage.name === "H")},
  {title:"1/8", filter:d => (d.stage.type === "1/8")},
  {title:"1/4", filter:d => (d.stage.type === "1/4")},
  {title:"1/2", filter:d => (d.stage.type === "1/2")},
  {title:"Petite Finale", filter:d => (d.stage.type === "Petite Finale")},
  {title:"Finale", filter:d => (d.stage.type === "Finale")},
]

class App extends Component {
  state = {
    data: data0,
    dataRegions:data0,
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
        let matchingMatches = data0.filter(match => currentFilter.filter(match))
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

    let newData = data0.filter(match => checkedRegions.includes(regions[countries[match.teams.A]]) &&
      checkedRegions.includes(regions[countries[match.teams.B]]))

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
      </div>
    );
  }
}

export default App;
