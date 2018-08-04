import React, { Component } from 'react';
import './App.css';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const data1 = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const players = {"1":"Jacques","2":"Nicolas","3":"Stéphane","4":"Valérie"}

const data2 = [
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
    results[players[playerId]] = bareme[match.stage.type][outcome(prono, match.result)]
    return results
  }, {})
}

const sumObjectsByKey = (...objs) => (
  objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {})
)

const buildResultsFromMatches = (matches) => {
  return data2.reduce((results, match) => {
    results[`${match.teams.A}-${match.teams.B}`] = buildResultFromMatch(match)
    return results
  }, {})
}

const buildAggregatedResultFromMatches = (matches) => {
  let results = buildResultsFromMatches(data2)
  let previousTotals = Object.values(players).reduce((ps, pname) => {ps[pname] = 0;return ps;}, {})
  let dataForGraph = Object.entries(results).reduce((matchesForGraph, [matchKey, match], i) => {
    let matchForGraph = Object.values(players).reduce((totals, p) => {
      totals[p] = match[p] + (i > 0 ? previousTotals[p] : 0)
      previousTotals[p] = totals[p]
      return totals
    }, {name:matchKey})
    matchesForGraph.push(matchForGraph)
    return matchesForGraph
  },
  // {name:"FRA-CRO",Jacques:0,Nicolas:0}
  [Object.values(players).reduce((ps, pname) => {ps[pname] = 0;return ps;}, {name:"DEBUT"})])
  return dataForGraph
}

console.log(buildAggregatedResultFromMatches(data2))

const SimpleLineChart2 = ({data}) =>(
    	<LineChart width={1000} height={500} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="Jacques" stroke="#8f39ff" />
       <Line type="monotone" dataKey="Nicolas" stroke="#39ffe5" />
       <Line type="monotone" dataKey="Valérie" stroke="#ff6439" />
       <Line type="monotone" dataKey="Stéphane" stroke="#ffc739" />
      </LineChart>
    );

class App extends Component {
  render() {
    return (
      <div className="App">
        <SimpleLineChart2 data={buildAggregatedResultFromMatches(data2)}/>
      </div>
    );
  }
}

export default App;
