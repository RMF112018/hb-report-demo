// src/main/db.js
// Manages database initialization, migrations, and data operations for HB Report using Sequelize
// Import this module in main.js for app startup or sync.js for initialization
// Reference: https://sequelize.org/docs/v6/

import { Sequelize, DataTypes, QueryTypes } from 'sequelize';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import getConfig from './database.config.js';
import bcrypt from 'bcrypt';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const env = process.env.NODE_ENV || 'development';

let sequelize;
let SchemaVersion, User, Token, CSICode, ProjectType, ContractType, HBPosition, Project, Owner, HBTeam, CostCode, Task, ScheduleExtension, Commitment, Buyout, Allowance, ValueEngineering, LongLeadItem, ForecastPeriod, ForecastValue, Budget, History, ProjectUser, BudgetDetail, BudgetAmount, ChangeEvent, ChangeEventLineItem;

// Define all models and register them explicitly
function defineModels() {
  SchemaVersion = sequelize.define('SchemaVersion', {
    version: { type: DataTypes.INTEGER, primaryKey: true },
    applied_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'schema_version', timestamps: false });

  User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    procore_user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    company_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    business_id: DataTypes.STRING,
    role: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    country_code: DataTypes.STRING,
    state_code: DataTypes.STRING,
    zip: DataTypes.STRING,
    avatar: DataTypes.STRING,
    business_phone: DataTypes.STRING,
    is_employee: { type: DataTypes.BOOLEAN, defaultValue: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'users', timestamps: false });

  Token = sequelize.define('Token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING(255), allowNull: false },
    access_token: { type: DataTypes.STRING, allowNull: false },
    refresh_token: { type: DataTypes.STRING, allowNull: true },
    expires_at: { type: DataTypes.INTEGER, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'tokens', timestamps: false });

  CSICode = sequelize.define('CSICode', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tier: { type: DataTypes.INTEGER, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'csi_codes', timestamps: false, indexes: [{ unique: true, fields: ['code', 'tier'] }] });

  ProjectType = sequelize.define('ProjectType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING, allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'project_types', timestamps: false });

  ContractType = sequelize.define('ContractType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING, allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'contract_types', timestamps: false });

  HBPosition = sequelize.define('HBPosition', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    position: { type: DataTypes.STRING, allowNull: false },
    division: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    hierarchy: { type: DataTypes.INTEGER, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'hb_positions', timestamps: false, indexes: [{ unique: true, fields: ['position', 'division'] }] });

  Project = sequelize.define('Project', {
    project_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    procore_id: { type: DataTypes.INTEGER, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, unique: true },
    company_id: { type: DataTypes.INTEGER, defaultValue: 5280 },
    type_id: DataTypes.INTEGER,
    contract_type_id: DataTypes.INTEGER,
    street_address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    start_date: DataTypes.DATEONLY,
    original_completion_date: DataTypes.DATEONLY,
    approved_completion_date: DataTypes.DATEONLY,
    duration: DataTypes.INTEGER,
    approved_extensions: { type: DataTypes.INTEGER, defaultValue: 0 },
    contract_value: DataTypes.FLOAT,
    approved_changes: { type: DataTypes.FLOAT, defaultValue: 0 },
    approved_value: {
      type: DataTypes.VIRTUAL,
      get() { return this.contract_value + this.approved_changes; },
    },
    contingency_original: DataTypes.FLOAT,
    contingency_approved: DataTypes.FLOAT,
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'projects', timestamps: false });

  Owner = sequelize.define('Owner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    contact: DataTypes.STRING,
    lending_partner: DataTypes.STRING,
    contract_executed: DataTypes.DATEONLY,
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'owners', timestamps: false });

  HBTeam = sequelize.define('HBTeam', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    position_id: { type: DataTypes.INTEGER, allowNull: false },
    member_name: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'hb_team', timestamps: false });

  CostCode = sequelize.define('CostCode', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: DataTypes.INTEGER,
    procore_id: { type: DataTypes.INTEGER, unique: true },
    code: { type: DataTypes.STRING, allowNull: false },
    full_code: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    budgeted: { type: DataTypes.BOOLEAN, defaultValue: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'cost_codes', timestamps: false, indexes: [{ unique: true, fields: ['project_id', 'full_code'] }] });

  Task = sequelize.define('Task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    procore_id: { type: DataTypes.INTEGER, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    finish_date: DataTypes.DATEONLY,
    duration: DataTypes.INTEGER,
    percent_complete: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    is_critical: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_milestone: { type: DataTypes.BOOLEAN, defaultValue: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'tasks', timestamps: false });

  ScheduleExtension = sequelize.define('ScheduleExtension', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    milestone: { type: DataTypes.STRING, allowNull: false },
    approved_time_extensions: { type: DataTypes.INTEGER, defaultValue: 0 },
    pending_extension_req: { type: DataTypes.INTEGER, defaultValue: 0 },
    extensions_requested: { type: DataTypes.INTEGER, defaultValue: 0 },
    adverse_weather_days: { type: DataTypes.INTEGER, defaultValue: 0 },
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    details: DataTypes.TEXT,
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'schedule_extensions', timestamps: false });

  Commitment = sequelize.define('Commitment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, defaultValue: 'placeholder' },
    vendor: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'Draft' },
    original_contract_amount: DataTypes.FLOAT,
    approved_change_orders: DataTypes.FLOAT,
    revised_contract_amount: {
      type: DataTypes.VIRTUAL,
      get() { return this.original_contract_amount + this.approved_change_orders; },
    },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'commitments', timestamps: false });

  Buyout = sequelize.define('Buyout', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    cost_code_id: DataTypes.INTEGER,
    subcontractor: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    commitment_id: DataTypes.INTEGER,
    variance: DataTypes.FLOAT,
    contract_executed: DataTypes.DATEONLY,
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'buyout', timestamps: false });

  Allowance = sequelize.define('Allowance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    buyout_id: { type: DataTypes.INTEGER, allowNull: false },
    item: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    reconciled: { type: DataTypes.BOOLEAN, defaultValue: false },
    reconciliation_value: DataTypes.FLOAT,
    variance: { type: DataTypes.FLOAT, defaultValue: 0 },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'allowances', timestamps: false });

  ValueEngineering = sequelize.define('ValueEngineering', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    buyout_id: { type: DataTypes.INTEGER, allowNull: false },
    item: { type: DataTypes.STRING, allowNull: false },
    original_value: { type: DataTypes.FLOAT, defaultValue: 0 },
    ve_value: { type: DataTypes.FLOAT, defaultValue: 0 },
    savings: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'value_engineering', timestamps: false });

  LongLeadItem = sequelize.define('LongLeadItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    buyout_id: { type: DataTypes.INTEGER, allowNull: false },
    item: { type: DataTypes.STRING, allowNull: false },
    lead_time: DataTypes.INTEGER,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'long_lead_items', timestamps: false });

  ForecastPeriod = sequelize.define('ForecastPeriod', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false },
    sort_order: DataTypes.INTEGER,
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'forecast_periods', timestamps: false, indexes: [{ unique: true, fields: ['project_id', 'label'] }] });

  ForecastValue = sequelize.define('ForecastValue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    cost_code_id: { type: DataTypes.INTEGER, allowNull: false },
    period_id: { type: DataTypes.INTEGER, allowNull: false },
    original_value: { type: DataTypes.FLOAT, defaultValue: 0 },
    projected_value: { type: DataTypes.FLOAT, defaultValue: 0 },
    actual_value: { type: DataTypes.FLOAT, defaultValue: 0 },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'forecast_values', timestamps: false, indexes: [{ unique: true, fields: ['project_id', 'cost_code_id', 'period_id'] }] });

  Budget = sequelize.define('Budget', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    period_id: { type: DataTypes.INTEGER, allowNull: false },
    cost_code_id: { type: DataTypes.INTEGER, allowNull: false },
    original_budget_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
    revised_budget_amount: DataTypes.FLOAT,
    committed_costs: { type: DataTypes.FLOAT, defaultValue: 0 },
    projected_costs: { type: DataTypes.FLOAT, defaultValue: 0 },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'budget', timestamps: false });

  History = sequelize.define('History', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    entity_type: { type: DataTypes.STRING, allowNull: false },
    entity_id: { type: DataTypes.INTEGER, allowNull: false },
    data: { type: DataTypes.JSON, allowNull: false },
    version: { type: DataTypes.INTEGER, allowNull: false },
    superseded_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  }, { tableName: 'history', timestamps: false });

  ProjectUser = sequelize.define('ProjectUser', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role: DataTypes.STRING,
  }, { tableName: 'project_users', timestamps: false });

  BudgetDetail = sequelize.define('BudgetDetail', {
    id: { type: DataTypes.STRING, primaryKey: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    item: DataTypes.STRING,
    wbs_code_id: DataTypes.INTEGER,
    detail_type_id: DataTypes.STRING,
    cost_code_id: DataTypes.INTEGER,
  }, { tableName: 'budget_details', timestamps: false });

  BudgetAmount = sequelize.define('BudgetAmount', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    budget_detail_id: { type: DataTypes.STRING, allowNull: false },
    category_key: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
  }, { tableName: 'budget_amounts', timestamps: false });

  ChangeEvent = sequelize.define('ChangeEvent', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    title: DataTypes.STRING,
    number: DataTypes.INTEGER,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, { tableName: 'change_events', timestamps: false });

  ChangeEventLineItem = sequelize.define('ChangeEventLineItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    change_event_id: { type: DataTypes.INTEGER, allowNull: false },
    description: DataTypes.TEXT,
    estimated_cost_amount: DataTypes.FLOAT,
    cost_code_id: DataTypes.INTEGER,
  }, { tableName: 'change_event_line_items', timestamps: false });

  // Define relationships
  Project.belongsTo(ProjectType, { foreignKey: 'type_id' });
  ProjectType.hasMany(Project, { foreignKey: 'type_id' });
  Project.belongsTo(ContractType, { foreignKey: 'contract_type_id' });
  ContractType.hasMany(Project, { foreignKey: 'contract_type_id' });
  Project.hasMany(Owner, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  Owner.belongsTo(Project, { foreignKey: 'project_id' });
  Project.hasMany(HBTeam, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  HBTeam.belongsTo(Project, { foreignKey: 'project_id' });
  HBTeam.belongsTo(HBPosition, { foreignKey: 'position_id' });
  HBPosition.hasMany(HBTeam, { foreignKey: 'position_id' });
  Project.hasMany(CostCode, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  CostCode.belongsTo(Project, { foreignKey: 'project_id' });
  Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  Task.belongsTo(Project, { foreignKey: 'project_id' });
  Task.hasMany(ScheduleExtension, { foreignKey: 'task_id', onDelete: 'CASCADE' });
  ScheduleExtension.belongsTo(Task, { foreignKey: 'task_id' });
  Project.hasMany(ScheduleExtension, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  ScheduleExtension.belongsTo(Project, { foreignKey: 'project_id' });
  Project.hasMany(Commitment, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  Commitment.belongsTo(Project, { foreignKey: 'project_id' });
  Project.hasMany(Buyout, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  Buyout.belongsTo(Project, { foreignKey: 'project_id' });
  Buyout.belongsTo(CostCode, { foreignKey: 'cost_code_id' });
  CostCode.hasMany(Buyout, { foreignKey: 'cost_code_id' });
  Buyout.belongsTo(Commitment, { foreignKey: 'commitment_id' });
  Commitment.hasMany(Buyout, { foreignKey: 'commitment_id' });
  Buyout.hasMany(Allowance, { foreignKey: 'buyout_id', onDelete: 'CASCADE' });
  Allowance.belongsTo(Buyout, { foreignKey: 'buyout_id' });
  Buyout.hasMany(ValueEngineering, { foreignKey: 'buyout_id', onDelete: 'CASCADE' });
  ValueEngineering.belongsTo(Buyout, { foreignKey: 'buyout_id' });
  Buyout.hasMany(LongLeadItem, { foreignKey: 'buyout_id', onDelete: 'CASCADE' });
  LongLeadItem.belongsTo(Buyout, { foreignKey: 'buyout_id' });
  Project.hasMany(ForecastPeriod, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  ForecastPeriod.belongsTo(Project, { foreignKey: 'project_id' });
  Project.hasMany(ForecastValue, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  ForecastValue.belongsTo(Project, { foreignKey: 'project_id' });
  CostCode.hasMany(ForecastValue, { foreignKey: 'cost_code_id', onDelete: 'CASCADE' });
  ForecastValue.belongsTo(CostCode, { foreignKey: 'cost_code_id' });
  ForecastPeriod.hasMany(ForecastValue, { foreignKey: 'period_id', onDelete: 'CASCADE' });
  ForecastValue.belongsTo(ForecastPeriod, { foreignKey: 'period_id' });
  Project.hasMany(Budget, { foreignKey: 'project_id', onDelete: 'CASCADE' });
  Budget.belongsTo(Project, { foreignKey: 'project_id' });
  ForecastPeriod.hasMany(Budget, { foreignKey: 'period_id', onDelete: 'CASCADE' });
  Budget.belongsTo(ForecastPeriod, { foreignKey: 'period_id' });
  CostCode.hasMany(Budget, { foreignKey: 'cost_code_id', onDelete: 'CASCADE' });
  Budget.belongsTo(CostCode, { foreignKey: 'cost_code_id' });
  Project.hasMany(ProjectUser, { foreignKey: 'project_id' });
  ProjectUser.belongsTo(Project, { foreignKey: 'project_id' });
  User.hasMany(ProjectUser, { foreignKey: 'user_id' });
  ProjectUser.belongsTo(User, { foreignKey: 'user_id' });
  Project.hasMany(BudgetDetail, { foreignKey: 'project_id' });
  BudgetDetail.belongsTo(Project, { foreignKey: 'project_id' });
  BudgetDetail.hasMany(BudgetAmount, { foreignKey: 'budget_detail_id' });
  BudgetAmount.belongsTo(BudgetDetail, { foreignKey: 'budget_detail_id' });
  Project.hasMany(ChangeEvent, { foreignKey: 'project_id' });
  ChangeEvent.belongsTo(Project, { foreignKey: 'project_id' });
  ChangeEvent.hasMany(ChangeEventLineItem, { foreignKey: 'change_event_id' });
  ChangeEventLineItem.belongsTo(ChangeEvent, { foreignKey: 'change_event_id' });
}

// Migration definitions
const migrations = [
  {
    version: 1,
    up: async () => {
      await sequelize.sync({ force: true });
      logger.info('Applied initial schema creation (version 1)');
    }
  },
  {
    version: 2,
    up: async () => {
      await sequelize.sync();
      logger.info('Applied schema update (version 2)');
    }
  },
];

// Initializes database with schema sync and lookup tables (for sync.js)
async function initDatabase(forceReset = false) {
  const config = getConfig()[env];
  sequelize = new Sequelize({
    ...config,
    storage: config.storage,
  });
  defineModels();
  try {
    await sequelize.authenticate();
    logger.info('Database connection established', { path: config.storage });

    logger.info('Models before sync', { models: Object.keys(sequelize.models) });
    await sequelize.sync({ force: forceReset });
    logger.info('Database schema synchronized', { force: forceReset });

    // Re-register models post-sync to ensure they’re in sequelize.models
    defineModels(); // Re-run to bind models
    logger.info('Models after sync', { models: Object.keys(sequelize.models) });

    const tokenAttributes = Token.rawAttributes;
    if (!tokenAttributes.user_id) {
      logger.error('Token model missing user_id attribute', { attributes: Object.keys(tokenAttributes) });
      throw new Error('Schema mismatch: user_id not defined in Token model');
    }
    logger.info('Token table schema validated', { user_id: tokenAttributes.user_id.type.toString() });

    if (!User || !sequelize.models.User) {
      logger.error('User model not defined or registered', { User: !!User, models: Object.keys(sequelize.models) });
      throw new Error('User model not found after sync');
    }
    logger.info('User model verified', { fields: Object.keys(User.rawAttributes) });

    await applyMigrations();
    const projectTypes = [
      { type: 'New Construction', code: 'NEW' }, { type: 'Renovation', code: 'REN' },
      { type: 'Restoration', code: 'REST' }, { type: 'Retrofit', code: 'RETRO' },
      { type: 'Demolition', code: 'DEMO' }, { type: 'Maintenance', code: 'MAINT' },
      { type: 'Expansion', code: 'EXP' }, { type: 'Reconstruction', code: 'RECON' },
      { type: 'Tenant Improvement', code: 'TI' }, { type: 'Fit-Out', code: 'FO' },
      { type: 'Adaptive Reuse', code: 'ADRE' }, { type: 'Remodel', code: 'REMO' },
    ];
    const contractTypes = [
      { type: 'Construction Management', code: 'CM' }, { type: 'Cost-Plus', code: 'CP' },
      { type: 'Design - Bid - Build', code: 'DBB' }, { type: 'Design - Build', code: 'DB' },
      { type: 'Guaranteed Maximum', code: 'GMP' }, { type: 'Incentive', code: 'INC' },
      { type: 'Integrated Project Delivery', code: 'IPD' }, { type: 'Joint Venture', code: 'JV' },
      { type: 'Lump Sum', code: 'LS' }, { type: 'Percentage of Construction Cost', code: 'PCC' },
      { type: 'Progressive Design - Build', code: 'PDB' }, { type: 'Subcontract', code: 'SUB' },
      { type: 'Target Cost', code: 'TC' }, { type: 'Time and Materials', code: 'TM' },
      { type: 'Unit Price', code: 'UP' },
    ];
    await ProjectType.bulkCreate(projectTypes, {
      updateOnDuplicate: ['code', 'updated_at'],
      fields: ['type', 'code', 'version', 'created_at', 'updated_at'],
    });
    logger.info(`Populated ${projectTypes.length} project types`);
    await ContractType.bulkCreate(contractTypes, {
      updateOnDuplicate: ['code', 'updated_at'],
      fields: ['type', 'code', 'version', 'created_at', 'updated_at'],
    });
    logger.info(`Populated ${contractTypes.length} contract types`);
    logger.info('Database initialized with lookup tables');
  } catch (error) {
    logger.error(`Init failed: ${error.message}`, { stack: error.stack });
    throw error;
  }
}

// Lightweight connection for app runtime (for main.js)
async function connectDatabase() {
  if (!sequelize) {
    const config = getConfig()[env];
    sequelize = new Sequelize({
      ...config,
      storage: config.storage,
    });
    defineModels();
  }
  try {
    await sequelize.authenticate();
    logger.info('Database connection authenticated', { path: config.storage });
  } catch (error) {
    logger.error(`Connection failed: ${error.message}`, { stack: error.stack });
    throw error;
  }
}

async function applyMigrations() {
  if (!sequelize) throw new Error('Database not initialized');
  const [current] = await SchemaVersion.findAll({ order: [['version', 'DESC']], limit: 1 });
  const currentVersion = current ? current.version : 0;
  logger.info(`Current schema version: ${currentVersion}`);
  const pendingMigrations = migrations.filter(m => m.version > currentVersion);
  for (const migration of pendingMigrations) {
    await migration.up();
    await SchemaVersion.upsert({ version: migration.version });
    logger.info(`Applied migration version ${migration.version}`);
  }
  if (!pendingMigrations.length) logger.info('Database schema up to date');
}

/**
 * Upserts an entity into the specified table with versioning and history tracking
 * @param {string} table - The table name to upsert into
 * @param {Object} entity - The entity data to upsert
 * @param {Object} [options] - Optional transaction options
 * @returns {Promise<void>}
 */
async function upsertEntity(table, entity, options = {}) {
  if (!sequelize) throw new Error('Database not initialized');
  const Model = {
    users: User,
    tokens: Token,
    csi_codes: CSICode,
    project_types: ProjectType,
    contract_types: ContractType,
    hb_positions: HBPosition,
    projects: Project,
    owners: Owner,
    hb_team: HBTeam,
    cost_codes: CostCode,
    tasks: Task,
    schedule_extensions: ScheduleExtension,
    commitments: Commitment,
    buyout: Buyout,
    allowances: Allowance,
    value_engineering: ValueEngineering,
    long_lead_items: LongLeadItem,
    forecast_periods: ForecastPeriod,
    forecast_values: ForecastValue,
    budget: Budget,
    history: History,
    project_users: ProjectUser,
    budget_details: BudgetDetail,
    budget_amounts: BudgetAmount,
    change_events: ChangeEvent,
    change_event_line_items: ChangeEventLineItem,
  }[table];

  if (!Model || !entity) throw new Error('Invalid table or entity data');

  const idField = table === 'projects' ? 'project_id' : 'id';
  let whereClause;

  if (table === 'tokens') {
    if (!entity.user_id) throw new Error('user_id is required for tokens');
    whereClause = { user_id: entity.user_id };
  } else if (table === 'project_types' || table === 'contract_types') {
    whereClause = { type: entity.type };
  } else if (table === 'hb_positions') {
    if (!entity.position || !entity.division) throw new Error('position and division are required for hb_positions');
    whereClause = { position: entity.position, division: entity.division };
  } else if (table === 'tasks') {
    if (!entity.project_id || !entity.name) throw new Error('project_id and name are required for tasks');
    whereClause = { project_id: entity.project_id, name: entity.name };
  } else if (table === 'users') {
    if (!entity.procore_user_id) throw new Error('procore_user_id is required for users');
    whereClause = { procore_user_id: entity.procore_user_id };
  } else {
    whereClause = { [idField]: entity[idField] };
  }

  if (whereClause[idField] === undefined && !['tokens', 'project_types', 'contract_types', 'hb_positions', 'tasks', 'users'].includes(table)) {
    logger.warn(`Entity missing ${idField} for table ${table}`, { entity });
    throw new Error(`Entity missing required ${idField} for table ${table}`);
  }

  logger.debug(`Upserting ${table} entity`, { whereClause, entity });

  const existing = await Model.findOne({ where: whereClause, transaction: options.transaction });
  const version = existing ? existing.version + 1 : 1;

  if (existing) {
    await sequelize.query(
      'INSERT INTO history (entity_type, entity_id, data, version) VALUES (:type, :id, :data, :version)',
      {
        replacements: {
          type: table,
          id: existing[idField] || existing.procore_user_id || existing.user_id || 0,
          data: JSON.stringify(existing.toJSON()),
          version: existing.version,
        },
        type: QueryTypes.INSERT,
        transaction: options.transaction,
      }
    );
  }

  if (entity[idField] === undefined) delete entity[idField];

  await Model.upsert(
    { ...entity, version, updated_at: new Date() },
    { transaction: options.transaction }
  );
  logger.debug(`Upserted entity into ${table}`, { id: entity[idField] || entity.procore_user_id || entity.user_id || entity.type || `${entity.position}-${entity.division}` || `${entity.project_id}-${entity.name}` });
}

/**
 * Performs a batch upsert operation on a specified table
 * @param {string} tableName - The name of the table
 * @param {Array<Object>} entities - Array of entity objects to upsert
 * @returns {Promise<void>}
 */
async function batchUpsert(tableName, entities, options = {}) {
  if (!sequelize) throw new Error('Database not initialized');
  const normalizedTableName = tableName.toLowerCase();
  const model = {
    users: User,
    tokens: Token,
    csi_codes: CSICode,
    project_types: ProjectType,
    contract_types: ContractType,
    hb_positions: HBPosition,
    projects: Project,
    owners: Owner,
    hb_team: HBTeam,
    cost_codes: CostCode,
    tasks: Task,
    schedule_extensions: ScheduleExtension,
    commitments: Commitment,
    buyout: Buyout,
    allowances: Allowance,
    value_engineering: ValueEngineering,
    long_lead_items: LongLeadItem,
    forecast_periods: ForecastPeriod,
    forecast_values: ForecastValue,
    budget: Budget,
    history: History,
    project_users: ProjectUser,
    budget_details: BudgetDetail,
    budget_amounts: BudgetAmount,
    change_events: ChangeEvent,
    change_event_line_items: ChangeEventLineItem,
  }[normalizedTableName];

  if (!model) throw new Error(`Model for table ${normalizedTableName} not found`);
  try {
    const upsertOptions = {
      updateOnDuplicate: Object.keys(model.rawAttributes).filter(key => key !== 'id' && key !== 'created_at'),
    };
    if (options.transaction) upsertOptions.transaction = options.transaction; // Safely add transaction if provided
    await model.bulkCreate(entities, upsertOptions);
    logger.debug(`Batch upserted ${entities.length} entities into ${normalizedTableName}`);
  } catch (error) {
    logger.error(`Batch upsert failed for ${normalizedTableName}`, { message: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Retrieves a token from the tokens table by user_id
 * @param {string} userId - The user_id to lookup
 * @returns {Promise<Object|null>} Token object or null if not found
 */
async function getTokenByUserId(userId) {
  if (!sequelize) throw new Error('Database not initialized');
  return await Token.findOne({ where: { user_id: userId }, raw: true });
}

/**
 * Retrieves all active projects from the database
 * @returns {Promise<Object[]>} Array of project objects
 */
async function getProjects() {
  if (!sequelize) throw new Error('Database not initialized');
  return await Project.findAll({ where: { active: true }, raw: true });
}

/**
 * Executes an array of operations within a single transaction
 * @param {Function[]} operations - Array of async functions to execute
 * @returns {Promise<void>}
 */
async function runInTransaction(operations) {
  if (!sequelize) throw new Error('Database not initialized');
  await sequelize.transaction(async (t) => {
    await Promise.all(operations.map(op => op({ transaction: t })));
  });
}

/**
 * Syncs current user data from Procore /me endpoint
 * @param {Object} userData - User data from Procore /me
 * @returns {Promise<void>}
 */
async function syncCurrentUser(userData) {
  if (!sequelize) throw new Error('Database not initialized');
  await upsertEntity('users', {
    procore_user_id: userData.id,
    email: userData.login,
    first_name: userData.name.split(' ')[0],
    last_name: userData.name.split(' ').slice(1).join(' ') || '',
  });
}

/**
 * Syncs company users from Procore Company Users endpoint
 * @param {Object[]} users - Array of user data from Procore
 * @returns {Promise<void>}
 */
async function syncCompanyUsers(users) {
  if (!sequelize) throw new Error('Database not initialized');
  const entities = users.map(user => ({
    procore_user_id: user.id,
    email: user.email_address,
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ').slice(1).join(' ') || '',
    business_id: user.business_id,
    address: user.address,
    avatar: user.avatar,
    business_phone: user.business_phone,
    city: user.city,
    country_code: user.country_code,
    state_code: user.state_code,
    zip: user.zip,
    is_employee: user.is_employee,
  }));
  await batchUpsert('users', entities);
}

/**
 * Syncs projects from Procore Company Projects endpoint
 * @param {Object[]} projects - Array of project data from Procore
 * @returns {Promise<void>}
 */
async function syncProjects(projects) {
  if (!sequelize) throw new Error('Database not initialized');
  const entities = projects.map(project => ({
    procore_id: project.id,
    name: project.name,
    street_address: project.address?.street,
    city: project.address?.city,
    state: project.address?.state_code,
    zip: project.address?.zip,
    active: project.status_name === 'Active',
  }));
  await batchUpsert('projects', entities);
}

/**
 * Syncs project users and their roles from Procore Project Users and Project User Roles endpoints
 * @param {number} projectId - Procore project ID
 * @param {Object[]} projectUsers - Array of project user data
 * @param {Object[]} userRoles - Array of user role data
 * @returns {Promise<void>}
 */
async function syncProjectUsers(projectId, projectUsers, userRoles) {
  if (!sequelize) throw new Error('Database not initialized');
  const entities = projectUsers.map(pu => ({
    project_id: projectId,
    user_id: pu.id,
    role: userRoles.find(r => r.user_id === pu.id)?.role || null,
  }));
  await batchUpsert('project_users', entities);
}

/**
 * Syncs commitments from Procore List of Commitments endpoint
 * @param {number} projectId - Procore project ID
 * @param {Object[]} commitments - Array of commitment data
 * @returns {Promise<void>}
 */
async function syncCommitments(projectId, commitments) {
  if (!sequelize) throw new Error('Database not initialized');
  const entities = commitments.map(commitment => ({
    id: commitment.id,
    project_id: projectId,
    number: commitment.number,
    title: commitment.title,
    vendor: commitment.vendor?.name,
    status: commitment.status,
    original_contract_amount: commitment.original_contract_amount,
    approved_change_orders: commitment.approved_change_orders,
  }));
  await batchUpsert('commitments', entities);
}

/**
 * Syncs budget details from Procore Budget Detail Items endpoint
 * @param {number} projectId - Procore project ID
 * @param {Object[]} budgetDetails - Array of budget detail data
 * @returns {Promise<void>}
 */
async function syncBudgetDetails(projectId, budgetDetails) {
  if (!sequelize) throw new Error('Database not initialized');
  for (const detail of budgetDetails) {
    await upsertEntity('budget_details', {
      id: detail.id,
      project_id: projectId,
      item: detail.item,
      wbs_code_id: detail.wbs_code?.id,
      detail_type_id: detail.detail_type?.id,
      cost_code_id: detail.cost_code?.id,
    });
    for (const [key, amount] of Object.entries(detail)) {
      if (/^\d+$/.test(key)) {
        await upsertEntity('budget_amounts', {
          budget_detail_id: detail.id,
          category_key: key,
          amount: parseFloat(amount),
        });
      }
    }
  }
}

/**
 * Syncs change events from Procore List Change Events endpoint
 * @param {number} projectId - Procore project ID
 * @param {Object[]} changeEvents - Array of change event data
 * @returns {Promise<void>}
 */
async function syncChangeEvents(projectId, changeEvents) {
  if (!sequelize) throw new Error('Database not initialized');
  for (const event of changeEvents) {
    await upsertEntity('change_events', {
      id: event.id,
      project_id: projectId,
      title: event.title,
      number: event.number,
      status: event.status,
      description: event.description,
    });
    for (const lineItem of event.change_event_line_items || []) {
      await upsertEntity('change_event_line_items', {
        id: lineItem.id,
        change_event_id: event.id,
        description: lineItem.description,
        estimated_cost_amount: parseFloat(lineItem.estimated_cost_amount),
        cost_code_id: lineItem.cost_code?.id,
      });
    }
  }
}

/**
 * Retrieves all active projects for a specific user based on their Procore user ID
 * @param {number} procoreUserId - Procore user ID
 * @returns {Promise<Object[]>} Array of project objects
 */
async function getProjectsForUser(procoreUserId) {
  if (!sequelize) throw new Error('Database not initialized');
  return await Project.findAll({
    where: { active: true },
    include: [{ model: ProjectUser, where: { user_id: procoreUserId } }],
    raw: true,
  });
}

/**
 * Retrieves commitments for a specific user based on their Procore user ID
 * @param {number} procoreUserId - Procore user ID
 * @returns {Promise<Object[]>} Array of commitment objects
 */
async function getCommitmentsForUser(procoreUserId) {
  if (!sequelize) throw new Error('Database not initialized');
  return await Commitment.findAll({
    include: [{ model: Project, include: [{ model: ProjectUser, where: { user_id: procoreUserId } }] }],
    raw: true,
  });
}

/**
 * Retrieves budget details for a specific user based on their Procore user ID
 * @param {number} procoreUserId - Procore user ID
 * @returns {Promise<Object[]>} Array of budget detail objects with amounts
 */
async function getBudgetDetailsForUser(procoreUserId) {
  if (!sequelize) throw new Error('Database not initialized');
  return await BudgetDetail.findAll({
    include: [
      { model: BudgetAmount },
      { model: Project, include: [{ model: ProjectUser, where: { user_id: procoreUserId } }] },
    ],
    raw: true,
    nest: true,
  });
}

/**
 * Retrieves change events for a specific user based on their Procore user ID
 * @param {number} procoreUserId - Procore user ID
 * @returns {Promise<Object[]>} Array of change event objects with line items
 */
async function getChangeEventsForUser(procoreUserId) {
  if (!sequelize) throw new Error('Database not initialized');
  return await ChangeEvent.findAll({
    include: [
      { model: ChangeEventLineItem },
      { model: Project, include: [{ model: ProjectUser, where: { user_id: procoreUserId } }] },
    ],
    raw: true,
    nest: true,
  });
}

/**
 * Authenticates a user with email and password, returning the procore_user_id if successful
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<number>} Procore user ID
 */
async function login(email, password) {
  if (!sequelize) throw new Error('Database not initialized');
  const user = await User.findOne({ where: { email }, raw: true });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('Invalid credentials');
  }
  return user.procore_user_id;
}

/**
 * Removes stale tokens from the tokens table where expires_at is in the past
 * @returns {Promise<void>}
 */
async function clearStaleTokens() {
  if (!sequelize) throw new Error('Database not initialized');
  const currentTime = Math.floor(Date.now() / 1000);
  const deleted = await Token.destroy({ where: { expires_at: { [Sequelize.Op.lt]: currentTime } } });
  logger.info(`Cleared ${deleted} stale tokens from database`);
}

/**
 * Closes the database connection gracefully
 * @returns {Promise<void>}
 */
async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    logger.info('Database connection closed');
    sequelize = null;
  } else {
    logger.info('No database connection to close');
  }
}

/**
 * Gets a setting from the settings table (assuming it exists)
 * @param {string} key - Setting key
 * @returns {Promise<string|null>}
 */
async function getSetting(key) {
  if (!sequelize) throw new Error('Database not initialized');
  const [result] = await sequelize.query(
    'SELECT value FROM settings WHERE key = :key',
    { replacements: { key }, type: QueryTypes.SELECT }
  );
  return result ? result.value : null;
}

/**
 * Sets a setting in the settings table (assuming it exists)
 * @param {string} key - Setting key
 * @param {string} value - Setting value
 * @returns {Promise<void>}
 */
async function setSetting(key, value) {
  if (!sequelize) throw new Error('Database not initialized');
  await sequelize.query(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (:key, :value)',
    { replacements: { key, value }, type: QueryTypes.INSERT }
  );
}

export {
  upsertEntity,
  getProjects,
  runInTransaction,
  batchUpsert,
  sequelize as db,
  initDatabase,
  connectDatabase,
  closeDatabase,
  clearStaleTokens,
  getSetting,
  setSetting,
  syncCurrentUser,
  syncCompanyUsers,
  syncProjects,
  syncProjectUsers,
  syncCommitments,
  syncBudgetDetails,
  syncChangeEvents,
  getProjectsForUser,
  getCommitmentsForUser,
  getBudgetDetailsForUser,
  getChangeEventsForUser,
  login,
  getTokenByUserId,
};