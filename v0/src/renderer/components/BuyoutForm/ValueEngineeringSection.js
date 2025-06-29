// src/renderer/components/BuyoutForm/ValueEngineeringSection.js
// Value Engineering section of the Buyout Form, managing value engineering items list
// Use within BuyoutForm to render value engineering fields
// Reference: https://ant.design/components/collapse
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://react.dev/reference/react/memo

import React, { useCallback } from 'react';
import { Table, Row, Col, Button } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, CurrencyField, TextField } from 'hb-report';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const ValueEngineeringSection = React.memo(
  ({ control, veOffered, veFields, appendVe, removeVe, isEditing }) => {
    // Use useWatch to get the current form values
    const formValues = useWatch({
      control,
      name: [
        've_offered',
        'total_ve_presented',
        'total_ve_accepted',
        'total_ve_rejected',
        'net_ve_savings',
        'veItems',
      ],
    });

    const [
      veOfferedValue,
      totalVePresented,
      totalVeAccepted,
      totalVeRejected,
      netVeSavings,
      veItems,
    ] = formValues;

    const handleAddVe = useCallback(() => {
      appendVe({ description: '', value: 0, originalScope: 0, savings: 0 });
    }, [appendVe]);

    const handleRemoveVe = useCallback(
      (index) => {
        removeVe(index);
      },
      [removeVe]
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
                : (value || 'Undefined')}
            </span>
          )}
        </div>
      );
    };

    return (
      <div id="value-engineering">
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12}>
            {renderField(
              'Value Engineering Offered to Owner',
              've_offered',
              (field) => (
                <CheckboxField
                  checked={field.value}
                  onChange={field.onChange}
                />
              ),
              veOfferedValue ? 'Yes' : 'No'
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Total VE Rejected',
              'total_ve_rejected',
              (field) => (
                <CurrencyField
                  id="total_ve_rejected"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={false}
                />
              ),
              totalVeRejected,
              true
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Total VE Presented',
              'total_ve_presented',
              (field) => (
                <CurrencyField
                  id="total_ve_presented"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={false}
                />
              ),
              totalVePresented,
              true
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Net VE Savings',
              'net_ve_savings',
              (field) => (
                <CurrencyField
                  id="net_ve_savings"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={true}
                />
              ),
              netVeSavings,
              true
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderField(
              'Total VE Accepted',
              'total_ve_accepted',
              (field) => (
                <CurrencyField
                  id="total_ve_accepted"
                  value={field.value}
                  onValueChange={field.onChange}
                  allowNegative={false}
                />
              ),
              totalVeAccepted,
              true
            )}
          </Col>
        </Row>

        {/* VE Items Table */}
        {veOfferedValue && (
          <div>
            {veFields.length > 0 && (
              isEditing ? (
                <Table
                  dataSource={veFields}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: 'VE Item Description',
                      render: (_, record, index) => (
                        <Controller
                          name={`veItems[${index}].description`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              id={`veItems-${index}-description`}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="VE Item Description"
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Value',
                      render: (_, record, index) => (
                        <Controller
                          name={`veItems[${index}].value`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyField
                              id={`veItems-${index}-value`}
                              value={field.value}
                              onValueChange={field.onChange}
                              allowNegative={false}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Original Scope',
                      render: (_, record, index) => (
                        <Controller
                          name={`veItems[${index}].originalScope`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyField
                              id={`veItems-${index}-originalScope`}
                              value={field.value}
                              onValueChange={field.onChange}
                              allowNegative={false}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Savings',
                      render: (_, record, index) => (
                        <Controller
                          name={`veItems[${index}].savings`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyField
                              id={`veItems-${index}-savings`}
                              value={field.value}
                              onValueChange={field.onChange}
                              allowNegative={false}
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
                          onClick={() => handleRemoveVe(index)}
                          aria-label="Remove VE item"
                        />
                      ),
                    },
                  ]}
                />
              ) : (
                <Table
                  dataSource={veItems}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: 'VE Item Description',
                      dataIndex: 'description',
                      render: (value) => <span>{value || 'Undefined'}</span>,
                    },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      render: (value) => <span>${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
                    },
                    {
                      title: 'Original Scope',
                      dataIndex: 'originalScope',
                      render: (value) => <span>${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
                    },
                    {
                      title: 'Savings',
                      dataIndex: 'savings',
                      render: (value) => <span>${(value != null ? value : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
                    },
                  ]}
                />
              )
            )}
            {isEditing && (
              <Button
                type="dashed"
                onClick={handleAddVe}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: veFields.length > 0 ? '8px' : '0' }}
              >
                Add VE Item
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

ValueEngineeringSection.propTypes = {
  control: PropTypes.object.isRequired,
  veOffered: PropTypes.bool.isRequired,
  veFields: PropTypes.array.isRequired,
  appendVe: PropTypes.func.isRequired,
  removeVe: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default ValueEngineeringSection;