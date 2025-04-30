// src/renderer/components/BuyoutForm/HistorySection.js
// History section of the Buyout Form, displaying buyout history in a table
// Use within BuyoutForm to render historical buyout records
// Reference: https://www.ag-grid.com/react-data-grid/

import React from 'react';
import PropTypes from 'prop-types';
import { TableModuleV2 } from 'hb-report';
import { formatDate } from 'hb-report';
import 'hb-report/styles/BuyoutForm.css';

const HistorySection = ({ historyData }) => {
  const columns = [
    { field: 'version', headerName: 'Version', width: 100 },
    { field: 'number', headerName: 'Number', width: 130 },
    { field: 'vendor.name', headerName: 'Vendor', width: 200 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'status', headerName: 'Status', width: 180, cellRenderer: 'statusCellRenderer' },
    { field: 'executed', headerName: 'Executed', width: 100 },
    { field: 'line_items_total', headerName: 'Original Contract Amount', width: 160 },
    { field: 'approved_change_orders', headerName: 'Approved Change Orders', width: 160 },
    { field: 'grand_total', headerName: 'Revised Contract Amount', width: 160 },
    { field: 'pending_change_orders', headerName: 'Pending Change Orders', width: 160 },
    { field: 'total_draw_requests_amount', headerName: 'Invoiced', width: 160 },
    { field: 'total_payments', headerName: 'Total Payments', width: 160 },
    { field: 'percentage_paid', headerName: 'Percent Paid', width: 80 },
    { field: 'remaining_balance_outstanding', headerName: 'Total Remaining', width: 160 },
    { field: 'private', headerName: 'Private', width: 120 },
  ];

  const statusCellRenderer = (params) => {
    const value = params.value || '';
    const color = value === 'approved' ? '#2ecc71' :
      value === 'draft' ? '#f39c12' :
      value === 'out_for_signature' ? '#3498db' :
      '#7f8c8d';
    return value ? (
      <span className="statusCell" style={{ color }}>{value}</span>
    ) : null;
  };

  return (
    <div className="historyContainer">
      <h2 className="sectionTitle">Buyout History</h2>
      <TableModuleV2
        data={historyData}
        columns={columns}
        autoSizeOnLoad={false}
        enableFiltering={true}
        agGridProps={{
          domLayout: 'autoHeight',
          components: {
            statusCellRenderer,
          },
        }}
      />
    </div>
  );
};

HistorySection.propTypes = {
  historyData: PropTypes.arrayOf(
    PropTypes.shape({
      version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      number: PropTypes.string,
      vendor: PropTypes.shape({
        name: PropTypes.string,
      }),
      title: PropTypes.string,
      status: PropTypes.string,
      executed: PropTypes.bool,
      line_items_total: PropTypes.number,
      approved_change_orders: PropTypes.number,
      grand_total: PropTypes.number,
      pending_change_orders: PropTypes.number,
      total_draw_requests_amount: PropTypes.number,
      total_payments: PropTypes.number,
      percentage_paid: PropTypes.number,
      remaining_balance_outstanding: PropTypes.number,
      private: PropTypes.bool,
    })
  ).isRequired,
};

export default HistorySection;