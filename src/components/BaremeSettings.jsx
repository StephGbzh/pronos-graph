import React from 'react';

import BaremeSubItem from './BaremeSubItem';

const BaremeSettings = () => (
  <div>
    <h2>Barème de points par pronostic</h2>
    <div>
      <h3>Vainqueur</h3>
      <BaremeSubItem title="Exact" />
      <BaremeSubItem title="Faux" />
    </div>
  </div>
);

export default BaremeSettings;
