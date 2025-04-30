// src/renderer/components/formFields/CurrencyField.js
// Reusable currency input field for HB Report forms
// Use in form components for monetary inputs
// Reference: https://s-yadav.github.io/react-number-format/docs/

import React from 'react';
import { Input } from 'antd';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import '../../styles/FormFields.css';

const CurrencyField = ({ id, value, onValueChange, disabled, allowNegative = false, addonAfter }) => (
  <NumericFormat
    id={id}
    className="input"
    customInput={Input}
    thousandSeparator={true}
    prefix={'$'}
    decimalScale={2}
    fixedDecimalScale={true}
    allowNegative={allowNegative}
    value={value ?? ''}
    onValueChange={(values) => onValueChange(values.floatValue)}
    disabled={disabled}
    addonAfter={addonAfter}
  />
);

CurrencyField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number,
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  allowNegative: PropTypes.bool,
  addonAfter: PropTypes.string,
};

export default CurrencyField;