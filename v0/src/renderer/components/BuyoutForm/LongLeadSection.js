// src/renderer/components/BuyoutForm/LongLeadSection.js
// Long Lead Items section of the Buyout Form, managing long lead items list
// Use within BuyoutForm to render long lead items fields
// Reference: https://ant.design/components/collapse
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://react.dev/reference/react/memo

import React, { useCallback } from 'react';
import { Table, Row, Col, Button, Input } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, TextField } from 'hb-report';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const LongLeadSection = React.memo(
  ({ control, longLeadIncluded, leadFields, appendLead, removeLead, isEditing }) => {
    // Use useWatch to get the current form values
    const formValues = useWatch({
      control,
      name: ['long_lead_included', 'leadTimes'],
    });

    const [longLeadIncludedValue, leadTimes] = formValues;

    const handleAddLead = useCallback(() => {
      appendLead({ item: '', time: '', procured: false });
    }, [appendLead]);

    const handleRemoveLead = useCallback(
      (index) => {
        removeLead(index);
      },
      [removeLead]
    );

    const renderField = (label, name, renderEditable, value) => {
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
            <span className="form-value">{value || 'Undefined'}</span>
          )}
        </div>
      );
    };

    return (
      <div id="long-lead-items">
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12}>
            {renderField(
              'Contract Scope Includes Long Lead Items',
              'long_lead_included',
              (field) => (
                <CheckboxField
                  checked={field.value}
                  onChange={field.onChange}
                />
              ),
              longLeadIncludedValue ? 'Yes' : 'No'
            )}
          </Col>
        </Row>

        {/* Long Lead Items Table */}
        {longLeadIncludedValue && (
          <div>
            {leadFields.length > 0 && (
              isEditing ? (
                <Table
                  dataSource={leadFields}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: 'Long Lead Item',
                      render: (_, record, index) => (
                        <Controller
                          name={`leadTimes[${index}].item`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              id={`leadTimes-${index}-item`}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Long Lead Item"
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Time',
                      render: (_, record, index) => (
                        <Controller
                          name={`leadTimes[${index}].time`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id={`leadTimes-${index}-time`}
                              type="number"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      ),
                    },
                    {
                      title: 'Procured',
                      render: (_, record, index) => (
                        <Controller
                          name={`leadTimes[${index}].procured`}
                          control={control}
                          render={({ field }) => (
                            <CheckboxField
                              checked={field.value}
                              onChange={field.onChange}
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
                          onClick={() => handleRemoveLead(index)}
                          aria-label="Remove long lead item"
                        />
                      ),
                    },
                  ]}
                />
              ) : (
                <Table
                  dataSource={leadTimes}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: 'Long Lead Item',
                      dataIndex: 'item',
                      render: (value) => <span>{value || 'Undefined'}</span>,
                    },
                    {
                      title: 'Time',
                      dataIndex: 'time',
                      render: (value) => <span>{value != null && !isNaN(value) ? value : 'Undefined'}</span>,
                    },
                    {
                      title: 'Procured',
                      dataIndex: 'procured',
                      render: (value) => <span>{value ? 'Yes' : 'No'}</span>,
                    },
                  ]}
                />
              )
            )}
            {isEditing && (
              <Button
                type="dashed"
                onClick={handleAddLead}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: leadFields.length > 0 ? '8px' : '0' }}
              >
                Add Long Lead Item
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

LongLeadSection.propTypes = {
  control: PropTypes.object.isRequired,
  longLeadIncluded: PropTypes.bool.isRequired,
  leadFields: PropTypes.array.isRequired,
  appendLead: PropTypes.func.isRequired,
  removeLead: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default LongLeadSection;