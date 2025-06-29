// src/renderer/components/UserProfile.js
// Component to display detailed user profile information from SQLite users table
// Import into App.js and render when 'Profile' is selected from the avatar dropdown
// Reference: https://react.dev/reference/react/Component
// Additional Reference: https://ant.design/components/typography#api
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space, Button, Avatar as AntAvatar } from 'antd';

const { Title, Text } = Typography;

const UserProfile = ({ userData, onClose }) => {
    const {
        id,
        procore_user_id,
        company_id,
        first_name,
        last_name,
        email,
        password_hash,
        business_id,
        role,
        address,
        city,
        country_code,
        state_code,
        zip,
        avatar,
        business_phone,
        is_employee,
    } = userData || {};

    return (

        <div style={{ padding: '24px', maxWidth: '500px' }}> <Title level={3}>User Profile</Title> <Space direction="vertical" size="middle" style={{ width: '100%' }}> {avatar && (<AntAvatar src={avatar} size={64} style={{ marginBottom: '16px' }} />)} <div> <Text strong>ID:</Text> <Text>{id || 'N/A'}</Text> </div> <div> <Text strong>Procore User ID:</Text> <Text>{procore_user_id || 'N/A'}</Text> </div> <div> <Text strong>Company ID:</Text> <Text>{company_id || 'N/A'}</Text> </div> <div> <Text strong>First Name:</Text> <Text>{first_name || 'N/A'}</Text> </div> <div> <Text strong>Last Name:</Text> <Text>{last_name || 'N/A'}</Text> </div> <div> <Text strong>Email:</Text> <Text>{email || 'N/A'}</Text> </div> <div> <Text strong>Password Hash:</Text> <Text>********</Text> {/* Masked for security */} </div> <div> <Text strong>Business ID:</Text> <Text>{business_id || 'N/A'}</Text> </div> <div> <Text strong>Role:</Text> <Text>{role || 'N/A'}</Text> </div> <div> <Text strong>Address:</Text> <Text>{address || 'N/A'}</Text> </div> <div> <Text strong>City:</Text> <Text>{city || 'N/A'}</Text> </div> <div> <Text strong>State:</Text> <Text>{state_code || 'N/A'}</Text> </div> <div> <Text strong>Country:</Text> <Text>{country_code || 'N/A'}</Text> </div> <div> <Text strong>ZIP:</Text> <Text>{zip || 'N/A'}</Text> </div> <div> <Text strong>Business Phone:</Text> <Text>{business_phone || 'N/A'}</Text> </div> <div> <Text strong>Is Employee:</Text> <Text>{is_employee === 1 ? 'Yes' : 'No'}</Text> </div> <Button type="primary" onClick={onClose} style={{ marginTop: '16px' }}> Close </Button> </Space> </div>);
};
UserProfile.propTypes = {
    userData: PropTypes.shape({
        id: PropTypes.number,
        procore_user_id: PropTypes.number,
        company_id: PropTypes.number,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        email: PropTypes.string,
        password_hash: PropTypes.string,
        business_id: PropTypes.string,
        role: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        country_code: PropTypes.string,
        state_code: PropTypes.string,
        zip: PropTypes.string,
        avatar: PropTypes.string,
        business_phone: PropTypes.string,
        is_employee: PropTypes.number,
    }),
    onClose: PropTypes.func.isRequired,
};

UserProfile.defaultProps = {
    userData: {},
};

export default UserProfile;