import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import players from '../data/players.json';

// resultsByTeam: {Jacques:{ALL:{average:0.8333333333333334, matchCount:3, score:2.5},...
const ResultsByTeamTable = ({ resultsByTeam }) => {
  // array of {nb of players} arrays of {nb of matches} arrays like this one: ["FRA", 1.5]
  let resultsByTeam2 = Object.values(resultsByTeam)
    .map((resultsByTeamsUnsorted) =>
      Object.entries(resultsByTeamsUnsorted).sort(([_a, da], [_b, db]) => {
        if (da.average < db.average) {
          return 1;
        }
        if (db.average < da.average) {
          return -1;
        }
        return 0;
      }),
    )
    .map((resultsByTeamsSorted) => Object.values(resultsByTeamsSorted).map(([team, { average }]) => [team, average]));
  let topResultsByTeams = [];
  for (let i = 0; i < resultsByTeam2.length; i++) {
    // showing the top 5 is enough
    for (let j = 0; j < 5 /*dd[i].length*/; j++) {
      if (i === 0) {
        topResultsByTeams[j] = [];
      }
      topResultsByTeams[j][i] = resultsByTeam2[i][j];
    }
  }
  //console.log(resultsByTeam2);
  //console.log(topResultsByTeams);
  return (
    <Fragment>
      <h3>Equipes rapportant le plus de points par match</h3>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            {Object.values(players).map((p) => (
              <th key={p.name} colSpan={2}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topResultsByTeams.map((topResultsByRank, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              {topResultsByRank.map((topResultsByRankByPlayer, j) => (
                <Fragment key={j}>
                  <td>{topResultsByRankByPlayer[0]}</td>
                  <td>{topResultsByRankByPlayer[1].toFixed(2)}</td>
                </Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
};

ResultsByTeamTable.propTypes = {
  resultsByTeam: PropTypes.object.isRequired,
};

export default ResultsByTeamTable;
