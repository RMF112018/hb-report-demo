// src/renderer/components/formFields/TextField.js
// Reusable text input field for HB Report forms
// Use in form components to standardize input fields
// Reference: https://ant.design/components/input

import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import '../../styles/FormFields.css';

const TextField = ({ id, value, onChange, readOnly, onDoubleClick, onBlur, placeholder }) => (
  <Input
    id={id}
    className="input"
    value={value || ''}
    onChange={onChange}
    readOnly={readOnly}
    onDoubleClick={onDoubleClick}
    onBlur={onBlur}
    placeholder={placeholder}
  />
);

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  onDoubleClick: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
};

export default TextField;