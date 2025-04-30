// src/renderer/components/formFields/DatePickerField.js
// Reusable date picker field for HB Report forms
// Use in form components for date inputs
// Reference: https://ant.design/components/date-picker
// *Additional Reference*: https://date-fns.org/docs/Getting-Started

import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { parseDate, formatDate } from 'hb-report';
import 'hb-report/styles/FormFields.css';

const DatePickerField = ({ id, value, onChange, disabled, format = 'MM/DD/YYYY' }) => (
  <DatePicker
    id={id}
    className="input"
    format={format}
    value={value ? parseDate(value) : null}
    onChange={(date) => onChange(date ? formatDate(date) : null)}
    disabled={disabled}
  />
);

DatePickerField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  format: PropTypes.string,
};

export default DatePickerField;