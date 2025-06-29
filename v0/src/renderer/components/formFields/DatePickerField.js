// src/renderer/components/formFields/DatePickerField.js
// Reusable date picker field for HB Report forms
// Use in form components for date inputs with react-hook-form
// Reference: https://ant.design/components/date-picker
// *Additional Reference*: https://react-hook-form.com/api/usecontroller
// *Additional Reference*: https://day.js.org/docs/en/display/format

import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import { Controller } from 'react-hook-form';
import 'hb-report/styles/FormFields.css';

const DatePickerField = ({ name, control, label, rules, disabled, format = 'MM/DD/YYYY' }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="form-field">
          {label && <label htmlFor={name}>{label}</label>}
          <DatePicker
            {...field}
            id={name}
            className="input"
            format={format}
            value={field.value} // Day.js object or null
            onChange={(date) => field.onChange(date ? date : null)} // Store Day.js object
            disabled={disabled}
            status={error ? 'error' : undefined}
            style={{ width: '100%' }}
          />
          {error && (
            <span className="error-message" style={{ color: 'red', fontSize: '12px' }}>
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

DatePickerField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool,
  format: PropTypes.string,
};

export default DatePickerField;