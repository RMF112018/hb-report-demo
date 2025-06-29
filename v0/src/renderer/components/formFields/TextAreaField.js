// src/renderer/components/formFields/TextAreaField.js
// Reusable text area field for HB Report forms
// Use in form components for multi-line text inputs
// Reference: https://ant.design/components/input

import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import 'hb-report/styles/FormFields.css';

const TextAreaField = ({ id, value, onChange, rows, placeholder, disabled }) => (
  <Input.TextArea
    id={id}
    className="input"
    value={value || ''}
    onChange={onChange}
    rows={rows}
    placeholder={placeholder}
    disabled={disabled}
  />
);

TextAreaField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

TextAreaField.defaultProps = {
  rows: 4,
};

export default TextAreaField;