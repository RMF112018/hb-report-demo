// src/renderer/components/BuyoutForm/GeneralInformationSection.js
// Component for the General Information section of BuyoutForm
// Use within BuyoutForm to render general information fields
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs

import React, { useState } from 'react';
import { Form, Row, Col } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextField, SelectField, CheckboxField, CurrencyField, BUYOUT_STATUSES } from 'hb-report';
import '../../styles/BuyoutForm.css';

const GeneralInformationSection = ({ control }) => {
  const [editableFields, setEditableFields] = useState({
    number: false,
    vendor: false,
    title: false,
  });

  const handleDoubleClick = (fieldName) => {
    setEditableFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setEditableFields((prev) => ({ ...prev, [fieldName]: false }));
  };

  return (
    <div className="sectionCard">
      <h3 className="sectionTitle">General Information</h3>
      <Row gutter={[16, 8]} align="middle">
        <Col span={12}>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Contract #</span>
            </Col>
            <Col span={14}>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="contract-number"
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={!editableFields.number}
                      onDoubleClick={() => handleDoubleClick('number')}
                      onBlur={() => handleBlur('number')}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Contract Company</span>
            </Col>
            <Col span={14}>
              <Controller
                name="vendor"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="vendor"
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={!editableFields.vendor}
                      onDoubleClick={() => handleDoubleClick('vendor')}
                      onBlur={() => handleBlur('vendor')}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Title</span>
            </Col>
            <Col span={14}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <TextField
                      id="title"
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={!editableFields.title}
                      onDoubleClick={() => handleDoubleClick('title')}
                      onBlur={() => handleBlur('title')}
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
              <span className="fieldLabel">Status</span>
            </Col>
            <Col span={14}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <SelectField
                      id="status"
                      value={field.value}
                      onChange={field.onChange}
                      options={BUYOUT_STATUSES.map(status => ({ value: status, label: status }))}
                      placeholder="Select status"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Executed</span>
            </Col>
            <Col span={14}>
              <Controller
                name="executed"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <CheckboxField
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]} align="middle">
            <Col span={10}>
              <span className="fieldLabel">Def. Retainage</span>
            </Col>
            <Col span={14}>
              <Controller
                name="retainage_percent"
                control={control}
                render={({ field }) => (
                  <Form.Item>
                    <CurrencyField
                      id="retainage_percent"
                      value={field.value}
                      onValueChange={field.onChange}
                      addonAfter="%"
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
  );
};

GeneralInformationSection.propTypes = {
  control: PropTypes.object.isRequired,
};

export default GeneralInformationSection;