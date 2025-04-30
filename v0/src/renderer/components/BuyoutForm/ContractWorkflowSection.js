// src/renderer/components/BuyoutForm/ContractWorkflowSection.js
// Contract Workflow section of the Buyout Form, using a Timeline layout to track workflow
// Use within BuyoutForm to render contract workflow fields
// Reference: https://ant.design/components/timeline
// *Additional Reference*: https://react-hook-form.com/docs

import React from 'react';
import { Timeline, Row, Col, Form } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { DatePickerField, SelectField } from 'hb-report';
import '../../styles/BuyoutForm.css';

const APPROVAL_STATUS_OPTIONS = [
  { value: 'Approved', label: 'Approved' },
  { value: 'Disapproved', label: 'Disapproved' },
];

const ContractWorkflowSection = ({ control }) => (
  <div id="contract-workflow" className="sectionCard">
    <Timeline>
      {/* Scope Review Meeting */}
      <Timeline.Item>
        <div className="sectionCard">
          <h3 className="sectionTitle">Scope Review Meeting</h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Scope Review Meeting Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="scope_review_meeting_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="scope_review_meeting_date"
                          value={field.value}
                          onChange={field.onChange}
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

      {/* Contract Review and Approval Dates */}
      <Timeline.Item>
        <div className="sectionCard">
          <h3 className="sectionTitle">Contract Review and Approval Dates</h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">SPM Review Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="spm_review_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="spm_review_date"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">SPM Approval Status</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="spm_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <SelectField
                          id="spm_approval_status"
                          value={field.value}
                          onChange={field.onChange}
                          options={APPROVAL_STATUS_OPTIONS}
                          placeholder="Select status"
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
                  <span className="fieldLabel">PX Review Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="px_review_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="px_review_date"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!control._formValues.spm_review_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">PX Approval Status</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="px_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <SelectField
                          id="px_approval_status"
                          value={field.value}
                          onChange={field.onChange}
                          options={APPROVAL_STATUS_OPTIONS}
                          placeholder="Select status"
                          disabled={!control._formValues.spm_review_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">VP Review Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="vp_review_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="vp_review_date"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!control._formValues.px_review_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">VP Approval Status</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="vp_approval_status"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <SelectField
                          id="vp_approval_status"
                          value={field.value}
                          onChange={field.onChange}
                          options={APPROVAL_STATUS_OPTIONS}
                          placeholder="Select status"
                          disabled={!control._formValues.px_review_date}
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

      {/* Contract Execution Dates */}
      <Timeline.Item>
        <div className="sectionCard">
          <h3 className="sectionTitle">Contract Execution Dates</h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Contract Award Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="contract_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="contract_date"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">LOI Sent</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="loi_sent_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="loi_sent_date"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!control._formValues.contract_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">LOI Returned</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="loi_returned_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="loi_returned_date"
                          value={field.value}
                          onChange={field.onChange}
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
                  <span className="fieldLabel">Subcontract Agreement Sent</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="subcontract_agreement_sent_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="subcontract_agreement_sent_date"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!control._formValues.loi_returned_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Fully Executed by HBC</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="signed_contract_received_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="signed_contract_received_date"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!control._formValues.subcontract_agreement_sent_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Fully Executed Sent to Subcontractor</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="fully_executed_sent_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="fully_executed_sent_date"
                          value={field.value}
                          onChange={field.onChange}
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

      {/* Project Timeline */}
      <Timeline.Item>
        <div className="sectionCard">
          <h3 className="sectionTitle">Project Timeline</h3>
          <Row gutter={[16, 8]} align="middle">
            <Col span={12}>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Start Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="contract_start_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="contract_start_date"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Estimated Completion Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="contract_estimated_completion_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="contract_estimated_completion_date"
                          value={field.value}
                          onChange={field.onChange}
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
                  <span className="fieldLabel">Actual Completion Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="actual_completion_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="actual_completion_date"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!control._formValues.contract_estimated_completion_date}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]} align="middle">
                <Col span={10}>
                  <span className="fieldLabel">Issued On Date</span>
                </Col>
                <Col span={14}>
                  <Controller
                    name="issued_on_date"
                    control={control}
                    render={({ field }) => (
                      <Form.Item>
                        <DatePickerField
                          id="issued_on_date"
                          value={field.value}
                          onChange={field.onChange}
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

ContractWorkflowSection.propTypes = {
  control: PropTypes.object.isRequired,
};

export default ContractWorkflowSection;