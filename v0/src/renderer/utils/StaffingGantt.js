// src/renderer/utils/StaffingGantt.js
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';

const StaffingGantt = ({ activities }) => {
  const ganttData = useMemo(() => {
    const data = [
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ],
    ];
    activities.forEach(activity => {
      if (activity.startMonth && activity.endMonth) {
        const startDate = new Date(`${activity.startMonth}-01`);
        const endDate = new Date(`${activity.endMonth}-01`);
        endDate.setMonth(endDate.getMonth() + 1);
        data.push([activity.id, activity.name, startDate, endDate, null, 100, null]);
      }
    });
    return data;
  }, [activities]);

  // Calculate height based on number of activities
  const chartHeight = ganttData.length > 1 ? `${ganttData.length * 40}px` : '80px'; // 40px per row, 80px minimum for "No activities" message

  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', padding: '4px' }}>
      {ganttData.length > 1 ? (
        <Chart
          chartType="Gantt"
          data={ganttData}
          width="100%"
          height={chartHeight}
          options={{
            gantt: { trackHeight: 30, palette: [{ color: '#e6f7e9', dark: '#52c41a', light: '#e6f7e9' }] },
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '10px', color: '#888', fontSize: '12px', height: chartHeight }}>
          No activities to display in the Gantt chart.
        </div>
      )}
    </div>
  );
};

StaffingGantt.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      startMonth: PropTypes.string,
      endMonth: PropTypes.string,
    })
  ).isRequired,
};

export default StaffingGantt;