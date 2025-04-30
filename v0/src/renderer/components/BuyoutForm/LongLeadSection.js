// src/renderer/components/BuyoutForm/LongLeadSection.js
// Long Lead Items section of the Buyout Form, managing long lead items list
// Use within BuyoutForm to render long lead items fields
// Reference: https://ant.design/components/collapse
// *Additional Reference*: https://react-hook-form.com/docs

import React from 'react';
import { Collapse, Row, Col, Button, Input } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, TextField } from 'hb-report';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import '../../styles/BuyoutForm.css';

const LongLeadSection = ({ control, longLeadIncluded, leadFields, appendLead, removeLead }) => (
  <div id="long-lead-items">
    <Collapse defaultActiveKey={['1']} className="collapse">
      <Collapse.Panel header="Long Lead Items" key="1">
        <div className="sectionCard">
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Contract Scope Includes Long Lead Items</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="long_lead_included"
                    control={control}
                    render={({ field }) => (
                      <CheckboxField checked={field.value} onChange={field.onChange} />
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {longLeadIncluded && (
            <div className="listContainer">
              {leadFields.map((field, index) => (
                <Row key={field.id} gutter={[16, 8]} align="middle" className="listItem">
                  <Col span={8}>
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
                  </Col>
                  <Col span={5}>
                    <Controller
                      name={`leadTimes[${index}].time`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`leadTimes-${index}-time`}
                          type="number"
                          value={field.value}
                          onChange={field.onChange}
                          className="input"
                        />
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Row gutter={[16, 0]} align="middle">
                      <Col span={10}>
                        <span className="fieldLabel">Procured</span>
                      </Col>
                      <Col span={14}>
                        <Controller
                          name={`leadTimes[${index}].procured`}
                          control={control}
                          render={({ field }) => (
                            <CheckboxField checked={field.value} onChange={field.onChange} />
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
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => appendLead({ item: '', time: '', procured: false })}
                block
                icon={<PlusOutlined />}
                className="addButton"
              >
                Add Long Lead Item
              </Button>
            </div>
          )}
        </div>
      </Collapse.Panel>
    </Collapse>
  </div>
);

LongLeadSection.propTypes = {
  control: PropTypes.object.isRequired,
  longLeadIncluded: PropTypes.bool.isRequired,
  leadFields: PropTypes.array.isRequired,
  appendLead: PropTypes.func.isRequired,
  removeLead: PropTypes.func.isRequired,
};

export default LongLeadSection;