// src/renderer/components/BuyoutForm/OwnerApprovalSection.js
// Owner Approval section of the Buyout Form, managing owner approval details
// Use within BuyoutForm to render owner approval fields
// Reference: https://ant.design/components/collapse
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://react.dev/reference/react/memo

import React from 'react';
import { Row, Col } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { CheckboxField, SelectField, DatePickerField, APPROVAL_STATUSES } from 'hb-report';

const OwnerApprovalSection = React.memo(({ control, isEditing }) => {
  // Use useWatch to get the current form values
  const formValues = useWatch({
    control,
    name: [
      'owner_approval_required',
      'owner_approval_status',
      'owner_approval_date',
      'owner_meeting_required',
      'owner_meeting_date',
    ],
  });

  const [
    ownerApprovalRequired,
    ownerApprovalStatus,
    ownerApprovalDate,
    ownerMeetingRequired,
    ownerMeetingDate,
  ] = formValues;

  const renderField = (label, name, renderEditable, value, isDate = false) => {
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
            {isDate
              ? (value ? new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'mm/dd/yyyy')
              : (value || 'Undefined')}
          </span>
        )}
      </div>
    );
  };

  return (
    <div id="owner-approval">
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12}>
          {renderField(
            'Owner Approval Required',
            'owner_approval_required',
            (field) => (
              <CheckboxField
                checked={field.value}
                onChange={field.onChange}
              />
            ),
            ownerApprovalRequired ? 'Yes' : 'No'
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Owner Meeting Required',
            'owner_meeting_required',
            (field) => (
              <CheckboxField
                checked={field.value}
                onChange={field.onChange}
              />
            ),
            ownerMeetingRequired ? 'Yes' : 'No'
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Approval Status',
            'owner_approval_status',
            (field) => (
              <SelectField
                id="owner_approval_status"
                value={field.value}
                onChange={field.onChange}
                options={APPROVAL_STATUSES.map(status => ({ value: status, label: status }))}
                placeholder="Undefined"
              />
            ),
            ownerApprovalStatus
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Meeting Date',
            'owner_meeting_date',
            (field) => (
              <DatePickerField
                name="owner_meeting_date"
                control={control}
                label={null}
                placeholder="mm/dd/yyyy"
              />
            ),
            ownerMeetingDate,
            true
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Approval Date',
            'owner_approval_date',
            (field) => (
              <DatePickerField
                name="owner_approval_date"
                control={control}
                label={null}
                placeholder="mm/dd/yyyy"
              />
            ),
            ownerApprovalDate,
            true
          )}
        </Col>
      </Row>
    </div>
  );
});

OwnerApprovalSection.propTypes = {
  control: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default OwnerApprovalSection;