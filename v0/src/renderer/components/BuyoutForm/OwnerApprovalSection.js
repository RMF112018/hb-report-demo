// src/renderer/components/BuyoutForm/OwnerApprovalSection.js
import React from 'react';
import { Collapse, Row, Col } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, SelectField, DatePickerField, APPROVAL_STATUSES } from 'hb-report';
import 'hb-report/styles/BuyoutForm.css';

const OwnerApprovalSection = ({ control }) => (
  <div id="owner-approval">
    <Collapse
      items={[
        {
          key: '1',
          label: 'Owner Approval Details',
          children: (
            <div className="sectionCard">
              <Row gutter={[16, 8]} align="middle">
                <Col span={12}>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Owner Approval Required</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="owner_approval_required"
                        control={control}
                        render={({ field }) => (
                          <CheckboxField checked={field.value} onChange={field.onChange} />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Approval Status</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="owner_approval_status"
                        control={control}
                        render={({ field }) => (
                          <SelectField
                            id="owner_approval_status"
                            value={field.value}
                            onChange={field.onChange}
                            options={APPROVAL_STATUSES.map(status => ({ value: status, label: status }))}
                            placeholder="Select status"
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Approval Date</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="owner_approval_date"
                        control={control}
                        render={({ field }) => (
                          <DatePickerField
                            id="owner_approval_date"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Owner Meeting Required</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="owner_meeting_required"
                        control={control}
                        render={({ field }) => (
                          <CheckboxField checked={field.value} onChange={field.onChange} />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} align="middle">
                    <Col span={10}>
                      <span className="fieldLabel">Meeting Date</span>
                    </Col>
                    <Col span={14}>
                      <Controller
                        name="owner_meeting_date"
                        control={control}
                        render={({ field }) => (
                          <DatePickerField
                            id="owner_meeting_date"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          ),
        },
      ]}
      defaultActiveKey={['1']}
      className="collapse"
    />
  </div>
);

OwnerApprovalSection.propTypes = {
  control: PropTypes.object.isRequired,
};

export default OwnerApprovalSection;