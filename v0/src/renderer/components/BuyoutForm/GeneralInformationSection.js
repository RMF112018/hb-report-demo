// src/renderer/components/BuyoutForm/GeneralInformationSection.js
// Component for the General Information section of BuyoutForm
// Use within BuyoutForm to render general information fields
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs
// *Additional Reference*: https://react.dev/reference/react/memo

import React from 'react';
import { Row, Col } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextField, SelectField, CheckboxField, CurrencyField, BUYOUT_STATUSES } from 'hb-report';

const GeneralInformationSection = React.memo(({ control, isEditing }) => {
  // Use useWatch to get the current form values
  const formValues = useWatch({
    control,
    name: ['number', 'status', 'vendor', 'executed', 'title', 'retainage_percent'],
  });

  const [number, status, vendor, executed, title, retainage_percent] = formValues;

  const renderField = (label, name, renderEditable, value, isPercent = false) => {
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
            {isPercent
              ? `${(value != null ? value : 0).toFixed(2)}%`
              : (value || 'Undefined')}
          </span>
        )}
      </div>
    );
  };

  return (
    <div id="general-information">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          {renderField(
            'Contract #',
            'number',
            (field) => (
              <TextField
                id="contract-number"
                value={field.value}
                onChange={field.onChange}
                placeholder="1699901-001"
              />
            ),
            number ? `${number}` : 'No Commitment Number Associated'
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Status',
            'status',
            (field) => (
              <SelectField
                id="status"
                value={field.value}
                onChange={field.onChange}
                options={BUYOUT_STATUSES.map(status => ({ value: status, label: status }))}
                placeholder="Undefined"
              />
            ),
            status
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Contract Company',
            'vendor',
            (field) => (
              <TextField
                id="vendor"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a company"
              />
            ),
            vendor ? `${vendor}` : 'No Vendor Assigned'
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Executed',
            'executed',
            (field) => (
              <CheckboxField
                checked={field.value}
                onChange={field.onChange}
              />
            ),
            executed ? 'Yes' : 'No'
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Title',
            'title',
            (field) => (
              <TextField
                id="title"
                value={field.value}
                onChange={field.onChange}
                placeholder="Structural Shell"
              />
            ),
            title ? `${title}` : 'Undefined'
          )}
        </Col>
        <Col xs={24} sm={12}>
          {renderField(
            'Def. Retainage',
            'retainage_percent',
            (field) => (
              <CurrencyField
                id="retainage_percent"
                value={field.value}
                onValueChange={field.onChange}
                addonAfter="%"
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            ),
            retainage_percent,
            true
          )}
        </Col>
      </Row>
    </div>
  );
});

GeneralInformationSection.propTypes = {
  control: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default GeneralInformationSection;