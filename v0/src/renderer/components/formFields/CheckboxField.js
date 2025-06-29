// src/renderer/components/formFields/CheckboxField.js
// Reusable checkbox field for HB Report forms
// Use in form components for boolean inputs
// Reference: https://ant.design/components/checkbox

import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import 'hb-report/styles/FormFields.css';

const CheckboxField = ({ id, checked, onChange, disabled }) => (
  <Checkbox
    id={id}
    className="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    disabled={disabled}
  />
);

CheckboxField.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CheckboxField;