// src/renderer/components/BuyoutForm/CommentsSection.js
// Sidebar Comments Section for the Buyout Details panel
// Use within BuyoutForm to render a comments field in the sidebar
// Reference: https://ant.design/components/form
// *Additional Reference*: https://react-hook-form.com/docs

import React from 'react';
import { Form } from 'antd';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextAreaField } from 'hb-report';
import 'hb-report/styles/BuyoutForm.css';

const CommentsSection = ({ control }) => (
  <div className="commentsContainer">
    <h3 className="commentsTitle">Additional Notes / Comments</h3>
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
            placeholder="Enter comments"
          />
        </Form.Item>
      )}
    />
  </div>
);

CommentsSection.propTypes = {
  control: PropTypes.object.isRequired,
};

export default CommentsSection;