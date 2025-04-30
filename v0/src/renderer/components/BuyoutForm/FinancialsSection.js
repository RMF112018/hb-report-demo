// src/renderer/components/BuyoutForm/FinancialsSection.js
// Financials section of the Buyout Form, displaying budget and contract details
// Use within BuyoutForm to render financial fields
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://redux-toolkit.js.org/rtk-query/usage/queries

import React from 'react';
import { Row, Col, Form } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { SelectField, CurrencyField, useBudgetItems } from 'hb-report';
import 'hb-report/styles/BuyoutForm.css';

const FinancialsSection = ({ control, setValue, projectId }) => {
  const { options, isLoading, isError, searchValue, setSearchValue, handleBudgetItemChange } = useBudgetItems(projectId, setValue);

  const dropdownRender = (menu) => {
    const filteredOptions = options
      .filter((option) => option.searchText.includes(searchValue.toLowerCase()))
      .slice(0, 5);
    return React.cloneElement(menu, { options: filteredOptions });
  };

  return (
    <div id="financials" className="sectionCard">
      <h3 className="sectionTitle">Financials</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Buyout Budget Line Item</span>
            </Col>
            <Col span={14}>
              <Controller
                name="link_to_budget_item"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="link_to_budget_item"
                      value={field.value ? String(field.value) : undefined}
                      onChange={(value) => {
                        field.onChange(value);
                        handleBudgetItemChange(value);
                      }}
                      options={options}
                      showSearch
                      onSearch={setSearchValue}
                      dropdownRender={dropdownRender}
                      placeholder={
                        isLoading
                          ? 'Loading...'
                          : isError
                            ? 'Error loading budget items'
                            : options.length === 0
                              ? 'No budget items available - sync project budget'
                              : 'Select a budget line item'
                      }
                      filterOption={false}
                      notFoundContent={
                        options.length === 0 && !isLoading && !isError
                          ? 'No budget items found. Please sync the project budget.'
                          : null
                      }
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Budget</span>
            </Col>
            <Col span={14}>
              <Controller
                name="budget"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <CurrencyField
                      id="budget"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                      allowNegative={false}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Contract Value</span>
            </Col>
            <Col span={14}>
              <Controller
                name="contract_value"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <CurrencyField
                      id="contract_value"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                      allowNegative={false}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Savings / Overage</span>
            </Col>
            <Col span={14}>
              <Controller
                name="savings_overage"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <CurrencyField
                      id="savings_overage"
                      value={field.value}
                      onValueChange={field.onChange}
                      allowNegative={true}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

FinancialsSection.propTypes = {
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default FinancialsSection;