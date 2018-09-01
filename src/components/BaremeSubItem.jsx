import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../css/BaremeSubItem.css';

const BaremeSubItem = ({ title, setBaremeValue, path: [a, b], bareme }) => {
  return (
    <div className="bareme-sub-item">
      <span className="title">{title}</span>
      <Button bsStyle="primary" onClick={(_) => setBaremeValue(a, b, false)}>
        -
      </Button>
      <div className="value">{bareme[a][b]}</div>
      <Button bsStyle="primary" onClick={(_) => setBaremeValue(a, b, true)}>
        +
      </Button>
    </div>
  );
};

BaremeSubItem.propTypes = {
  title: PropTypes.string.isRequired,
  setBaremeValue: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  bareme: PropTypes.object.isRequired,
};

export default BaremeSubItem;
