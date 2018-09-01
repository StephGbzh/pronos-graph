import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../css/BaremeSubItem.css';

const BaremeSubItem = ({ title }) => {
  return (
    <div className="bareme-sub-item">
      <span className="title">{title}</span>
      <Button bsStyle="primary">-</Button>
      <span className="value">3</span>
      <Button bsStyle="primary">+</Button>
    </div>
  );
};

BaremeSubItem.propTypes = {
  title: PropTypes.string.isRequired,
};

export default BaremeSubItem;
