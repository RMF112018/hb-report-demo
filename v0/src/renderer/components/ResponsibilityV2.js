// src/renderer/components/ResponsibilityV2.js
// Enhanced Responsibility component for HB Report using TableModuleV2 with native AG Grid features
// Import this component in src/renderer/App.js to render within the main content area
// Reference: https://www.ag-grid.com/react-data-grid/
// *Additional Reference*: https://react.dev/reference/react/useState
// *Additional Reference*: https://ant.design/components/modal#api
// *Additional Reference*: https://ant.design/components/form#api
// *Additional Reference*: https://www.electronjs.org/docs/latest/api/ipc-renderer
// *Additional Reference*: https://ant.design/components/tabs#api
// *Additional Reference*: https://ant.design/components/tag#api

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Space,
  Spin,
  Button,
  Modal,
  Form,
  Input as AntInput,
  Select,
  message,
  Radio,
  List,
  Tabs,
  Popover,
  Tag,
  Tooltip,
  Flex,
  Menu,
  Dropdown,
} from 'antd';
import { PlusOutlined, CheckCircleFilled, DownOutlined } from '@ant-design/icons';
import ComponentHeader from './ComponentHeader.js';
import TableModuleV2 from './TableModuleV2.js';
import '../styles/global.css';
import '../styles/Components.css';

const { Option } = Select;
const { TabPane } = Tabs;

/**
 * ResponsibilityV2 component for managing and visualizing team member roles and responsibilities
 * @param {Object} props - Component props
 * @param {Object} props.selectedProject - The currently selected project
 * @param {Object} props.headerContent - Header content passed from App.js
 * @returns {JSX.Element} Responsibility matrix component
 */
const ResponsibilityV2 = ({ selectedProject, headerContent }) => {
  const [teamData, setTeamData] = useState([]);
  const [primeContractData, setPrimeContractData] = useState([]);
  const [subcontractData, setSubcontractData] = useState([]);
  const [allProjectRoles, setAllProjectRoles] = useState([]);
  const [allContractRoles, setAllContractRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'team' or 'contract'
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [responsibilityToDelete, setResponsibilityToDelete] = useState(null);
  const [editingResponsibility, setEditingResponsibility] = useState(null);
  const [view, setView] = useState('table');
  const [activeTab, setActiveTab] = useState('team-matrix');
  const [activeRoles, setActiveRoles] = useState(['PX', 'PM3', 'PM2', 'PM1', 'PA', 'QAC', 'ProjAcct']);
  const [newTask, setNewTask] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [teamRoleFilters, setTeamRoleFilters] = useState({});
  const [primeContractRoleFilters, setPrimeContractRoleFilters] = useState({});
  const [subcontractRoleFilters, setSubcontractRoleFilters] = useState({});
  const [fontSize, setFontSize] = useState('medium');

  const [form] = Form.useForm();

  const roleColors = {
    PX: 'blue',
    PM1: 'green',
    PM2: 'cyan',
    PM3: 'purple',
    PA: 'orange',
    QAC: 'red',
    ProjAcct: 'magenta',
    O: 'gold',
    A: 'lime',
    C: '#f57734',
    S: 'volcano',
  };

  // Fetch data via IPC
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { projectRoles, contractRoles, responsibilities, primeContractTasks, subcontractTasks } =
          await window.electronAPI.getResponsibilityTestData();
        setAllProjectRoles(projectRoles);
        setAllContractRoles(contractRoles);
        setTeamData(responsibilities);
        setPrimeContractData(
          primeContractTasks.map((task) => ({
            id: `prime-${task.article}-${task.page}`,
            page: task.page,
            article: task.article,
            task: task.description,
            responsible: task.role.split('/')[0], // Take first role if multiple
          }))
        );
        setSubcontractData(
          subcontractTasks.map((task) => ({
            id: `sub-${task.article}-${task.page}`,
            page: task.page,
            article: task.article,
            task: task.description,
            responsible: task.PX === 'X' ? 'PX' : task.PM === 'X' ? 'PM1' : task.S === 'X' ? 'S' : '',
          }))
        );
      } catch (error) {
        message.error('Failed to load responsibility data.');
        console.error('Error fetching responsibility data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const projectRoles = useMemo(() => allProjectRoles.filter((role) => activeRoles.includes(role.key)), [allProjectRoles, activeRoles]);
  const contractRoles = allContractRoles;

  // Group team data by category
  const groupedTeamData = useMemo(() => {
    const grouped = teamData.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    const result = [];
    Object.entries(grouped).forEach(([category, tasks]) => {
      result.push({
        id: `category-${category}`,
        category,
        task: category,
        isCategoryHeader: true,
      });
      result.push(...tasks);
    });
    return result;
  }, [teamData]);

  // Filter team data by role assignments
  const filteredTeamData = useMemo(() => {
    return groupedTeamData.filter((item) => {
      if (item.isCategoryHeader) return true;
      if (Object.keys(teamRoleFilters).length === 0) return true;
      return Object.entries(teamRoleFilters).every(([role, assignment]) => {
        if (!assignment) return true;
        return item[role] === assignment;
      });
    });
  }, [groupedTeamData, teamRoleFilters]);

  // Filter prime contract data by role
  const filteredPrimeContractData = useMemo(() => {
    return primeContractData.filter((item) => {
      if (Object.keys(primeContractRoleFilters).length === 0) return true;
      return Object.entries(primeContractRoleFilters).some(([role, isActive]) => isActive && item.responsible === role);
    });
  }, [primeContractData, primeContractRoleFilters]);

  // Filter subcontract data by role
  const filteredSubcontractData = useMemo(() => {
    return subcontractData.filter((item) => {
      if (Object.keys(subcontractRoleFilters).length === 0) return true;
      return Object.entries(subcontractRoleFilters).some(([role, isActive]) => isActive && item.responsible === role);
    });
  }, [subcontractData, subcontractRoleFilters]);

  // Cell renderer for Responsible column
  const ResponsibleCellRenderer = (params, roles, isTeam = false) => {
    if (!params.node.data || params.node.data.isCategoryHeader) return null;

    if (isTeam) {
      const responsibleParties = [];
      const supportParties = [];
      projectRoles.forEach((role) => {
        const roleKey = role.key;
        if (params.node.data[roleKey] === 'X') {
          responsibleParties.push(roleKey);
        } else if (params.node.data[roleKey] === 'Support') {
          supportParties.push(roleKey);
        }
      });
      const allParties = [...responsibleParties, ...supportParties];
      return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {allParties.length > 0 ? (
            allParties.map((party) => (
              <Tooltip key={party} title={projectRoles.find((r) => r.key === party)?.label || party}>
                <Tag
                  style={{
                    backgroundColor: roleColors[party] || '#d9d9d9',
                    color: '#fff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    fontWeight: 500,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    cursor: 'default',
                  }}
                >
                  {party}
                </Tag>
              </Tooltip>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      );
    } else {
      const responsible = params.node.data.responsible || '';
      return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {responsible ? (
            <Tooltip title={contractRoles.find((r) => r.key === responsible)?.label || responsible}>
              <Tag
                style={{
                  backgroundColor: roleColors[responsible] || '#d9d9d9',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'default',
                }}
              >
                {responsible}
              </Tag>
            </Tooltip>
          ) : (
            <span>-</span>
          )}
        </div>
      );
    }
  };

  // Cell renderer for role assignments
  const ResponsibilityCellRenderer = (params, roles, tab) => {
    if (!params.node.data || params.node.data.isCategoryHeader) return null;

    const role = params.colDef.field;
    const taskId = params.node.data.id;

    if (tab === 'team-matrix') {
      const value = params.node.data[role] || '';
      const handleChange = async (newValue) => {
        const updatedResponsibility = { ...params.node.data, [role]: newValue };
        try {
          const updatedData = await window.electronAPI.updateResponsibility(updatedResponsibility);
          setTeamData(updatedData);
          message.success(`Updated ${role} for task "${params.node.data.task}" to "${newValue}"`);
        } catch (error) {
          message.error('Failed to update responsibility.');
          console.error('Error updating responsibility:', error);
        }
      };
      return (
        <Tooltip title="Click to assign role">
          <Popover
            content={
              <div>
                <Button
                  type="text"
                  onClick={() => handleChange('')}
                  style={{ display: 'block', width: '100%', textAlign: 'left' }}
                >
                  None
                </Button>
                <Button
                  type="text"
                  onClick={() => handleChange('X')}
                  style={{ display: 'block', width: '100%', textAlign: 'left' }}
                >
                  Primary
                </Button>
                <Button
                  type="text"
                  onClick={() => handleChange('Support')}
                  style={{ display: 'block', width: '100%', textAlign: 'left' }}
                >
                  Support
                </Button>
              </div>
            }
            trigger="click"
            placement="bottom"
          >
            <div
              className="editable-cell"
              style={{
                backgroundColor: value === 'X' ? '#e6f7e9' : value === 'Support' ? '#fffbe6' : 'transparent',
                color: value === 'X' ? '#52c41a' : value === 'Support' ? '#faad14' : '#000',
                padding: '4px 8px',
                borderRadius: '4px',
                textAlign: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border 0.2s',
              }}
            >
              {value === 'X' ? <CheckCircleFilled /> : value === 'Support' ? 'Support' : '-'}
            </div>
          </Popover>
        </Tooltip>
      );
    } else if (tab === 'prime-contract' && role === 'C') {
      const value = params.node.data.responsible === role;
      const handleAssignContractor = async (selectedRoleKey) => {
        const updatedResponsibility = { ...params.node.data, responsible: role };
        try {
          const updatedData = [...primeContractData];
          const index = updatedData.findIndex((item) => item.id === taskId);
          updatedData[index] = updatedResponsibility;
          setPrimeContractData(updatedData);
          const teamTask = {
            id: `team-from-prime-${taskId}`,
            task: updatedResponsibility.task,
            category: 'Contractor',
            [selectedRoleKey]: 'X',
            ...projectRoles.reduce((acc, r) => {
              if (r.key !== selectedRoleKey) acc[r.key] = '';
              return acc;
            }, {}),
          };
          const updatedTeamData = await window.electronAPI.addResponsibility(teamTask);
          setTeamData(updatedTeamData);
          message.success(`Assigned Contractor task "${params.node.data.task}" to ${selectedRoleKey}`);
        } catch (error) {
          message.error('Failed to assign Contractor responsibility.');
          console.error('Error assigning Contractor responsibility:', error);
        }
      };
      return (
        <Tooltip title="Click to assign Contractor role">
          <Popover
            content={
              <div>
                {projectRoles.map((projRole) => (
                  <Button
                    key={projRole.key}
                    type="text"
                    onClick={() => handleAssignContractor(projRole.key)}
                    style={{ display: 'block', width: '100%', textAlign: 'left' }}
                  >
                    {projRole.label}
                  </Button>
                ))}
              </div>
            }
            trigger="click"
            placement="bottom"
          >
            <div
              className="editable-cell"
              style={{
                backgroundColor: value ? '#e6f7e9' : 'transparent',
                color: value ? '#52c41a' : '#000',
                padding: '4px 8px',
                borderRadius: '4px',
                textAlign: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border 0.2s',
              }}
            >
              {value ? <CheckCircleFilled /> : '-'}
            </div>
          </Popover>
        </Tooltip>
      );
    } else {
      const value = params.node.data.responsible === role;
      const handleAssign = async () => {
        const updatedResponsibility = { ...params.node.data, responsible: role };
        try {
          if (tab === 'prime-contract') {
            const updatedData = [...primeContractData];
            const index = updatedData.findIndex((item) => item.id === taskId);
            updatedData[index] = updatedResponsibility;
            setPrimeContractData(updatedData);
          } else if (tab === 'subcontract') {
            const updatedData = [...subcontractData];
            const index = updatedData.findIndex((item) => item.id === taskId);
            if (index !== -1) {
              updatedData[index] = updatedResponsibility;
              setSubcontractData([...updatedData]);
              if (role) {
                const teamTask = {
                  id: `team-from-sub-${taskId}`,
                  task: updatedResponsibility.task,
                  category: 'Subcontractor',
                  [role]: 'X',
                  ...projectRoles.reduce((acc, r) => {
                    if (r.key !== role) acc[r.key] = '';
                    return acc;
                  }, {}),
                };
                const updatedTeamData = await window.electronAPI.addResponsibility(teamTask);
                setTeamData(updatedTeamData);
              }
            }
          }
          message.success(`Assigned ${role} to "${params.node.data.task}"`);
        } catch (error) {
          message.error('Failed to assign responsibility.');
          console.error('Error assigning responsibility:', error);
        }
      };
      return (
        <Tooltip title="Click to assign role">
          <div
            className="editable-cell"
            onClick={handleAssign}
            style={{
              backgroundColor: value ? '#e6f7e9' : 'transparent',
              color: value ? '#52c41a' : '#000',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s, border 0.2s',
            }}
          >
            {value ? <CheckCircleFilled /> : '-'}
          </div>
        </Tooltip>
      );
    }
  };

  // Column definitions
  const teamColumns = useMemo(
    () => [
      {
        field: 'responsible',
        headerName: 'Responsible',
        minWidth: 80,
        pinned: 'left',
        cellRenderer: (params) => ResponsibleCellRenderer(params, projectRoles, true),
      },
      {
        field: 'task',
        headerName: 'Task',
        minWidth: 800,
        pinned: 'left',
        cellStyle: (params) => ({
          whiteSpace: 'normal',
          fontWeight: params.data?.isCategoryHeader ? 'bold' : 'normal',
          backgroundColor: params.data?.isCategoryHeader ? '#e6f4ff' : 'transparent',
          borderBottom: params.data?.isCategoryHeader ? '1px solid #d9d9d9' : 'none',
        }),
      },
      ...projectRoles.map((role) => ({
        field: role.key,
        headerName: role.key,
        minWidth: 80,
        cellRenderer: (params) => ResponsibilityCellRenderer(params, projectRoles, 'team-matrix'),
      })),
    ],
    [projectRoles]
  );

  const contractColumns = useMemo(
    () => [
      { field: 'page', headerName: 'Page', minWidth: 80, pinned: 'left' },
      { field: 'article', headerName: 'Article', minWidth: 80, pinned: 'left' },
      {
        field: 'responsible',
        headerName: 'Responsible',
        minWidth: 80,
        pinned: 'left',
        cellRenderer: (params) => ResponsibleCellRenderer(params, contractRoles),
      },
      { field: 'task', headerName: 'Task', minWidth: 800, pinned: 'left', cellStyle: { whiteSpace: 'normal' } },
      ...contractRoles.map((role) => ({
        field: role.key,
        headerName: role.label,
        minWidth: 80,
        headerClass: 'ag-header-cell-centered',
        cellRenderer: (params) => ResponsibilityCellRenderer(params, contractRoles, 'prime-contract'),
      })),
    ],
    [contractRoles]
  );

  const subcontractColumns = useMemo(
    () => [
      { field: 'page', headerName: 'Page', maxWidth: 80, pinned: 'left' },
      { field: 'article', headerName: 'Article', maxWidth: 80, pinned: 'left' },
      {
        field: 'responsible',
        headerName: 'Responsible',
        minWidth: 80,
        pinned: 'left',
        cellRenderer: (params) => ResponsibleCellRenderer(params, projectRoles),
      },
      { field: 'task', headerName: 'Task', minWidth: 800, pinned: 'left', cellStyle: { whiteSpace: 'normal' } },
      ...projectRoles.map((role) => ({
        field: role.key,
        headerName: role.key,
        minWidth: 80,
        cellRenderer: (params) => ResponsibilityCellRenderer(params, projectRoles, 'subcontract'),
      })),
    ],
    [projectRoles]
  );

  // CRUD handlers
  const handleCreate = useCallback(({ key }) => {
    setModalType(key === 'team-task' ? 'team' : 'contract');
    setEditingResponsibility(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form]);

  const handleCreateResponsibility = async (values) => {
    const newResponsibility = {
      id: editingResponsibility
        ? editingResponsibility.id
        : `${values.contract.toLowerCase().replace(' ', '-')}-${Date.now()}`,
      task: values.task,
      ...(modalType === 'team'
        ? {
            category: values.category || 'Team',
            ...allProjectRoles.reduce((acc, role) => {
              acc[role.key] = values[role.key] || '';
              return acc;
            }, {}),
          }
        : {
            page: values.page,
            article: values.article,
            responsible: values.responsible || '',
          }),
    };

    try {
      if (modalType === 'team') {
        const updatedData = await window.electronAPI.addResponsibility(newResponsibility);
        setTeamData(updatedData);
      } else if (values.contract === 'Prime Contract') {
        const updatedData = [...primeContractData, newResponsibility];
        setPrimeContractData(updatedData);
        if (newResponsibility.responsible === 'C' && values.teamResponsibility) {
          const teamTask = {
            id: `team-from-prime-${newResponsibility.id}`,
            task: newResponsibility.task,
            category: 'Contractor',
            [values.teamResponsibility]: 'X',
            ...projectRoles.reduce((acc, r) => {
              if (r.key !== values.teamResponsibility) acc[r.key] = '';
              return acc;
            }, {}),
          };
          const updatedTeamData = await window.electronAPI.addResponsibility(teamTask);
          setTeamData(updatedTeamData);
        }
      } else if (values.contract === 'Subcontract') {
        const updatedData = [...subcontractData, newResponsibility];
        setSubcontractData(updatedData);
        if (newResponsibility.responsible) {
          const teamTask = {
            id: `team-from-sub-${newResponsibility.id}`,
            task: newResponsibility.task,
            category: 'Subcontractor',
            [newResponsibility.responsible]: 'X',
            ...projectRoles.reduce((acc, r) => {
              if (r.key !== newResponsibility.responsible) acc[r.key] = '';
              return acc;
            }, {}),
          };
          const updatedTeamData = await window.electronAPI.addResponsibility(teamTask);
          setTeamData(updatedTeamData);
        }
      }
      message.success('Responsibility created successfully!');
    } catch (error) {
      message.error('Failed to create responsibility.');
      console.error('Error creating responsibility:', error);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteResponsibility = async () => {
    if (!responsibilityToDelete) return;
    try {
      if (activeTab === 'team-matrix') {
        const updatedData = await window.electronAPI.deleteResponsibility(responsibilityToDelete.id);
        setTeamData(updatedData);
      } else if (activeTab === 'prime-contract') {
        const updatedData = primeContractData.filter((item) => item.id !== responsibilityToDelete.id);
        setPrimeContractData(updatedData);
      } else if (activeTab === 'subcontract') {
        const updatedData = subcontractData.filter((item) => item.id !== responsibilityToDelete.id);
        setSubcontractData(updatedData);
      }
      message.success('Responsibility deleted successfully!');
    } catch (error) {
      message.error('Failed to delete responsibility.');
      console.error('Error deleting responsibility:', error);
    }
    setIsDeleteModalVisible(false);
    setResponsibilityToDelete(null);
    form.resetFields();
  };

  const handleEditTask = useCallback(
    (task) => {
      setEditingResponsibility(task);
      form.setFieldsValue({
        task: task.task,
        ...(modalType === 'team'
          ? projectRoles.reduce((acc, role) => {
              acc[role.key] = task[role.key] || '';
              return acc;
            }, { category: task.category })
          : {
              responsible: task.responsible,
              page: task.page,
              article: task.article,
              contract: task.id.startsWith('prime-') ? 'Prime Contract' : 'Subcontract',
              teamResponsibility: task.teamResponsibility || '',
            }),
      });
      setModalType(activeTab === 'team-matrix' ? 'team' : 'contract');
      setIsModalVisible(true);
    },
    [activeTab, form, modalType, projectRoles]
  );

  const handleUpdateTask = async (values) => {
    const updatedResponsibility = {
      ...editingResponsibility,
      task: values.task,
      ...(modalType === 'team'
        ? {
            category: values.category || editingResponsibility.category,
            ...allProjectRoles.reduce((acc, role) => {
              acc[role.key] = values[role.key] || '';
              return acc;
            }, {}),
          }
        : {
            responsible: values.responsible || editingResponsibility.responsible,
            page: values.page || editingResponsibility.page,
            article: values.article || editingResponsibility.article,
          }),
    };

    try {
      if (modalType === 'team') {
        const updatedData = await window.electronAPI.updateResponsibility(updatedResponsibility);
        setTeamData(updatedData);
      } else if (activeTab === 'prime-contract') {
        const updatedData = primeContractData.map((item) =>
          item.id === updatedResponsibility.id ? updatedResponsibility : item
        );
        setPrimeContractData(updatedData);
        if (updatedResponsibility.responsible === 'C') {
          const teamTask = {
            id: `team-from-prime-${updatedResponsibility.id}`,
            task: updatedResponsibility.task,
            category: 'Contractor',
            [values.contractorRole || 'PX']: 'X',
            ...projectRoles.reduce((acc, r) => {
              if (r.key !== (values.contractorRole || 'PX')) acc[r.key] = '';
              return acc;
            }, {}),
          };
          const updatedTeamData = await window.electronAPI.addResponsibility(teamTask);
          setTeamData(updatedTeamData);
        }
      } else {
        const updatedData = subcontractData.map((item) =>
          item.id === updatedResponsibility.id ? updatedResponsibility : item
        );
        setSubcontractData(updatedData);
        if (updatedResponsibility.responsible) {
          const teamTask = {
            id: `team-from-sub-${updatedResponsibility.id}`,
            task: updatedResponsibility.task,
            category: 'Subcontractor',
            [updatedResponsibility.responsible]: 'X',
            ...projectRoles.reduce((acc, r) => {
              if (r.key !== updatedResponsibility.responsible) acc[r.key] = '';
              return acc;
            }, {}),
          };
          const updatedTeamData = await window.electronAPI.addResponsibility(teamTask);
          setTeamData(updatedTeamData);
        }
      }
      message.success('Task updated successfully!');
    } catch (error) {
      message.error('Failed to update task.');
      console.error('Error updating task:', error);
    }
    setIsModalVisible(false);
    setEditingResponsibility(null);
    form.resetFields();
  };

  const onRowSelectionChanged = useCallback((params) => {
    const selectedNodes = params.api.getSelectedNodes();
    setSelectedRows(selectedNodes.filter((node) => !node.data?.isCategoryHeader).map((node) => node.data));
  }, []);

  const handleBulkAssign = async (role, assignment) => {
    if (selectedRows.length === 0) {
      message.warning('Please select at least one task to assign roles.');
      return;
    }
    const updatedData = [...teamData];
    for (const row of selectedRows) {
      const index = updatedData.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        updatedData[index] = { ...updatedData[index], [role]: assignment };
        await window.electronAPI.updateResponsibility(updatedData[index]);
      }
    }
    setTeamData(updatedData);
    message.success(`Assigned ${assignment} to ${role} for ${selectedRows.length} tasks.`);
    setSelectedRows([]);
  };

  // Render functions
  const renderTeamMatrix = () => (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <div
            className="responsibility-role-filters"
            style={{ marginBottom: '16px', overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
            <span style={{ marginRight: '8px', fontWeight: 500, color: 'var(--hb-blue)' }}>
              Filter by Role:
            </span>
            <Flex wrap="nowrap" gap="small">
              {projectRoles.map((role) => (
                <React.Fragment key={role.key}>
                  <Tag
                    color={teamRoleFilters[role.key] === 'X' ? roleColors[role.key] : undefined}
                    style={{
                      color: teamRoleFilters[role.key] === 'X' ? '#fff' : undefined,
                      width: '120px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '14px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                    onClick={() =>
                      setTeamRoleFilters((prev) => ({
                        ...prev,
                        [role.key]: prev[role.key] === 'X' ? '' : 'X',
                      }))
                    }
                  >
                    {role.key}
                  </Tag>
                  <Tag
                    color={teamRoleFilters[role.key] === 'Support' ? roleColors[role.key] : undefined}
                    style={{
                      color: teamRoleFilters[role.key] === 'Support' ? '#fff' : undefined,
                      width: '120px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '14px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                    onClick={() =>
                      setTeamRoleFilters((prev) => ({
                        ...prev,
                        [role.key]: prev[role.key] === 'Support' ? '' : 'Support',
                      }))
                    }
                  >
                    {role.key}
                  </Tag>
                </React.Fragment>
              ))}
            </Flex>
          </div>
          {activeTab === 'team-matrix' && selectedRows.length > 0 && (
            <div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
              <span>Selected {selectedRows.length} tasks</span>
              {projectRoles.map((role) => (
                <Dropdown
                  key={role.key}
                  menu={{
                    items: [
                      { key: 'none', label: 'None', onClick: () => handleBulkAssign(role.key, '') },
                      { key: 'primary', label: 'Primary', onClick: () => handleBulkAssign(role.key, 'X') },
                      { key: 'support', label: 'Support', onClick: () => handleBulkAssign(role.key, 'Support') },
                    ],
                  }}
                  trigger={['click']}
                >
                  <Button>
                    Assign {role.key} <DownOutlined />
                  </Button>
                </Dropdown>
              ))}
            </div>
          )}
          <TableModuleV2
            data={filteredTeamData.filter((item) => item.task)}
            columns={teamColumns}
            enableFiltering={true}
            enableSearch={true}
            autoSizeOnLoad={true}
            agGridProps={{
              rowSelection: 'multiple',
              onSelectionChanged: onRowSelectionChanged,
              rowClassRules: {
                'category-header-row': (params) => params.data?.isCategoryHeader,
              },
              domLayout: 'normal',
            }}
          />
        </>
      )}
    </div>
  );

  const renderPrimeContract = () => (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <div
            className="responsibility-role-filters"
            style={{ marginBottom: '16px', overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
            <span style={{ marginRight: '8px', fontWeight: 500, color: 'var(--hb-blue)' }}>
              Filter by Role:
            </span>
            <Flex wrap="nowrap" gap="small">
              {contractRoles.map((role) => (
                <Tag
                  key={role.key}
                  color={primeContractRoleFilters[role.key] ? roleColors[role.key] : undefined}
                  style={{
                    color: primeContractRoleFilters[role.key] ? '#fff' : undefined,
                    width: '120px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '14px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                  onClick={() =>
                    setPrimeContractRoleFilters((prev) => ({
                      ...prev,
                      [role.key]: !prev[role.key],
                    }))
                  }
                >
                  {role.label}
                </Tag>
              ))}
            </Flex>
          </div>
          <TableModuleV2
            data={filteredPrimeContractData.filter((item) => item.task)}
            columns={contractColumns}
            enableFiltering={true}
            enableSearch={true}
            autoSizeOnLoad={true}
          />
        </>
      )}
    </div>
  );

  const renderSubcontract = () => (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <div
            className="responsibility-role-filters"
            style={{ marginBottom: '16px', overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
            <span style={{ marginRight: '8px', fontWeight: 500, color: 'var(--hb-blue)' }}>
              Filter by Role:
            </span>
            <Flex wrap="nowrap" gap="small">
              {projectRoles.map((role) => (
                <Tag
                  key={role.key}
                  color={subcontractRoleFilters[role.key] ? roleColors[role.key] : undefined}
                  style={{
                    color: subcontractRoleFilters[role.key] ? '#fff' : undefined,
                    width: '120px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '14px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                  onClick={() =>
                    setSubcontractRoleFilters((prev) => ({
                      ...prev,
                      [role.key]: !prev[role.key],
                    }))
                  }
                >
                  {role.key}
                </Tag>
              ))}
            </Flex>
          </div>
          <TableModuleV2
            data={filteredSubcontractData.filter((item) => item.task)}
            columns={subcontractColumns}
            enableFiltering={true}
            enableSearch={true}
            autoSizeOnLoad={true}
          />
        </>
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--hb-blue)', marginBottom: '24px' }}>
        Responsibility Matrix Settings
      </h2>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Assigned Team Members</h3>
        <List
          dataSource={allProjectRoles}
          renderItem={(role) => (
            <List.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>{role.label}</span>
                <Radio.Group
                  value={activeRoles.includes(role.key)}
                  onChange={(e) => {
                    if (e.target.value) {
                      setActiveRoles((prev) => [...prev, role.key]);
                    } else {
                      setActiveRoles((prev) => prev.filter((r) => r !== role.key));
                    }
                  }}
                >
                  <Radio value={true}>Enabled</Radio>
                  <Radio value={false}>Disabled</Radio>
                </Radio.Group>
              </Space>
            </List.Item>
          )}
        />
      </div>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Project Team Tasks</h3>
        <List
          dataSource={teamData.filter((item) => item.task)}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => handleEditTask(item)}>
                  Edit
                </Button>,
                <Button
                  type="link"
                  onClick={() => {
                    setResponsibilityToDelete(item);
                    setIsDeleteModalVisible(true);
                  }}
                  danger
                >
                  Delete
                </Button>,
              ]}
            >
              {item.task}
            </List.Item>
          )}
        />
        <div style={{ display: 'flex', marginTop: '16px', gap: '8px' }}>
          <AntInput
            placeholder="Add new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            onClick={async () => {
              if (!newTask.trim()) {
                message.warning('Please enter a task description.');
                return;
              }
              const newResponsibility = {
                id: `NEW-${Date.now()}`,
                category: 'UNCATEGORIZED',
                task: newTask,
                ...allProjectRoles.reduce((acc, role) => {
                  acc[role.key] = '';
                  return acc;
                }, {}),
              };
              const updatedData = await window.electronAPI.addResponsibility(newResponsibility);
              setTeamData(updatedData);
              setNewTask('');
              message.success('Task added successfully!');
            }}
          >
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );

  const handleExport = useCallback(
    (roleKey) => {
      let dataToExport = [];
      if (roleKey === 'all') {
        if (activeTab === 'team-matrix') dataToExport = filteredTeamData.filter((item) => !item.isCategoryHeader);
        else if (activeTab === 'prime-contract') dataToExport = filteredPrimeContractData;
        else if (activeTab === 'subcontract') dataToExport = filteredSubcontractData;
      } else {
        if (activeTab === 'team-matrix') {
          dataToExport = filteredTeamData.filter(
            (item) => !item.isCategoryHeader && (item[roleKey] === 'X' || item[roleKey] === 'Support')
          );
        } else {
          dataToExport =
            activeTab === 'prime-contract' ? filteredPrimeContractData : filteredSubcontractData.filter(
              (item) => item.responsible === roleKey
            );
        }
      }

      const headers = (
        activeTab === 'team-matrix' ? teamColumns : activeTab === 'prime-contract' ? contractColumns : subcontractColumns
      ).map((col) => col.headerName);
      const csvRows = [headers.join(',')];
      dataToExport.forEach((row) => {
        const values = headers.map((header) => {
          const field = (
            activeTab === 'team-matrix'
              ? teamColumns
              : activeTab === 'prime-contract'
              ? contractColumns
              : subcontractColumns
          ).find((col) => col.headerName === header)?.field;
          return `"${row[field] || ''}"`;
        });
        csvRows.push(values.join(','));
      });
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `responsibility-${activeTab}-${roleKey === 'all' ? 'all' : roleKey}.csv`;
      link.click();
    },
    [activeTab, filteredTeamData, filteredPrimeContractData, filteredSubcontractData, teamColumns, contractColumns, subcontractColumns]
  );

  const renderContent = () => {
    if (view === 'settings') return renderSettingsView();

    return (
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Team Matrix" key="team-matrix">
          {renderTeamMatrix()}
        </TabPane>
        <TabPane tab="Prime Contract" key="prime-contract">
          {renderPrimeContract()}
        </TabPane>
        <TabPane tab="Subcontract" key="subcontract">
          {renderSubcontract()}
        </TabPane>
      </Tabs>
    );
  };

  return (
    <div className="responsibility-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      <ComponentHeader
        title={headerContent.title}
        actions={headerContent.actions}
        createOptions={[
          { key: 'team-task', label: 'Create Team Task' },
          { key: 'contract-responsibility', label: 'Create Contract Responsibility' },
        ]}
        onCreateClick={handleCreate}
        onSettingsClick={() => setView(view === 'table' ? 'settings' : 'table')}
        onExport={handleExport}
        exportRoleOptions={
          activeTab === 'team-matrix' ? projectRoles : activeTab === 'prime-contract' ? contractRoles : projectRoles
        }
        enableFontSizeAdjustment={true}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      {renderContent()}
      {isModalVisible && (
        <Modal
          title={
            editingResponsibility
              ? `Edit ${modalType === 'team' ? 'Team Task' : 'Contract Responsibility'}`
              : `Create ${modalType === 'team' ? 'Team Task' : 'Contract Responsibility'}`
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingResponsibility(null);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={editingResponsibility ? handleUpdateTask : handleCreateResponsibility}
            layout="vertical"
            initialValues={
              editingResponsibility
                ? {
                    task: editingResponsibility.task,
                    ...(modalType === 'team'
                      ? projectRoles.reduce((acc, role) => {
                          acc[role.key] = editingResponsibility[role.key] || '';
                          return acc;
                        }, { category: editingResponsibility.category })
                      : {
                          responsible: editingResponsibility.responsible,
                          page: editingResponsibility.page,
                          article: editingResponsibility.article,
                          contract: editingResponsibility.id.startsWith('prime-') ? 'Prime Contract' : 'Subcontract',
                          teamResponsibility: editingResponsibility.teamResponsibility || '',
                        }),
                  }
                : { contract: 'Prime Contract' }
            }
          >
            {modalType === 'contract' && (
              <>
                <Form.Item
                  name="contract"
                  label="Contract"
                  rules={[{ required: true, message: 'Please select a contract type' }]}
                >
                  <Select placeholder="Select contract type">
                    <Option value="Prime Contract">Prime Contract</Option>
                    <Option value="Subcontract">Subcontract</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="page"
                  label="Contract Page #"
                  rules={[{ required: true, message: 'Please enter the contract page number' }]}
                >
                  <AntInput />
                </Form.Item>
                <Form.Item
                  name="article"
                  label="Contract Article Reference"
                  rules={[{ required: true, message: 'Please enter the contract article reference' }]}
                >
                  <AntInput />
                </Form.Item>
              </>
            )}
            {modalType === 'team' && (
              <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter a category' }]}>
                <AntInput />
              </Form.Item>
            )}
            <Form.Item
              name="task"
              label="Contract Item Description"
              rules={[{ required: true, message: 'Please enter a contract item description' }]}
            >
              <AntInput />
            </Form.Item>
            {modalType === 'team' ? (
              projectRoles.map((role) => (
                <Form.Item key={role.key} name={role.key} label={`${role.key} Role`}>
                  <Select placeholder={`Assign ${role.key}`}>
                    <Option value="">None</Option>
                    <Option value="X">Primary (X)</Option>
                    <Option value="Support">Support</Option>
                  </Select>
                </Form.Item>
              ))
            ) : (
              <>
                <Form.Item
                  name="responsible"
                  label="Responsible"
                  rules={[{ required: true, message: 'Please assign a responsible party' }]}
                >
                  <Select placeholder="Assign responsibility">
                    <Option value="">None</Option>
                    {form.getFieldValue('contract') === 'Subcontract'
                      ? allProjectRoles.map((role) => (
                          <Option key={role.key} value={role.key}>
                            {role.label}
                          </Option>
                        ))
                      : allContractRoles.map((role) => (
                          <Option key={role.key} value={role.key}>
                            {role.label}
                          </Option>
                        ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.responsible !== currentValues.responsible || prevValues.contract !== currentValues.contract
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('contract') === 'Prime Contract' && getFieldValue('responsible') === 'C' && (
                      <Form.Item
                        name="teamResponsibility"
                        label="Team Responsibility"
                        rules={[{ required: true, message: 'Please select a team responsibility' }]}
                      >
                        <Select placeholder="Select a project role">
                          {allProjectRoles.map((role) => (
                            <Option key={role.key} value={role.key}>
                              {role.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingResponsibility ? 'Update' : 'Create'}
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingResponsibility(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {isDeleteModalVisible && (
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalVisible}
          onOk={handleDeleteResponsibility}
          onCancel={() => {
            setIsDeleteModalVisible(false);
            setResponsibilityToDelete(null);
            form.resetFields();
          }}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete this responsibility: <strong>{responsibilityToDelete?.task}</strong>?
          </p>
        </Modal>
      )}
    </div>
  );
};

ResponsibilityV2.propTypes = {
  selectedProject: PropTypes.shape({
    projectNumber: PropTypes.string,
    name: PropTypes.string,
  }),
  headerContent: PropTypes.shape({
    title: PropTypes.node.isRequired,
    actions: PropTypes.node,
  }).isRequired,
};

ResponsibilityV2.defaultProps = {
  selectedProject: null,
};

export default ResponsibilityV2;