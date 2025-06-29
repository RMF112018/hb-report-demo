// src/renderer/components/BuyoutForm/FinancialsSection.js
// Financials section of the Buyout Form, displaying budget and contract details
// Use within BuyoutForm to render financial fields
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://redux-toolkit.js.org/rtk-query/usage/queries
// *Additional Reference*: https://react.dev/reference/react/memo

import React, { useCallback, useEffect } from 'react';
import { Row, Col, Form } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { SelectField, CurrencyField, useBudgetItems } from 'hb-report';

const FinancialsSection = React.memo(({ control, setValue, projectId, isEditing }) => {
  const { options, isLoading, isError, searchValue, setSearchValue, handleBudgetItemChange } = useBudgetItems(projectId, setValue);

  // Use useWatch to get the current form values
  const [linkToBudgetItem, budget, contractValue] = useWatch({
    control,
    name: ['link_to_budget_item', 'budget', 'contract_value'],
  });

  // Calculate Savings / Overage whenever Budget or Contract Value changes
  useEffect(() => {
    const budgetValue = parseFloat(budget) || 0;
    const contractValueNumber = parseFloat(contractValue) || 0;
    const savingsOverage = budgetValue - contractValueNumber;
    setValue('savings_overage', savingsOverage);
  }, [budget, contractValue, setValue]);

  // Get the current value of Savings / Overage for rendering
  const savingsOverage = useWatch({ control, name: 'savings_overage' });

  const dropdownRender = useCallback(
    (menu) => {
      const filteredOptions = options
        .filter((option) => option.searchText.includes(searchValue.toLowerCase()))
        .slice(0, 5);
      return React.cloneElement(menu, { options: filteredOptions });
    },
    [options, searchValue]
  );

  const renderField = (label, name, renderEditable, value, isCurrency = false) => {
    return (
      <div className="form-field">
        <span className="form-label">{label}</span>
        {isEditing ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="form-input-wrapper">
                {renderEditable(field)}
              </div>
            )}
          />
        ) : (
          <span className="form-value">
            {isCurrency
              ? `$${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : (value != null ? value : 'Undefined')}
          </span>
        )}
      </div>
    );
  };

  // Find the label (cost_code_level_3) for the selected budget item (buyout.budget_item_id)
  const selectedBudgetItemLabel = linkToBudgetItem
    ? options.find(opt => opt.value === linkToBudgetItem)?.label || 'Undefined'
    : 'Undefined';

  return (
    <div id="financials">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12}>
          {renderField(
            'Buyout Budget Line Item',
            'link_to_budget_item',
            (field) => (
              <Form.Item style={{ margin: 0 }}>
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
            ),
            selectedBudgetItemLabel // Display cost_code_level_3
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Contract Value',
            'contract_value',
            (field) => (
              <Form.Item style={{ margin: 0 }}>
                <CurrencyField
                  id="contract_value"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled
                  allowNegative={false}
                />
              </Form.Item>
            ),
            contractValue,
            true
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Budget',
            'budget',
            (field) => (
              <Form.Item style={{ margin: 0 }}>
                <CurrencyField
                  id="budget"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled
                  allowNegative={false}
                />
              </Form.Item>
            ),
            budget,
            true
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Savings / Overage',
            'savings_overage',
            (field) => (
              <Form.Item style={{ margin: 0 }}>
                <CurrencyField
                  id="savings_overage"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={true}
                />
              </Form.Item>
            ),
            savingsOverage,
            true
          )}
        </Col>
      </Row>
    </div>
  );
});

FinancialsSection.propTypes = {
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default FinancialsSection;