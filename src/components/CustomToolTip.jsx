import React from 'react';
import PropTypes from 'prop-types';
import '../css/CustomToolTip.css';

// in  Object { Jacques: 39, Nicolas: 38, 'Stéphane': 39, 'Valérie': 31 }
// out Object { Jacques: 1, 'Stéphane': 1, Nicolas: 3, 'Valérie': 4 }
const computeRankings = (totals) => {
  let currentPlace = 0;
  let skippedPlaces = 0;
  let scoreOfThePreviousPlayer = Number.MAX_SAFE_INTEGER;
  return Object.entries(totals)
    .sort(([_a, avalue], [_b, bvalue]) => avalue < bvalue)
    .reduce((ps, [key, value]) => {
      if (value !== scoreOfThePreviousPlayer) {
        currentPlace += 1 + skippedPlaces;
        skippedPlaces = 0;
      } else {
        skippedPlaces += 1;
      }
      scoreOfThePreviousPlayer = value;
      ps[key] = currentPlace;
      return ps;
    }, {});
};

const CustomToolTip = (props) => {
  const { active } = props;

  if (active) {
    const { payload } = props;
    //console.log(payload)
    let currentPlace = 0;
    let skippedPlaces = 0;
    let scoreOfThePreviousPlayer = Number.MAX_SAFE_INTEGER;
    let previousRankings;
    if (payload[0].payload.additionalData) {
      previousRankings = computeRankings(payload[0].payload.additionalData.previousTotals);
    }

    return payload[0].payload.additionalData ? (
      <div className="custom-tooltip">
        <div>{payload[0].payload.additionalData.fullName}</div>
        <table>
          <tbody>
            {payload.sort((a, b) => a.value < b.value).map((pl) => {
              if (pl.value !== scoreOfThePreviousPlayer) {
                currentPlace += 1 + skippedPlaces;
                skippedPlaces = 0;
              } else {
                skippedPlaces += 1;
              }
              scoreOfThePreviousPlayer = pl.value;

              let previousRank = previousRankings[pl.name];
              let rankEvolution;
              if (previousRank === currentPlace) {
                rankEvolution = '=';
              } else if (previousRank > currentPlace) {
                rankEvolution = `+${previousRank - currentPlace}`;
              } else {
                rankEvolution = `-${currentPlace - previousRank}`;
              }

              let pointsEvolution = pl.payload.additionalData.pronosResults[pl.name];

              return (
                <tr className="tooltip-row" style={{ color: pl.color }} key={pl.name}>
                  <td>{currentPlace}</td>
                  <td className="tooltip-rank-evolution-cell">({rankEvolution})</td>
                  <td>{pl.name}</td>
                  <td className="tooltip-points-cell">{pl.value} pts</td>
                  <td>({pointsEvolution < 0 ? pointsEvolution : `+${pointsEvolution}`})</td>
                  <td>{pl.payload.additionalData.rawPronos[pl.name]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : null;
  }

  return null;
};

CustomToolTip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

export default CustomToolTip;
