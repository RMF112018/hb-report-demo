// src/renderer/components/BuyoutForm.js
// Component for creating or editing buyout records in HB Report, used within Buyout.js
// Import this component in Buyout.js to render within the main content area for adding or modifying buyout records
// Reference: https://ant.design/components/form/
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://momentjs.com/docs/
// *Additional Reference*: https://s-yadav.github.io/react-number-format/docs/
// *Additional Reference*: https://ant.design/components/float-button
// *Additional Reference*: https://ant.design/components/layout
// *Additional Reference*: https://ant.design/components/steps

import React, { useEffect, useState } from 'react';
import { Layout, Form, Input, Select, Checkbox, DatePicker, Divider, Collapse, Row, Col, FloatButton, Tooltip, Steps, Tabs, Timeline } from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import moment from 'moment';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import '../styles/global.css';
import '../styles/Components.css';

const { Sider, Content } = Layout;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

/**
 * General Information section of the Buyout Form, using a two-column layout for better space utilization
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @returns {JSX.Element} General Information form section
 */
const GeneralInformationSection = ({ control }) => (
  <div
    id="general-information"
    style={{
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}
  >
    <div className="section-card">
      <h3
        style={{
          color: 'var(--hb-blue)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        General Information
      </h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Contract #
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="number"
                control={control}
                rules={{ required: 'Contract # is required' }}
                render={({ field, fieldState }) => (
                  <Form.Item
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input
                      id="contract-number"
                      {...field}
                      placeholder="1699901-001"
                      style={{ width: '300px' }}
                      aria-required="true"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Contract Company
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="vendor"
                control={control}
                rules={{ required: 'Contract Company is required' }}
                render={({ field, fieldState }) => (
                  <Form.Item
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Select
                      id="vendor"
                      {...field}
                      placeholder="Select a company"
                      style={{ width: '300px' }}
                      aria-required="true"
                    >
                      <Option value="hedrick">Hedrick Brothers Construction Co., Inc</Option>
                      <Option value="jbanks">J. Banks Design Group</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Title
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="title"
                      {...field}
                      placeholder="Structural Shell"
                      style={{ width: '300px' }}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Status
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="status"
                      {...field}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="DRAFT">DRAFT</Option>
                      <Option value="APPROVED">APPROVED</Option>
                      <Option value="OUT_FOR_SIGNATURE">DRAFT OUT FOR SIGNATURE</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Executed
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="executed"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Def. Retainage
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="retainage_percent"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="retainage_percent"
                      {...field}
                      addonAfter="%"
                      type="number"
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </div>
);

/**
 * Buyout Workflow section of the Buyout Form, using a two-column layout for date fields
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @returns {JSX.Element} Buyout Workflow form section
 */
const BuyoutWorkflowSection = ({ control }) => (
  <div id="buyout-workflow" style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h2 style={{ color: 'var(--hb-blue)', fontSize: '22px', marginBottom: '16px' }}>Buyout Workflow</h2>
    <Row gutter={[16, 8]}>
      <Col span={12}>
        <Controller
          name="contract_start_date"
          control={control}
          render={({ field }) => (
            <Form.Item label="Start Date" htmlFor="contract_start_date">
              <DatePicker
                id="contract_start_date"
                format="MM/DD/YYYY"
                value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        />
        <Controller
          name="contract_estimated_completion_date"
          control={control}
          render={({ field }) => (
            <Form.Item label="Estimated Completion Date" htmlFor="contract_estimated_completion_date">
              <DatePicker
                id="contract_estimated_completion_date"
                format="MM/DD/YYYY"
                value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        />
        <Controller
          name="actual_completion_date"
          control={control}
          render={({ field }) => (
            <Form.Item label="Actual Completion Date" htmlFor="actual_completion_date">
              <DatePicker
                id="actual_completion_date"
                format="MM/DD/YYYY"
                value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        />
      </Col>
      <Col span={12}>
        <Controller
          name="contract_date"
          control={control}
          render={({ field }) => (
            <Form.Item label="Contract Date" htmlFor="contract_date">
              <DatePicker
                id="contract_date"
                format="MM/DD/YYYY"
                value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        />
        <Controller
          name="signed_contract_received_date"
          control={control}
          render={({ field }) => (
            <Form.Item label="Signed Contract Received Date" htmlFor="signed_contract_received_date">
              <DatePicker
                id="signed_contract_received_date"
                format="MM/DD/YYYY"
                value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        />
        <Controller
          name="issued_on_date"
          control={control}
          render={({ field }) => (
            <Form.Item label="Issued On Date" htmlFor="issued_on_date">
              <DatePicker
                id="issued_on_date"
                format="MM/DD/YYYY"
                value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        />
      </Col>
    </Row>
  </div>
);

/**
 * Owner Approval section of the Buyout Form, using a two-column layout for related fields
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @returns {JSX.Element} Owner Approval form section
 */
const OwnerApprovalSection = ({ control }) => (
  <div id="owner-approval">
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
      <Panel header="Owner Approval Details" key="1">
        <div className="section-card">
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Owner Approval Required
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="owner_approval_required"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Approval Status
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="owner_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Select
                          id="owner_approval_status"
                          placeholder="Select status"
                          style={{ width: '300px' }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          <Option value="Pending">Pending</Option>
                          <Option value="Approved">Approved</Option>
                          <Option value="Rejected">Rejected</Option>
                        </Select>
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Approval Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="owner_approval_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="owner_approval_date"
                          format="MM/DD/YYYY"
                          style={{ width: '300px' }}
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
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
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Owner Meeting Required
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="owner_meeting_required"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Meeting Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="owner_meeting_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="owner_meeting_date"
                          format="MM/DD/YYYY"
                          style={{ width: '300px' }}
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Panel>
    </Collapse>
  </div>
);

/**
 * Allowance section of the Buyout Form, using a two-column layout for totals and dynamic list for items
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @param {boolean} props.allowanceIncluded - Whether allowances are included
 * @param {Array} props.allowanceFields - Fields for the allowances list
 * @param {Function} props.appendAllowance - Function to append a new allowance
 * @param {Function} props.removeAllowance - Function to remove an allowance
 * @returns {JSX.Element} Allowance form section
 */
const AllowanceSection = ({ control, allowanceIncluded, allowanceFields, appendAllowance, removeAllowance }) => (
  <div id="allowances">
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
      <Panel header="Contract Allowances" key="1">
        <div className="section-card">
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Allowance Included in Contract
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="allowance_included"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Total Contract Allowances
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_contract_allowances"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="total_contract_allowances"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={false}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
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
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Reconciliation Total
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="allowance_reconciliation_total"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="allowance_reconciliation_total"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={false}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Allowance Variance
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="allowance_variance"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="allowance_variance"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={true}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {allowanceIncluded && (
            <div style={{ marginTop: '24px' }}>
              {allowanceFields.map((field, index) => (
                <Row key={field.id} gutter={[16, 8]} align="middle" style={{ marginBottom: '8px' }}>
                  <Col span={8}>
                    <Controller
                      name={`allowances[${index}].description`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field: descField, fieldState }) => (
                        <Form.Item
                          label="Allowance Description"
                          validateStatus={fieldState.error ? 'error' : ''}
                          help={fieldState.error?.message}
                          htmlFor={`allowances-${index}-description`}
                        >
                          <Input
                            id={`allowances-${index}-description`}
                            {...descField}
                            placeholder="Allowance Description"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={5}>
                    <Controller
                      name={`allowances[${index}].value`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <Form.Item label="Value" htmlFor={`allowances-${index}-value`}>
                          <NumericFormat
                            id={`allowances-${index}-value`}
                            thousandSeparator={true}
                            prefix={'$'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={Input}
                            style={{ width: '100%' }}
                            value={field.value}
                            onValueChange={(values) => field.onChange(values.floatValue)}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                          Reconciled
                        </span>
                      </Col>
                      <Col span={14}>
                        <Controller
                          name={`allowances[${index}].reconciled`}
                          control={control}
                          render={({ field }) => (
                            <Form.Item>
                              <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            </Form.Item>
                          )}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                          Reconciliation Value
                        </span>
                      </Col>
                      <Col span={14}>
                        <Controller
                          name={`allowances[${index}].reconciliationValue`}
                          control={control}
                          render={({ field }) => (
                            <Form.Item>
                              <NumericFormat
                                id={`allowances-${index}-reconciliationValue`}
                                thousandSeparator={true}
                                prefix={'$'}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                customInput={Input}
                                style={{ width: '300px' }}
                                value={field.value}
                                onValueChange={(values) => field.onChange(values.floatValue)}
                              />
                            </Form.Item>
                          )}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={3}>
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeAllowance(index)}
                      aria-label="Remove allowance"
                      style={{ marginTop: '8px' }}
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => appendAllowance({ description: '', value: 0, reconciled: false, reconciliationValue: 0 })}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: '8px' }}
              >
                Add Allowance Item
              </Button>
            </div>
          )}
        </div>
      </Panel>
    </Collapse>
  </div>
);

/**
 * Value Engineering section of the Buyout Form, using a two-column layout for totals and dynamic list for items
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @param {boolean} props.veOffered - Whether value engineering is offered
 * @param {Array} props.veFields - Fields for the value engineering items list
 * @param {Function} props.appendVe - Function to append a new VE item
 * @param {Function} props.removeVe - Function to remove a VE item
 * @returns {JSX.Element} Value Engineering form section
 */
const ValueEngineeringSection = ({ control, veOffered, veFields, appendVe, removeVe }) => (
  <div id="value-engineering">
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
      <Panel header="Value Engineering" key="1">
        <div className="section-card">
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Value Engineering Offered to Owner
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="ve_offered"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Total VE Presented
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_ve_presented"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="total_ve_presented"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={false}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Total VE Accepted
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_ve_accepted"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="total_ve_accepted"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={false}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
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
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Total VE Rejected
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_ve_rejected"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="total_ve_rejected"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={false}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Net VE Savings
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="net_ve_savings"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <NumericFormat
                          id="net_ve_savings"
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          allowNegative={true}
                          customInput={Input}
                          style={{ width: '300px' }}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {veOffered && (
            <div style={{ marginTop: '24px' }}>
              {veFields.map((field, index) => (
                <Row key={field.id} gutter={[16, 8]} align="middle" style={{ marginBottom: '8px' }}>
                  <Col span={8}>
                    <Controller
                      name={`veItems[${index}].description`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field: descField, fieldState }) => (
                        <Form.Item
                          label="VE Item Description"
                          validateStatus={fieldState.error ? 'error' : ''}
                          help={fieldState.error?.message}
                          htmlFor={`veItems-${index}-description`}
                        >
                          <Input
                            id={`veItems-${index}-description`}
                            {...descField}
                            placeholder="VE Item Description"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={5}>
                    <Controller
                      name={`veItems[${index}].value`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <Form.Item label="Value" htmlFor={`veItems-${index}-value`}>
                          <NumericFormat
                            id={`veItems-${index}-value`}
                            thousandSeparator={true}
                            prefix={'$'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            customInput={Input}
                            style={{ width: '100%' }}
                            value={field.value}
                            onValueChange={(values) => field.onChange(values.floatValue)}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                          Original Scope
                        </span>
                      </Col>
                      <Col span={14}>
                        <Controller
                          name={`veItems[${index}].originalScope`}
                          control={control}
                          render={({ field }) => (
                            <Form.Item>
                              <NumericFormat
                                id={`veItems-${index}-originalScope`}
                                thousandSeparator={true}
                                prefix={'$'}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                customInput={Input}
                                style={{ width: '300px' }}
                                value={field.value}
                                onValueChange={(values) => field.onChange(values.floatValue)}
                              />
                            </Form.Item>
                          )}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                          Savings
                        </span>
                      </Col>
                      <Col span={14}>
                        <Controller
                          name={`veItems[${index}].savings`}
                          control={control}
                          render={({ field }) => (
                            <Form.Item>
                              <NumericFormat
                                id={`veItems-${index}-savings`}
                                thousandSeparator={true}
                                prefix={'$'}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                customInput={Input}
                                style={{ width: '300px' }}
                                value={field.value}
                                onValueChange={(values) => field.onChange(values.floatValue)}
                              />
                            </Form.Item>
                          )}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={3}>
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeVe(index)}
                      aria-label="Remove VE item"
                      style={{ marginTop: '8px' }}
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => appendVe({ description: '', value: 0, originalScope: 0, savings: 0 })}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: '8px' }}
              >
                Add VE Item
              </Button>
            </div>
          )}
        </div>
      </Panel>
    </Collapse>
  </div>
);

/**
 * Long Lead Items section of the Buyout Form, using a single-column layout for checkbox and dynamic list for items
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @param {boolean} props.longLeadIncluded - Whether long lead items are included
 * @param {Array} props.leadFields - Fields for the long lead items list
 * @param {Function} props.appendLead - Function to append a new long lead item
 * @param {Function} props.removeLead - Function to remove a long lead item
 * @returns {JSX.Element} Long Lead Items form section
 */
const LongLeadSection = ({ control, longLeadIncluded, leadFields, appendLead, removeLead }) => (
  <div id="long-lead-items">
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
      <Panel header="Long Lead Items" key="1">
        <div className="section-card">
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Contract Scope Includes Long Lead Items
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="long_lead_included"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {longLeadIncluded && (
            <div style={{ marginTop: '24px' }}>
              {leadFields.map((field, index) => (
                <Row key={field.id} gutter={[16, 8]} align="middle" style={{ marginBottom: '8px' }}>
                  <Col span={8}>
                    <Controller
                      name={`leadTimes[${index}].item`}
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field: itemField, fieldState }) => (
                        <Form.Item
                          label="Long Lead Item"
                          validateStatus={fieldState.error ? 'error' : ''}
                          help={fieldState.error?.message}
                          htmlFor={`leadTimes-${index}-item`}
                        >
                          <Input
                            id={`leadTimes-${index}-item`}
                            {...itemField}
                            placeholder="Long Lead Item"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={5}>
                    <Controller
                      name={`leadTimes[${index}].time`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item label="Lead Time" htmlFor={`leadTimes-${index}-time`}>
                          <Input
                            id={`leadTimes-${index}-time`}
                            type="number"
                            style={{ width: '100%' }}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                          Procured
                        </span>
                      </Col>
                      <Col span={14}>
                        <Controller
                          name={`leadTimes[${index}].procured`}
                          control={control}
                          render={({ field }) => (
                            <Form.Item>
                              <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            </Form.Item>
                          )}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={3}>
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeLead(index)}
                      aria-label="Remove long lead item"
                      style={{ marginTop: '8px' }}
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => appendLead({ item: '', time: '', procured: false })}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: '8px' }}
              >
                Add Long Lead Item
              </Button>
            </div>
          )}
        </div>
      </Panel>
    </Collapse>
  </div>
);

/**
 * Financials section of the Buyout Form, using a two-column layout for financial fields
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @param {Function} props.watch - React Hook Form watch function
 * @param {Function} props.setValue - React Hook Form setValue function
 * @returns {JSX.Element} Financials form section
 */
const FinancialsSection = ({ control, watch, setValue }) => {
  const budgetSuggestions = [
    { value: '01-07-112 - CAULKING', budgetId: 1, revisedBudgetAmount: 1000 },
    { value: '03-00-00 - CONCRETE', budgetId: 2, revisedBudgetAmount: 5000 },
  ];

  return (
    <div
      id="financials"
      style={{
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div className="section-card">
        <h3
          style={{
            color: 'var(--hb-blue)',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          Financials
        </h3>
        <Row gutter={[16, 8]} align="middle">
          <Col span={12}>
            <Row gutter={[16, 0]} align="middle">
              <Col span={10}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  Link to Budget Item
                </span>
              </Col>
              <Col span={14}>
                <Controller
                  name="link_to_budget_item"
                  control={control}
                  render={({ field }) => (
                    <Form.Item>
                      <Select
                        id="link_to_budget_item"
                        showSearch
                        placeholder="Search budget item"
                        optionFilterProp="children"
                        value={field.value}
                        onChange={(value) => {
                          const budget = budgetSuggestions.find(s => s.value === value);
                          field.onChange(value);
                          setValue('budget', budget ? budget.revisedBudgetAmount : 0);
                          const contractValue = watch('contract_value');
                          setValue('savings_overage', (budget ? budget.revisedBudgetAmount : 0) - (contractValue || 0));
                        }}
                        style={{ width: '300px' }}
                      >
                        {budgetSuggestions.map(suggestion => (
                          <Option key={suggestion.value} value={suggestion.value}>{suggestion.value}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]} align="middle">
              <Col span={10}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  Budget
                </span>
              </Col>
              <Col span={14}>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <Form.Item>
                      <NumericFormat
                        id="budget"
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        allowNegative={false}
                        customInput={Input}
                        style={{ width: '300px' }}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue);
                          const contractValue = watch('contract_value');
                          setValue('savings_overage', (values.floatValue || 0) - (contractValue || 0));
                        }}
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
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  Contract Value
                </span>
              </Col>
              <Col span={14}>
                <Controller
                  name="contract_value"
                  control={control}
                  render={({ field }) => (
                    <Form.Item>
                      <NumericFormat
                        id="contract_value"
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        allowNegative={false}
                        customInput={Input}
                        style={{ width: '300px' }}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue);
                          const budget = watch('budget');
                          setValue('savings_overage', (budget || 0) - (values.floatValue || 0));
                        }}
                      />
                    </Form.Item>
                  )}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]} align="middle">
              <Col span={10}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  Savings / Overage
                </span>
              </Col>
              <Col span={14}>
                <Controller
                  name="savings_overage"
                  control={control}
                  render={({ field }) => (
                    <Form.Item>
                      <NumericFormat
                        id="savings_overage"
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        allowNegative={true}
                        customInput={Input}
                        style={{ width: '300px' }}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </Form.Item>
                  )}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

/**
 * Contract Workflow section of the Buyout Form, using a Timeline layout to track the workflow
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @returns {JSX.Element} Contract Workflow form section
 */
const ContractWorkflowSection = ({ control }) => (
  <div
    id="contract-workflow"
    style={{
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}
  >
    <Timeline>
      <Timeline.Item>
        <div className="section-card">
          <h3
            style={{
              color: 'var(--hb-blue)',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            Scope Review Meeting
          </h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Scope Review Meeting Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="scope_review_meeting_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="scope_review_meeting_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Timeline.Item>

      <Timeline.Item>
        <div className="section-card">
          <h3
            style={{
              color: 'var(--hb-blue)',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            Contract Review and Approval Dates
          </h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    SPM Review Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="spm_review_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="spm_review_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    SPM Approval Status
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="spm_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Select
                          id="spm_approval_status"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ width: '300px' }}
                          placeholder="Select status"
                        >
                          <Option value="Approved">Approved</Option>
                          <Option value="Disapproved">Disapproved</Option>
                        </Select>
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    PX Review Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="px_review_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="px_review_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.spm_review_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    PX Approval Status
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="px_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Select
                          id="px_approval_status"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ width: '300px' }}
                          placeholder="Select status"
                          disabled={!control._formValues.spm_review_date}
                        >
                          <Option value="Approved">Approved</Option>
                          <Option value="Disapproved">Disapproved</Option>
                        </Select>
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    VP Review Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="vp_review_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="vp_review_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.px_review_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    VP Approval Status
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="vp_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <Select
                          id="vp_approval_status"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ width: '300px' }}
                          placeholder="Select status"
                          disabled={!control._formValues.px_review_date}
                        >
                          <Option value="Approved">Approved</Option>
                          <Option value="Disapproved">Disapproved</Option>
                        </Select>
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Timeline.Item>

      <Timeline.Item>
        <div className="section-card">
          <h3
            style={{
              color: 'var(--hb-blue)',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            Contract Execution Dates
          </h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Contract Award Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="contract_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="contract_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    LOI Sent
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="loi_sent_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="loi_sent_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.contract_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    LOI Returned
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="loi_returned_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="loi_returned_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.loi_sent_date}
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
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Subcontract Agreement Sent
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="subcontract_agreement_sent_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="subcontract_agreement_sent_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.loi_returned_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Fully Executed by HBC
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="signed_contract_received_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="signed_contract_received_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.subcontract_agreement_sent_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Fully Executed Sent to Subcontractor
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="fully_executed_sent_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="fully_executed_sent_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.signed_contract_received_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Timeline.Item>

      <Timeline.Item>
        <div className="section-card">
          <h3
            style={{
              color: 'var(--hb-blue)',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            Project Timeline
          </h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Start Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="contract_start_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="contract_start_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Estimated Completion Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="contract_estimated_completion_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="contract_estimated_completion_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.contract_start_date}
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
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Actual Completion Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="actual_completion_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="actual_completion_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.contract_estimated_completion_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                    Issued On Date
                  </span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="issued_on_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePicker
                          id="issued_on_date"
                          format="MM/DD/YYYY"
                          value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                          onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                          style={{ width: '300px' }}
                          disabled={!control._formValues.actual_completion_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Timeline.Item>
    </Timeline>
  </div>
);

/**
 * Subcontract Checklist section of the Buyout Form, tracking the status of requirements prior to issuance of a subcontract agreement
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @returns {JSX.Element} Subcontract Checklist form section
 */
const SubcontractChecklistSection = ({ control }) => (
  <div
    id="subcontract-checklist"
    style={{
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}
  >
    <div className="section-card">
      <h3
        style={{
          color: 'var(--hb-blue)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        Subcontract Checklist
      </h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Contract
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="contract_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="contract_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Schedule A (General Conditions)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="schedule_a_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="schedule_a_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Schedule B (Scope of Work)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="schedule_b_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="schedule_b_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Exhibit A (Drawings)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibit_a_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="exhibit_a_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Exhibit B (Project Schedule)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibit_b_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="exhibit_b_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Exhibit I (OCIP Addendum)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibit_i_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="exhibit_i_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Labor Rates
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="labor_rates_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="labor_rates_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Unit Rates
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="unit_rates_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="unit_rates_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Exhibits
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibits_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="exhibits_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Schedule of Values
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="schedule_of_values_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="schedule_of_values_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                P&P Bond
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="p_and_p_bond_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="p_and_p_bond_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                W-9
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="w_9_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="w_9_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                License
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="license_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="license_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Insurance - General Liability
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_general_liability_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="insurance_general_liability_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Insurance - Auto
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_auto_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="insurance_auto_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Insurance - Umbrella Liability
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_umbrella_liability_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="insurance_umbrella_liability_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Insurance - Workers Comp
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_workers_comp_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="insurance_workers_comp_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Special Requirements (See Reverse)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="special_requirements_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="special_requirements_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Compliance Manager (approved compliance)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="compliance_manager_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="compliance_manager_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Scanned & Returned to Sub
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="scanned_returned_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="scanned_returned_status"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select status"
                    >
                      <Option value="NR">Not Required</Option>
                      <Option value="P">Pending (required, in progress)</Option>
                      <Option value="Y">Yes (received)</Option>
                      <Option value="N">No (required, not received)</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: '24px 0' }} />
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                PX
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="px"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="px"
                      {...field}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                PM
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="pm"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="pm"
                      {...field}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                PA
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="pa"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="pa"
                      {...field}
                      style={{ width: '300px' }}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Compliance Manager
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="compliance_manager"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="compliance_manager"
                      {...field}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: '24px 0' }} />
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={5}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Additional Notes / Comments
              </span>
            </Col>
            <Col span={19}>
              <Controller
                name="additional_notes_comments"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="additional_notes_comments"
                      {...field}
                      rows={4}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </div>
);

/**
 * Compliance Waiver section of the Buyout Form, allowing project leaders to request waivers for specific compliance requirements
 * @param {Object} props - Component props
 * @param {Object} props.control - React Hook Form control object
 * @returns {JSX.Element} Compliance Waiver form section
 */
const ComplianceWaiverSection = ({ control }) => (
  <div
    id="compliance-waiver"
    style={{
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}
  >
    <div className="section-card">
      <h3
        style={{
          color: 'var(--hb-blue)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        Request for Reduction or Waiver of Insurance Requirements
      </h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                What insurance requirements are to be waived or reduced? (select all that apply)
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_requirements_to_waive"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Checkbox.Group
                      id="insurance_requirements_to_waive"
                      {...field}
                      options={[
                        { label: 'General Liability', value: 'general_liability' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'Umbrella', value: 'umbrella' },
                        { label: 'Workers Comp', value: 'workers_comp' },
                        { label: 'Professional Liability', value: 'professional_liability' },
                      ]}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Explain:
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_explanation"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="insurance_explanation"
                      {...field}
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Why increased risk is justified?
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_risk_justification"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="insurance_risk_justification"
                      {...field}
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                What actions will be taken to reduce risk?
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_risk_reduction_actions"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="insurance_risk_reduction_actions"
                      {...field}
                      rows={3}
                      style={{ width: '100%' }}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                The above waiver is to be addressed at a:
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_waiver_level"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="insurance_waiver_level"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select level"
                    >
                      <Option value="project">Project Level</Option>
                      <Option value="global">Global Level</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <Divider style={{ margin: '24px 0' }} />

    <div className="section-card">
      <h3
        style={{
          color: 'var(--hb-blue)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        Request for Waiver of Licensing Requirements
      </h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                What licensing requirements are to be waived?
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_requirements_to_waive"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Checkbox.Group
                      id="licensing_requirements_to_waive"
                      {...field}
                      options={[
                        { label: 'State', value: 'state' },
                        { label: 'Local', value: 'local' },
                      ]}
                      style={{ marginBottom: '8px' }}
                    />
                    <Input
                      placeholder="County"
                      value={field.value?.county || ''}
                      onChange={(e) => field.onChange({ ...field.value, county: e.target.value })}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Why increased risk is justified?
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_risk_justification"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="licensing_risk_justification"
                      {...field}
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                What actions will be taken to reduce risk?
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_risk_reduction_actions"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="licensing_risk_reduction_actions"
                      {...field}
                      rows={3}
                      style={{ width: '100%' }}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                The above waiver is to be addressed at a:
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_waiver_level"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="licensing_waiver_level"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select level"
                    >
                      <Option value="project">Project Level</Option>
                      <Option value="global">Global Level</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <Divider style={{ margin: '24px 0' }} />

    <div className="section-card">
      <h3
        style={{
          color: 'var(--hb-blue)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        Scope & Value of Subcontract/Purchase Order
      </h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Describe Scope:
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="subcontract_scope"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input.TextArea
                      id="subcontract_scope"
                      {...field}
                      rows={3}
                      style={{ width: '100%' }}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Does company have employees on the project site?
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="employees_on_site"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Select
                      id="employees_on_site"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ width: '300px' }}
                      placeholder="Select option"
                    >
                      <Option value="yes">Yes</Option>
                      <Option value="no">No</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Value of Subcontract/P.O.
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="subcontract_value"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <NumericFormat
                      id="subcontract_value"
                      thousandSeparator={true}
                      prefix={'$'}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      customInput={Input}
                      style={{ width: '300px' }}
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.floatValue)}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <Divider style={{ margin: '24px 0' }} />

    <div className="section-card">
      <h3
        style={{
          color: 'var(--hb-blue)',
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        Approval
      </h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Project Executive
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="project_executive"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="project_executive"
                      {...field}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Date
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="project_executive_date"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <DatePicker
                      id="project_executive_date"
                      format="MM/DD/YYYY"
                      value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                      onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                      style={{ width: '300px' }}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                CFO
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="cfo"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <Input
                      id="cfo"
                      {...field}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Date
              </span>
            </Col>
            <Col span={14}>
              <Controller
                name="cfo_date"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <DatePicker
                      id="cfo_date"
                      format="MM/DD/YYYY"
                      value={field.value ? moment(field.value, 'MM/DD/YYYY') : null}
                      onChange={(date) => field.onChange(date ? date.format('MM/DD/YYYY') : null)}
                      style={{ width: '300px' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </div>
);

/**
 * Main Buyout Form component for creating or editing buyout records, with a consolidated layout and navigation sidebar using Steps
 * @param {Object} props - Component props
 * @param {Object} [props.initialData] - Initial data for editing an existing record
 * @param {Function} props.onSubmit - Callback function to handle form submission
 * @param {Function} props.onCancel - Callback function to handle cancellation and return to table view
 * @returns {JSX.Element} Buyout Form component
 */
const BuyoutForm = ({ initialData, onSubmit, onCancel }) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialData || {
      number: '',
      vendor: '',
      title: '',
      status: 'DRAFT',
      executed: false,
      retainage_percent: 0,
      contract_start_date: null,
      contract_estimated_completion_date: null,
      actual_completion_date: null,
      contract_date: null,
      signed_contract_received_date: null,
      issued_on_date: null,
      owner_approval_required: false,
      owner_approval_status: 'Pending',
      owner_meeting_required: false,
      owner_meeting_date: null,
      owner_approval_date: null,
      allowance_included: false,
      total_contract_allowances: 0,
      allowance_reconciliation_total: 0,
      allowance_variance: 0,
      ve_offered: false,
      total_ve_presented: 0,
      total_ve_accepted: 0,
      total_ve_rejected: 0,
      net_ve_savings: 0,
      long_lead_included: false,
      link_to_budget_item: '',
      budget: 0,
      contract_value: 0,
      savings_overage: 0,
      allowances: [],
      veItems: [],
      leadTimes: [],
      scope_review_meeting_date: null,
      spm_review_date: null,
      spm_approval_status: '',
      px_review_date: null,
      px_approval_status: '',
      vp_review_date: null,
      vp_approval_status: '',
      loi_sent_date: null,
      loi_returned_date: null,
      subcontract_agreement_sent_date: null,
      fully_executed_sent_date: null,
      contract_status: 'N',
      schedule_a_status: 'N',
      schedule_b_status: 'N',
      exhibit_a_status: 'N',
      exhibit_b_status: 'N',
      exhibit_i_status: 'N',
      labor_rates_status: 'N',
      unit_rates_status: 'N',
      exhibits_status: 'N',
      schedule_of_values_status: 'N',
      p_and_p_bond_status: 'N',
      w_9_status: 'N',
      license_status: 'N',
      insurance_general_liability_status: 'N',
      insurance_auto_status: 'N',
      insurance_umbrella_liability_status: 'N',
      insurance_workers_comp_status: 'N',
      special_requirements_status: 'N',
      compliance_manager_status: 'N',
      scanned_returned_status: 'N',
      px: '',
      pm: '',
      pa: '',
      compliance_manager: '',
      additional_notes_comments: '',
      insurance_requirements_to_waive: [],
      insurance_explanation: '',
      insurance_risk_justification: '',
      insurance_risk_reduction_actions: '',
      insurance_waiver_level: '',
      licensing_requirements_to_waive: { state: false, local: false, county: '' },
      licensing_risk_justification: '',
      licensing_risk_reduction_actions: '',
      licensing_waiver_level: '',
      subcontract_scope: '',
      employees_on_site: '',
      subcontract_value: 0,
      project_executive: '',
      project_executive_date: null,
      cfo: '',
      cfo_date: null,
    },
  });

  const allowanceIncluded = watch('allowance_included');
  const veOffered = watch('ve_offered');
  const longLeadIncluded = watch('long_lead_included');

  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = useFieldArray({ control, name: 'allowances' });
  const { fields: veFields, append: appendVe, remove: removeVe } = useFieldArray({ control, name: 'veItems' });
  const { fields: leadFields, append: appendLead, remove: removeLead } = useFieldArray({ control, name: 'leadTimes' });

  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState('buyout-details');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  // Define sections for each tab dynamically
  const getSectionsForTab = (tabKey) => {
    switch (tabKey) {
      case 'buyout-details':
        return [
          { title: 'General Information', id: 'general-information' },
          { title: 'Owner Approval', id: 'owner-approval' },
          { title: 'Allowances', id: 'allowances' },
          { title: 'Value Engineering', id: 'value-engineering' },
          { title: 'Long Lead Items', id: 'long-lead-items' },
          { title: 'Financials', id: 'financials' },
        ];
      case 'contract-workflow':
        return [
          { title: 'Scope Review Meeting', id: 'contract-workflow' },
          { title: 'Contract Review and Approval', id: 'contract-workflow' },
          { title: 'Contract Execution Dates', id: 'contract-workflow' },
          { title: 'Project Timeline', id: 'contract-workflow' },
        ];
      case 'subcontract-checklist':
        return [
          { title: 'Subcontract Checklist', id: 'subcontract-checklist' },
        ];
      case 'compliance-waiver':
        return [
          { title: 'Insurance Waiver', id: 'compliance-waiver' },
          { title: 'Licensing Waiver', id: 'compliance-waiver' },
          { title: 'Scope & Value', id: 'compliance-waiver' },
          { title: 'Approval', id: 'compliance-waiver' },
        ];
      default:
        return [];
    }
  };

  const sections = getSectionsForTab(activeTab);

  const handleNavClick = (index) => {
    setActiveSection(index);
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderTabPane = (key) => {
    switch (key) {
      case 'buyout-details':
        return (
          <TabPane tab="Buyout Details" key="buyout-details">
            <div className="tab-content-scrollable">
              <Form
                layout="vertical"
                onFinish={handleSubmit(onFormSubmit)}
                className="buyout-form-container"
              >
                <GeneralInformationSection control={control} />
                <Divider style={{ margin: '6px 0' }} />
                <FinancialsSection control={control} watch={watch} setValue={setValue} />
                <Divider style={{ margin: '6px 0' }} />
                <OwnerApprovalSection control={control} />
                <Divider style={{ margin: '6px 0' }} />
                <AllowanceSection
                  control={control}
                  allowanceIncluded={allowanceIncluded}
                  allowanceFields={allowanceFields}
                  appendAllowance={appendAllowance}
                  removeAllowance={removeAllowance}
                />
                <Divider style={{ margin: '6px 0' }} />
                <ValueEngineeringSection
                  control={control}
                  veOffered={veOffered}
                  veFields={veFields}
                  appendVe={appendVe}
                  removeVe={removeVe}
                />
                <Divider style={{ margin: '6px 0' }} />
                <LongLeadSection
                  control={control}
                  longLeadIncluded={longLeadIncluded}
                  leadFields={leadFields}
                  appendLead={appendLead}
                  removeLead={removeLead}
                />
              </Form>
            </div>
          </TabPane>
        );
      case 'contract-workflow':
        return (
          <TabPane tab="Contract Workflow" key="contract-workflow">
            <div className="tab-content-scrollable">
              <ContractWorkflowSection control={control} />
            </div>
          </TabPane>
        );
      case 'subcontract-checklist':
        return (
          <TabPane tab="Subcontract Checklist" key="subcontract-checklist">
            <div className="tab-content-scrollable">
              <SubcontractChecklistSection control={control} />
            </div>
          </TabPane>
        );
      case 'compliance-waiver':
        return (
          <TabPane tab="Compliance Waiver" key="compliance-waiver">
            <div className="tab-content-scrollable">
              <ComplianceWaiverSection control={control} />
            </div>
          </TabPane>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
      <Sider
        width={250}
        style={{
          backgroundColor: '#f0f2f5',
          position: 'fixed',
          height: '100vh',
          overflowY: 'hidden',
          padding: '16px',
          zIndex: 10,
        }}
      >
        <Steps
          direction="vertical"
          size="small"
          current={activeSection}
          onChange={handleNavClick}
          items={sections.map(section => ({ title: section.title }))}
          className="buyout-form-steps"
        />
      </Sider>
      <Content style={{ marginLeft: 250, height: '100vh', overflow: 'hidden' }}>
        <div className="fixed-tabs-container">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setActiveSection(0); // Reset to first step when tab changes
            }}
            className="fixed-tabs"
            style={{ background: '#f9f9f9' }}
          >
            {renderTabPane('buyout-details')}
            {renderTabPane('contract-workflow')}
            {renderTabPane('subcontract-checklist')}
            {renderTabPane('compliance-waiver')}
          </Tabs>
        </div>
        <FloatButton
          shape="circle"
          icon={<SaveOutlined />}
          type="primary"
          onClick={handleSubmit(onFormSubmit)}
          tooltip="Save"
          style={{ position: 'fixed', right: 72, bottom: 72, zIndex: 1000 }}
          htmlType="submit"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSubmit(onFormSubmit)();
            }
          }}
        />
        <FloatButton
          shape="circle"
          icon={<CloseOutlined />}
          onClick={onCancel}
          tooltip="Cancel"
          style={{ position: 'fixed', right: 72, bottom: 16, zIndex: 1000 }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCancel();
            }
          }}
        />
      </Content>
    </Layout>
  );
};

export default BuyoutForm;