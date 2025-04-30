// src/renderer/components/BuyoutForm/AllowanceSection.js
import React from 'react';
import { Collapse, Table, Row, Col, Button } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextField, CurrencyField, SelectField, CheckboxField } from 'hb-report';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import 'hb-report/styles/BuyoutForm.css';

const AllowanceSection = ({ control, allowanceIncluded, allowanceFields, appendAllowance, removeAllowance }) => (
  <div id="allowances">
    <Collapse
      items={[
        {
          key: '1',
          label: 'Contract Allowances',
          children: (
            <div className="sectionCard">
              {/* Scalar Fields */}
              <Row gutter={[16, 8]} align="middle">
                <Col span={12}>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Allowance Included in Contract</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="allowance_included"
                        control={control}
                        render={({ field }) => (
                          <CheckboxField checked={field.value} onChange={field.onChange} />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Total Contract Allowances</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="total_contract_allowances"
                        control={control}
                        render={({ field }) => (
                          <CurrencyField
                            id="total_contract_allowances"
                            value={field.value}
                            onValueChange={field.onChange}
                            allowNegative={false}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Reconciliation Total</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="allowance_reconciliation_total"
                        control={control}
                        render={({ field }) => (
                          <CurrencyField
                            id="allowance_reconciliation_total"
                            value={field.value}
                            onValueChange={field.onChange}
                            allowNegative={false}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Allowance Variance</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="allowance_variance"
                        control={control}
                        render={({ field }) => (
                          <CurrencyField
                            id="allowance_variance"
                            value={field.value}
                            onValueChange={field.onChange}
                            allowNegative={true}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Allowance Items Table */}
              {allowanceIncluded && (
                <div className="tableContainer">
                  {allowanceFields.length > 0 && (
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
                              onClick={() => removeAllowance(index)}
                              aria-label="Remove allowance"
                            />
                          ),
                        },
                      ]}
                    />
                  )}
                  <Button
                    type="dashed"
                    onClick={() => appendAllowance({ item: '', value: 0, reconciled: false, reconciliation_value: 0, variance: 0 })}
                    block
                    icon={<PlusOutlined />}
                    className="addButton"
                  >
                    Add Allowance Item
                  </Button>
                </div>
              )}
            </div>
          ),
        },
      ]}
      defaultActiveKey={['1']}
      className="collapse"
    />
  </div>
);

AllowanceSection.propTypes = {
  control: PropTypes.object.isRequired,
  allowanceIncluded: PropTypes.bool.isRequired,
  allowanceFields: PropTypes.array.isRequired,
  appendAllowance: PropTypes.func.isRequired,
  removeAllowance: PropTypes.func.isRequired,
};

export default AllowanceSection;