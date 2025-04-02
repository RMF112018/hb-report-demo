// src/renderer/services/staffingService.js
const staffingService = {
    getStaffingTestData: () => window.electronAPI.getStaffingTestData(),
    updateStaffingActivity: (activity) => window.electronAPI.updateStaffingActivity(activity),
    addStaffingActivity: (activity) => window.electronAPI.addStaffingActivity(activity),
    deleteStaffingActivity: (activityId) => window.electronAPI.deleteStaffingActivity(activityId),
    updateStaffingNeeds: (need) => window.electronAPI.updateStaffingNeeds(need),
  };
  
  export default staffingService;