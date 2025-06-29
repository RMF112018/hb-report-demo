// src/renderer/components/BuyoutForm/AllowanceSection.js
// Component for the Allowance section of BuyoutForm
// Use within BuyoutForm to render allowance-related fields and table
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://react.dev/reference/react/memo

import React, { useCallback } from 'react';
import { Table, Row, Col, Button } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextField, CurrencyField, SelectField, CheckboxField } from 'hb-report';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const AllowanceSection = React.memo(
  ({ control, allowanceIncluded, allowanceFields, appendAllowance, removeAllowance, isEditing }) => {
    // Use useWatch to get the current form values
    const formValues = useWatch({
      control,
      name: [
        'allowance_included',
        'total_contract_allowances',
        'allowance_reconciliation_total',
        'allowance_variance',
        'allowances',
      ],
    });

    const [
      allowanceIncludedValue,
      totalContractAllowances,
      allowanceReconciliationTotal,
      allowanceVariance,
      allowances,
    ] = formValues;

    const handleAddAllowance = useCallback(() => {
      appendAllowance({ item: '', value: 0, reconciled: false, reconciliation_value: 0, variance: 0 });
    }, [appendAllowance]);

    const handleRemoveAllowance = useCallback(
      (index) => {
        removeAllowance(index);
      },
      [removeAllowance]
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
                : value || 'N/A'}
            </span>
          )}
        </div>
      );
    };

    return (
      <div id="allowances">
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12}>
            {renderField(
              'Allowance Included in Contract',
              'allowance_included',
              (field) => (
                <CheckboxField
                  checked={field.value}
                  onChange={field.onChange}
                />
              ),
              allowanceIncludedValue ? 'Yes' : 'No'
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Reconciliation Total',
              'allowance_reconciliation_total',
              (field) => (
                <CurrencyField
                  id="allowance_reconciliation_total"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={false}
                />
              ),
              allowanceReconciliationTotal,
              true
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Total Contract Allowances',
              'total_contract_allowances',
              (field) => (
                <CurrencyField
                  id="total_contract_allowances"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={false}
                />
              ),
              totalContractAllowances,
              true
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Allowance Variance',
              'allowance_variance',
              (field) => (
                <CurrencyField
                  id="allowance_variance"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={true}
                />
              ),
              allowanceVariance,
              true
            )}
          </Col>
        </Row>

        {/* Allowance Items Table */}
        {allowanceIncludedValue && (
          <div>
            {allowanceFields.length > 0 && (
              isEditing ? (
                <Table
                  dataSource={allowanceFields}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: 'Allowance Item',
                      render: (_, record, index) => (
                        <Controller
                          name={`allowances[${index}].item`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Allowance Item"
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Value',
                      render: (_, record, index) => (
                        <Controller
                          name={`allowances[${index}].value`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyField
                              value={field.value}
                              onValueChange={field.onChange}
                              allowNegative={false}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Reconciled',
                      render: (_, record, index) => (
                        <Controller
                          name={`allowances[${index}].reconciled`}
                          control={control}
                          render={({ field }) => (
                            <SelectField
                              value={field.value ? 'Yes' : 'No'}
                              onChange={(value) => field.onChange(value === 'Yes')}
                              options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Reconciled Value',
                      render: (_, record, index) => (
                        <Controller
                          name={`allowances[${index}].reconciliation_value`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyField
                              value={field.value}
                              onValueChange={field.onChange}
                              allowNegative={false}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Variance',
                      render: (_, record, index) => (
                        <Controller
                          name={`allowances[${index}].variance`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyField
                              value={field.value}
                              onValueChange={field.onChange}
                              allowNegative={true}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: '',
                      render: (_, __, index) => (
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => handleRemoveAllowance(index)}
                          aria-label="Remove allowance"
                        />
                      ),
                    },
                  ]}
                />
              ) : (
                <Table
                  dataSource={allowances}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: 'Allowance Item',
                      dataIndex: 'item',
                      render: (value) => <span>{value || 'N/A'}</span>,
                    },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      render: (value) => <span>${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
                    },
                    {
                      title: 'Reconciled',
                      dataIndex: 'reconciled',
                      render: (value) => <span>{value ? 'Yes' : 'No'}</span>,
                    },
                    {
                      title: 'Reconciled Value',
                      dataIndex: 'reconciliation_value',
                      render: (value) => <span>${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
                    },
                    {
                      title: 'Variance',
                      dataIndex: 'variance',
                      render: (value) => <span>${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
                    },
                  ]}
                />
              )
            )}
            {isEditing && (
              <Button
                type="dashed"
                onClick={handleAddAllowance}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: allowanceFields.length > 0 ? '8px' : '0' }}
              >
                Add Allowance Item
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

AllowanceSection.propTypes = {
  control: PropTypes.object.isRequired,
  allowanceIncluded: PropTypes.bool.isRequired,
  allowanceFields: PropTypes.array.isRequired,
  appendAllowance: PropTypes.func.isRequired,
  removeAllowance: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default AllowanceSection;