// src/renderer/components/BuyoutForm/ComplianceWaiverSection.js
// Compliance Waiver section of the Buyout Form, for requesting waivers of compliance requirements
// Use within BuyoutForm to render compliance waiver fields
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs

import React from 'react';
import { Row, Col, Form, Divider, Checkbox, Input } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, TextAreaField, SelectField, CurrencyField, DatePickerField, TextField, WAIVER_LEVELS, EMPLOYEES_ON_SITE_OPTIONS } from 'hb-report';
import '../../styles/BuyoutForm.css';

const INSURANCE_CHECKBOX_OPTIONS = [
  { label: 'General Liability', value: 'general_liability' },
  { label: 'Auto', value: 'auto' },
  { label: 'Umbrella', value: 'umbrella' },
  { label: 'Workers Comp', value: 'workers_comp' },
  { label: 'Professional Liability', value: 'professional_liability' },
];

const LICENSING_CHECKBOX_OPTIONS = [
  { label: 'State', value: 'state' },
  { label: 'Local', value: 'local' },
];

const ComplianceWaiverSection = ({ control }) => (
  <div id="compliance-waiver" className="sectionCard">
    {/* Insurance Requirements Waiver */}
    <div className="sectionCard">
      <h3 className="sectionTitle">Request for Reduction or Waiver of Insurance Requirements</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">What insurance requirements are to be waived or reduced? (select all that apply)</span>
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
                      options={INSURANCE_CHECKBOX_OPTIONS}
                      className="checkboxGroup"
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
              <span className="fieldLabel">Explain:</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_explanation"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="insurance_explanation"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
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
              <span className="fieldLabel">Why increased risk is justified?</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_risk_justification"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="insurance_risk_justification"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
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
              <span className="fieldLabel">What actions will be taken to reduce risk?</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_risk_reduction_actions"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="insurance_risk_reduction_actions"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
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
              <span className="fieldLabel">The above waiver is to be addressed at a:</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_waiver_level"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="insurance_waiver_level"
                      value={field.value}
                      onChange={field.onChange}
                      options={WAIVER_LEVELS.map(level => ({ value: level, label: level.charAt(0).toUpperCase() + level.slice(1) }))}
                      placeholder="Select level"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <Divider className="divider" />

    {/* Licensing Requirements Waiver */}
    <div className="sectionCard">
      <h3 className="sectionTitle">Request for Waiver of Licensing Requirements</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">What licensing requirements are to be waived?</span>
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
                      options={LICENSING_CHECKBOX_OPTIONS}
                      className="checkboxGroup"
                    />
                    <TextField
                      id="licensing_requirements_to_waive_county"
                      value={field.value?.county || ''}
                      onChange={(value) => field.onChange({ ...field.value, county: value })}
                      placeholder="County"
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
              <span className="fieldLabel">Why increased risk is justified?</span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_risk_justification"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="licensing_risk_justification"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
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
              <span className="fieldLabel">What actions will be taken to reduce risk?</span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_risk_reduction_actions"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="licensing_risk_reduction_actions"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
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
              <span className="fieldLabel">The above waiver is to be addressed at a:</span>
            </Col>
            <Col span={14}>
              <Controller
                name="licensing_waiver_level"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="licensing_waiver_level"
                      value={field.value}
                      onChange={field.onChange}
                      options={WAIVER_LEVELS.map(level => ({ value: level, label: level.charAt(0).toUpperCase() + level.slice(1) }))}
                      placeholder="Select level"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <Divider className="divider" />

    {/* Scope & Value of Subcontract/Purchase Order */}
    <div className="sectionCard">
      <h3 className="sectionTitle">Scope & Value of Subcontract/Purchase Order</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Describe Scope:</span>
            </Col>
            <Col span={14}>
              <Controller
                name="subcontract_scope"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="subcontract_scope"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
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
              <span className="fieldLabel">Does company have employees on the project site?</span>
            </Col>
            <Col span={14}>
              <Controller
                name="employees_on_site"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="employees_on_site"
                      value={field.value}
                      onChange={field.onChange}
                      options={EMPLOYEES_ON_SITE_OPTIONS.map(option => ({ value: option, label: option.charAt(0).toUpperCase() + option.slice(1) }))}
                      placeholder="Select option"
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
              <span className="fieldLabel">Value of Subcontract/P.O.</span>
            </Col>
            <Col span={14}>
              <Controller
                name="subcontract_value"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <CurrencyField
                      id="subcontract_value"
                      value={field.value}
                      onValueChange={field.onChange}
                      allowNegative={false}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <Divider className="divider" />

    {/* Approval */}
    <div className="sectionCard">
      <h3 className="sectionTitle">Approval</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Project Executive</span>
            </Col>
            <Col span={14}>
              <Controller
                name="project_executive"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="project_executive"
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
              <span className="fieldLabel">Date</span>
            </Col>
            <Col span={14}>
              <Controller
                name="project_executive_date"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <DatePickerField
                      id="project_executive_date"
                      value={field.value}
                      onChange={field.onChange}
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
              <span className="fieldLabel">CFO</span>
            </Col>
            <Col span={14}>
              <Controller
                name="cfo"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="cfo"
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
              <span className="fieldLabel">Date</span>
            </Col>
            <Col span={14}>
              <Controller
                name="cfo_date"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <DatePickerField
                      id="cfo_date"
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
  </div>
);

ComplianceWaiverSection.propTypes = {
  control: PropTypes.object.isRequired,
};

export default ComplianceWaiverSection;