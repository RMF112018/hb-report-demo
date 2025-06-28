// src/renderer/components/BuyoutForm/SubcontractChecklistSection.js
// Subcontract Checklist section of the Buyout Form, tracking requirement statuses
// Use within BuyoutForm to render subcontract checklist fields
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://react.dev/reference/react/memo

import React from 'react';
import { Row, Col, Form, Divider } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { SelectField, TextField, TextAreaField, CHECKLIST_STATUSES } from 'hb-report';

const SubcontractChecklistSection = React.memo(({ control }) => (
  <div id="subcontract-checklist">
    <div>
      <h3>Subcontract Checklist</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Contract</span>
            </Col>
            <Col span={14}>
              <Controller
                name="contract_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="contract_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Schedule A (General Conditions)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="schedule_a_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="schedule_a_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Schedule B (Scope of Work)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="schedule_b_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="schedule_b_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Exhibit A (Drawings)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibit_a_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="exhibit_a_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Exhibit B (Project Schedule)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibit_b_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="exhibit_b_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Exhibit I (OCIP Addendum)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibit_i_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="exhibit_i_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Labor Rates</span>
            </Col>
            <Col span={14}>
              <Controller
                name="labor_rates_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="labor_rates_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Unit Rates</span>
            </Col>
            <Col span={14}>
              <Controller
                name="unit_rates_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="unit_rates_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Exhibits</span>
            </Col>
            <Col span={14}>
              <Controller
                name="exhibits_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="exhibits_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Schedule of Values</span>
            </Col>
            <Col span={14}>
              <Controller
                name="schedule_of_values_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="schedule_of_values_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
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
              <span>P&P Bond</span>
            </Col>
            <Col span={14}>
              <Controller
                name="p_and_p_bond_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="p_and_p_bond_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>W-9</span>
            </Col>
            <Col span={14}>
              <Controller
                name="w_9_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="w_9_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>License</span>
            </Col>
            <Col span={14}>
              <Controller
                name="license_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="license_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Insurance - General Liability</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_general_liability_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="insurance_general_liability_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Insurance - Auto</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_auto_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="insurance_auto_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Insurance - Umbrella Liability</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_umbrella_liability_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="insurance_umbrella_liability_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Insurance - Workers Comp</span>
            </Col>
            <Col span={14}>
              <Controller
                name="insurance_workers_comp_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="insurance_workers_comp_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Special Requirements (See Reverse)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="special_requirements_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="special_requirements_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Compliance Manager (approved compliance)</span>
            </Col>
            <Col span={14}>
              <Controller
                name="compliance_manager_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="compliance_manager_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>Scanned & Returned to Sub</span>
            </Col>
            <Col span={14}>
              <Controller
                name="scanned_returned_status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="scanned_returned_status"
                      value={field.value}
                      onChange={field.onChange}
                      options={CHECKLIST_STATUSES}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>PX</span>
            </Col>
            <Col span={14}>
              <Controller
                name="px"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="px"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>PM</span>
            </Col>
            <Col span={14}>
              <Controller
                name="pm"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="pm"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span>PA</span>
            </Col>
            <Col span={14}>
              <Controller
                name="pa"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="pa"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Undefined"
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
              <span>Compliance Manager</span>
            </Col>
            <Col span={14}>
              <Controller
                name="compliance_manager"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="compliance_manager"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Undefined"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 8]} align="middle">
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={5}>
              <span>Additional Notes / Comments</span>
            </Col>
            <Col span={19}>
              <Controller
                name="additional_notes_comments"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextAreaField
                      id="additional_notes_comments"
                      value={field.value}
                      onChange={field.onChange}
                      rows={4}
                      placeholder="Undefined"
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
));

SubcontractChecklistSection.propTypes = {
  control: PropTypes.object.isRequired,
};

export default SubcontractChecklistSection;