import React from 'react';
import PropTypes from 'prop-types';

import BaremeSubItem from './BaremeSubItem';

import '../css/BaremeSettings.css';

export const defaultBareme = {
  vainqueur: { exact: 1, faux: 0 },
  score: { exact: 1, ecart1: 0, ecart2: 0, faux: 0 },
  diff: { exact: 1, ecart1: 0, faux: 0 },
};

const BaremeSettings = ({ bareme, setBaremeValue }) => (
  <div className="bareme-settings">
    <h3>Barème : points par match</h3>
    <div>
      <div>
        <h4>Vainqueur</h4>
        <BaremeSubItem title="Pronostic Exact" setBaremeValue={setBaremeValue} path={['vainqueur', 'exact']} bareme={bareme} />
        <BaremeSubItem title="Pronostic Faux" setBaremeValue={setBaremeValue} path={['vainqueur', 'faux']} bareme={bareme} />
      </div>
      <div>
        <h4>Nombre de buts par équipe</h4>
        <BaremeSubItem title="Pronostic Exact" setBaremeValue={setBaremeValue} path={['score', 'exact']} bareme={bareme} />
        <BaremeSubItem title="Ecart de 1" setBaremeValue={setBaremeValue} path={['score', 'ecart1']} bareme={bareme} />
        <BaremeSubItem title="Ecart de 2" setBaremeValue={setBaremeValue} path={['score', 'ecart2']} bareme={bareme} />
        <BaremeSubItem title="Ecart de 3 ou +" setBaremeValue={setBaremeValue} path={['score', 'faux']} bareme={bareme} />
      </div>
      <div>
        <h4>Différence de buts</h4>
        <BaremeSubItem title="Pronostic Exact" setBaremeValue={setBaremeValue} path={['diff', 'exact']} bareme={bareme} />
        <BaremeSubItem title="Ecart de 1" setBaremeValue={setBaremeValue} path={['diff', 'ecart1']} bareme={bareme} />
        <BaremeSubItem title="Ecart de 2 ou +" setBaremeValue={setBaremeValue} path={['diff', 'faux']} bareme={bareme} />
      </div>
    </div>
  </div>
);

BaremeSettings.propTypes = {
  bareme: PropTypes.object.isRequired,
  setBaremeValue: PropTypes.func.isRequired,
};

export default BaremeSettings;
