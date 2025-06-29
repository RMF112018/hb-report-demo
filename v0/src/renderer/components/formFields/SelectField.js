// src/renderer/components/formFields/SelectField.js
import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import 'hb-report/styles/FormFields.css';

const SelectField = ({ id, value, onChange, options, placeholder, showSearch, onSearch, dropdownRender, filterOption, notFoundContent }) => (
  <Select
    id={id}
    className="input"
    value={value}
    onChange={onChange}
    options={options}
    placeholder={placeholder}
    showSearch={showSearch}
    onSearch={onSearch}
    dropdownRender={dropdownRender}
    filterOption={filterOption}
    notFoundContent={notFoundContent}
  />
);

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  })),
  placeholder: PropTypes.string,
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  dropdownRender: PropTypes.func,
  filterOption: PropTypes.bool,
  notFoundContent: PropTypes.node,
};

export default SelectField;