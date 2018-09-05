import React from 'react';

import players from '../data/players.json';

/**
 * Build pronos results for all matches + previous totals to show evolution in tooltip
 * @param {Object} matches eg [...,
 * {"id":2,
 *  "teams":{"A":"EGY","B":"URU"},
 *  "stage":{"type":"Groupe"},
 *  "result":{"A":0,"B":1},
 *  "players":{"1":{"A":1,"B":2},"2":{"A":0,"B":2},"3":{"A":0,"B":3},"4":{"A":0,"B":3}}},...]
 * @param {Object} bareme eg {"vainqueur":{"exact":1,"faux":0},"score":{"exact":1,"ecart1":0,"ecart2":0,"faux":0},"diff":{"exact":1,"ecart1":0,"faux":0}}
 * @returns {Object} eg
 * {...,
 *  10: {name:"RUS-ARA",
 *       Jacques:53,
 *       Nicolas:51,
 *       additionalData:{
 *           shortName:"RUS-ARA",
 *           fullName:<React component with score for Tooltip>,
 *           rawPronos:{Jacques:<React component with prono for Tooltip>, Nicolas:...},
 *           pronosResults: {Jacques:1, Nicolas:0},
 *           previousTotals:{Jacques:52, Nicolas:51}
 * only last:resultsByTeam: {Jacques:{ALL:{average:0.8333333333333334, matchCount:3, score:2.5},...},...}
 *  },...
 * }
 */
const buildAggregatedResultFromMatches = (matches, bareme) => {
  // {...,
  //  10: {shortName:"RUS-ARA",
  //       fullName:<React component with score for Tooltip>,
  //       rawPronos:{Jacques:<React component with prono for Tooltip>, Nicolas:...},
  //       pronosResults: {Jacques:{outcome:3, teams:{RUS:1, ARA:2}}, Nicolas:{outcome:1, teams:{RUS:0, ARA:1}}},
  //  },...
  // }
  let results = buildPronosResultsFromMatches(matches, bareme);
  // temp variable to store the result after the previous match so that we can compute the new total
  // {Jacques:0, Nicolas:0}
  let previousTotals = Object.assign(...Object.values(players).map(({ name }) => ({ [name]: 0 })));
  let resultsByTeam = Object.assign(...Object.values(players).map(({ name }) => ({ [name]: {} })));
  let dataForGraph = Object.entries(results).reduce(
    (matchesForGraph, [_, match], i) => {
      let matchForGraph = Object.values(players).reduce(
        (totals, { name }) => {
          totals[name] = match.pronosResults[name].outcome + (i > 0 ? previousTotals[name] : 0);
          // store the pronos results on totals so that the tooltip can use it
          totals.additionalData = match;
          if (!totals.additionalData.previousTotals) {
            totals.additionalData.previousTotals = {};
            Object.assign(totals.additionalData.previousTotals, previousTotals);
          }
          // update previousTotals
          previousTotals[name] = totals[name];
          Object.entries(match.pronosResults[name].teams).forEach(([team, score]) => {
            if (resultsByTeam[name][team]) {
              resultsByTeam[name][team].score += score;
              resultsByTeam[name][team].matchCount += 1;
            } else {
              resultsByTeam[name][team] = { score: score, matchCount: 1 };
            }
          });
          return totals;
        },
        { name: match.shortName },
      );
      matchesForGraph.push(matchForGraph);
      return matchesForGraph;
    },
    // {name:'FRA-CRO',Jacques:0,Nicolas:0}
    [
      Object.values(players).reduce(
        (ps, { name }) => {
          ps[name] = 0;
          return ps;
        },
        { name: 'DEBUT' },
      ),
    ],
  );
  Object.values(resultsByTeam).forEach((resultsByTeamForOnePlayer) =>
    Object.values(resultsByTeamForOnePlayer).forEach((v) => (v.average = v.score / v.matchCount)),
  );
  let rankings = { dataForGraph: dataForGraph, resultsByTeam: resultsByTeam };
  //console.log(rankings);
  return rankings;
};

/**
 * Build pronos results for all matches
 * @param {Object} matches eg [...,
 * {"id":2,
 *  "teams":{"A":"EGY","B":"URU"},
 *  "stage":{"type":"Groupe"},
 *  "result":{"A":0,"B":1},
 *  "players":{"1":{"A":1,"B":2},"2":{"A":0,"B":2},"3":{"A":0,"B":3},"4":{"A":0,"B":3}}},...]
 * @param {Object} bareme eg {"vainqueur":{"exact":1,"faux":0},"score":{"exact":1,"ecart1":0,"ecart2":0,"faux":0},"diff":{"exact":1,"ecart1":0,"faux":0}}
 * @returns {Object} eg {...,
 *  10: {shortName:"RUS-ARA",
 *       fullName:<React component with score for Tooltip>,
 *       rawPronos:{Jacques:<React component with prono for Tooltip>, Nicolas:...},
 *       pronosResults: {Jacques:{outcome:3, teams:{RUS:1, ARA:2}}, Nicolas:{outcome:1, teams:{RUS:0, ARA:1}}},
 *  },...
 * }
 */
const buildPronosResultsFromMatches = (matches, bareme) => {
  return matches.reduce((pronosResults, match) => {
    pronosResults[match.id] = {
      shortName: `${match.teams.A}-${match.teams.B}`,
      fullName: (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ marginRight: 5 }}>{match.teams.A}</div>
          {underline(match.result)}
          <div style={{ marginLeft: 5 }}>{match.teams.B}</div>
        </div>
      ),
      rawPronos: Object.entries(match.players).reduce((ps, [playerId, prono]) => {
        ps[players[playerId].name] = underline(prono);
        return ps;
      }, {}),
      pronosResults: buildPronosResultsFromMatch(match, bareme),
    };
    return pronosResults;
  }, {});
};

/**
 * Builds an object containing for each player the points earned on this match
 * @param {Object} match eg {"id":1,"teams":{"A":"RUS","B":"ARA"},"stage":{"type":"Groupe"},"result":{"A":5,"B":0},"players":{"1":{"A":4,"B":1},"2":{"A":2,"B":1},"3":{"A":1,"B":2},"4":{"A":2,"B":0}}}
 * @param {Object} bareme eg {"vainqueur":{"exact":1,"faux":0},"score":{"exact":1,"ecart1":0,"ecart2":0,"faux":0},"diff":{"exact":1,"ecart1":0,"faux":0}}
 * @returns {Object} eg {Jacques:{outcome:3, teams:{RUS:1, ARA:2}}, Nicolas:{outcome:1, teams:{RUS:0, ARA:1}}}
 */
const buildPronosResultsFromMatch = (match, bareme) => {
  return Object.entries(match.players).reduce((pronosResults, [playerId, prono]) => {
    pronosResults[players[playerId].name] = outcome(prono, match.result, bareme, match.teams);
    return pronosResults;
  }, {});
};

/**
 * Compute the points earned on one match + detail per team
 * @param {Object} prono eg {A:4, B:0}
 * @param {Object} matchResult eg {A:5, B:0}
 * @param {Object} bareme eg {"vainqueur":{"exact":1,"faux":0},"score":{"exact":1,"ecart1":0,"ecart2":0,"faux":0},"diff":{"exact":1,"ecart1":0,"faux":0}}
 * @param {Object} teams eg {"A":"RUS","B":"ARA"}
 * @returns {Object} eg {outcome:3, teams:{RUS:1, ARA:2}}
 */
const outcome = (prono, matchResult, bareme, teams) => {
  // no prediction => worst possible score
  if (prono.A < 0 || prono.B < 0) {
    let outcome = Math.min(...Object.values(bareme.vainqueur)) + Math.min(...Object.values(bareme.score)) + Math.min(...Object.values(bareme.diff));
    return {
      outcome: outcome,
      teams: { [teams.A]: outcome / 2, [teams.B]: outcome / 2 },
    };
  }

  let pronoDiff = prono.A - prono.B;
  let resultDiff = matchResult.A - matchResult.B;
  let pronoWinner = prono.winner || (pronoDiff > 0 ? 'A' : pronoDiff < 0 ? 'B' : '');
  let resultWinner = matchResult.winner || (resultDiff > 0 ? 'A' : resultDiff < 0 ? 'B' : '');

  let resultPronoWinner = 0;
  let resultPronoDiff = 0;
  let resultPronoScore = 0;
  let resultPronoA = 0;
  let resultPronoB = 0;

  if (pronoWinner === resultWinner) {
    resultPronoWinner += bareme.vainqueur.exact;
    if (pronoWinner === 'A') {
      resultPronoA += bareme.vainqueur.exact;
    } else if (pronoWinner === 'B') {
      resultPronoB += bareme.vainqueur.exact;
    } else {
      resultPronoA += bareme.vainqueur.exact / 2;
      resultPronoB += bareme.vainqueur.exact / 2;
    }
  } else {
    resultPronoWinner += bareme.vainqueur.faux;
    if (pronoWinner === 'A') {
      resultPronoA += bareme.vainqueur.faux;
    } else if (pronoWinner === 'B') {
      resultPronoB += bareme.vainqueur.faux;
    } else {
      resultPronoA += bareme.vainqueur.faux / 2;
      resultPronoB += bareme.vainqueur.faux / 2;
    }
  }

  if (pronoDiff === resultDiff) {
    resultPronoDiff += bareme.diff.exact;
    resultPronoA += bareme.diff.exact / 2;
    resultPronoB += bareme.diff.exact / 2;
  } else if (Math.abs(pronoDiff - resultDiff) === 1) {
    resultPronoDiff += bareme.diff.ecart1;
    resultPronoA += bareme.diff.ecart1 / 2;
    resultPronoB += bareme.diff.ecart1 / 2;
  } else if (Math.abs(pronoDiff - resultDiff) > 2) {
    resultPronoDiff += bareme.diff.faux;
    resultPronoA += bareme.diff.faux / 2;
    resultPronoB += bareme.diff.faux / 2;
  }

  if (prono.A === matchResult.A) {
    resultPronoScore += bareme.score.exact;
    resultPronoA += bareme.score.exact;
  } else if (Math.abs(prono.A - matchResult.A) === 1) {
    resultPronoScore += bareme.score.ecart1;
    resultPronoA += bareme.score.ecart1;
  } else if (Math.abs(prono.A - matchResult.A) === 2) {
    resultPronoScore += bareme.score.ecart2;
    resultPronoA += bareme.score.ecart2;
  } else if (Math.abs(prono.A - matchResult.A) > 2) {
    resultPronoScore += bareme.score.faux;
    resultPronoA += bareme.score.faux;
  }

  if (prono.B === matchResult.B) {
    resultPronoScore += bareme.score.exact;
    resultPronoB += bareme.score.exact;
  } else if (Math.abs(prono.B - matchResult.B) === 1) {
    resultPronoScore += bareme.score.ecart1;
    resultPronoB += bareme.score.ecart1;
  } else if (Math.abs(prono.B - matchResult.B) === 2) {
    resultPronoScore += bareme.score.ecart2;
    resultPronoB += bareme.score.ecart2;
  } else if (Math.abs(prono.B - matchResult.B) > 2) {
    resultPronoScore += bareme.score.faux;
    resultPronoB += bareme.score.faux;
  }

  // {outcome:3, teams:{RUS:1, ARA:2}}
  return {
    outcome: resultPronoWinner + resultPronoDiff + resultPronoScore,
    teams: { [teams.A]: resultPronoA, [teams.B]: resultPronoB },
  };
};

/**
 * Builds a React component for the score of a match.
 * In case of a draw + penalty shootout, the score of the winner is underlined
 * @param {Object} matchResult eg {"A":5,"B":0}
 * @returns a React component for the score of a match
 */
const underline = (matchResult) => {
  if (matchResult.winner) {
    if (matchResult.winner === 'A') {
      return (
        <div style={{ display: 'flex' }}>
          <div className="underline">{matchResult.A}</div>
          <div>-{matchResult.B}</div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex' }}>
        <div>{matchResult.A}-</div>
        <div className="underline">{matchResult.B}</div>
      </div>
    );
  } else {
    return <div style={{ display: 'flex' }}>{`${matchResult.A}-${matchResult.B}`}</div>;
  }
};

export default buildAggregatedResultFromMatches;
