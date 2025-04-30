// src/renderer/components/BuyoutForm/ValueEngineeringSection.js
import React from 'react';
import { Collapse, Row, Col, Button } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, CurrencyField, TextField } from 'hb-report';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import 'hb-report/styles/BuyoutForm.css';

const ValueEngineeringSection = ({ control, veOffered, veFields, appendVe, removeVe }) => (
  <div id="value-engineering">
    <Collapse defaultActiveKey={['1']} className="collapse">
      <Collapse.Panel header="Value Engineering" key="1">
        <div className="sectionCard">
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Value Engineering Offered to Owner</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="ve_offered"
                    control={control}
                    render={({ field }) => (
                      <CheckboxField checked={field.value} onChange={field.onChange} />
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Total VE Presented</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_ve_presented"
                    control={control}
                    render={({ field }) => (
                      <CurrencyField
                        id="total_ve_presented"
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
                  <span className="fieldLabel">Total VE Accepted</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_ve_accepted"
                    control={control}
                    render={({ field }) => (
                      <CurrencyField
                        id="total_ve_accepted"
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
                  <span className="fieldLabel">Total VE Rejected</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="total_ve_rejected"
                    control={control}
                    render={({ field }) => (
                      <CurrencyField
                        id="total_ve_rejected"
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
                  <span className="fieldLabel">Net VE Savings</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="net_ve_savings"
                    control={control}
                    render={({ field }) => (
                      <CurrencyField
                        id="net_ve_savings"
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
          {veOffered && (
            <div className="listContainer">
              {veFields.map((field, index) => (
                <Row key={field.id} gutter={[16, 8]} align="middle" className="listItem">
                  <Col span={8}>
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
                  </Col>
                  <Col span={5}>
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
                  </Col>
                  <Col span={8}>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span className="fieldLabel">Original Scope</span>
                      </Col>
                      <Col span={14}>
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
                      </Col>
                    </Row>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span className="fieldLabel">Savings</span>
                      </Col>
                      <Col span={14}>
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
                      </Col>
                    </Row>
                  </Col>
                  <Col span={3}>
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeVe(index)}
                      aria-label="Remove VE item"
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => appendVe({ description: '', value: 0, originalScope: 0, savings: 0 })}
                block
                icon={<PlusOutlined />}
                className="addButton"
              >
                Add VE Item
              </Button>
            </div>
          )}
        </div>
      </Collapse.Panel>
    </Collapse>
  </div>
);

ValueEngineeringSection.propTypes = {
  control: PropTypes.object.isRequired,
  veOffered: PropTypes.bool.isRequired,
  veFields: PropTypes.array.isRequired,
  appendVe: PropTypes.func.isRequired,
  removeVe: PropTypes.func.isRequired,
};

export default ValueEngineeringSection;