// ============================================================
// PeopleSync — Constants & RBAC Configuration
// ============================================================

// --- Roles ---
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_ADMIN: 'hr_admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const ROLE_HIERARCHY = [
  ROLES.SUPER_ADMIN,
  ROLES.HR_ADMIN,
  ROLES.MANAGER,
  ROLES.EMPLOYEE,
];

// --- Granular Permissions ---
export const PERMISSIONS = {
  // Users
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',

  // Organization
  ORG_MANAGE: 'org:manage',
  DEPARTMENT_MANAGE: 'department:manage',
  TEAM_MANAGE: 'team:manage',
  DESIGNATION_MANAGE: 'designation:manage',

  // Attendance
  ATTENDANCE_READ: 'attendance:read',
  ATTENDANCE_MANAGE: 'attendance:manage',
  ATTENDANCE_READ_ALL: 'attendance:read_all',

  // Leave
  LEAVE_REQUEST: 'leave:request',
  LEAVE_APPROVE: 'leave:approve',
  LEAVE_MANAGE: 'leave:manage',

  // Payroll
  PAYROLL_READ: 'payroll:read',
  PAYROLL_MANAGE: 'payroll:manage',

  // Tasks
  TASK_CREATE: 'task:create',
  TASK_READ: 'task:read',
  TASK_MANAGE: 'task:manage',

  // Announcements
  ANNOUNCEMENT_CREATE: 'announcement:create',
  ANNOUNCEMENT_READ: 'announcement:read',

  // Recruitment
  RECRUITMENT_MANAGE: 'recruitment:manage',

  // Performance
  PERFORMANCE_READ: 'performance:read',
  PERFORMANCE_MANAGE: 'performance:manage',

  // Assets
  ASSET_READ: 'asset:read',
  ASSET_MANAGE: 'asset:manage',

  // Reports
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // Audit
  AUDIT_READ: 'audit:read',

  // Settings
  SETTINGS_MANAGE: 'settings:manage',
};

// Default permissions per role
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.HR_ADMIN]: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.ORG_MANAGE,
    PERMISSIONS.DEPARTMENT_MANAGE,
    PERMISSIONS.TEAM_MANAGE,
    PERMISSIONS.DESIGNATION_MANAGE,
    PERMISSIONS.ATTENDANCE_READ_ALL,
    PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_MANAGE,
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.PAYROLL_MANAGE,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.TASK_MANAGE,
    PERMISSIONS.ANNOUNCEMENT_CREATE,
    PERMISSIONS.ANNOUNCEMENT_READ,
    PERMISSIONS.RECRUITMENT_MANAGE,
    PERMISSIONS.PERFORMANCE_READ,
    PERMISSIONS.PERFORMANCE_MANAGE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_MANAGE,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.AUDIT_READ,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_READ_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REQUEST,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.TASK_MANAGE,
    PERMISSIONS.ANNOUNCEMENT_READ,
    PERMISSIONS.PERFORMANCE_READ,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.REPORT_VIEW,
  ],

  [ROLES.EMPLOYEE]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.LEAVE_REQUEST,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.ANNOUNCEMENT_READ,
    PERMISSIONS.PERFORMANCE_READ,
    PERMISSIONS.ASSET_READ,
  ],
};

// --- Tenant Plans ---
export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
};

// --- Auth Constants ---
export const AUTH = {
  ACCESS_TOKEN_COOKIE: 'access_token',
  REFRESH_TOKEN_COOKIE: 'refresh_token',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_DURATION_MINUTES: 30,
  PASSWORD_SALT_ROUNDS: 12,
  VERIFICATION_TOKEN_EXPIRES_HOURS: 24,
  RESET_TOKEN_EXPIRES_HOURS: 1,
};

// --- Pagination Defaults ---
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// --- Audit Actions ---
export const AUDIT_ACTIONS = {
  AUTH_REGISTER: 'auth.register',
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_REFRESH: 'auth.refresh',
  AUTH_FORGOT_PASSWORD: 'auth.forgot_password',
  AUTH_RESET_PASSWORD: 'auth.reset_password',
  AUTH_VERIFY_EMAIL: 'auth.verify_email',
  AUTH_FAILED_LOGIN: 'auth.failed_login',
  AUTH_ACCOUNT_LOCKED: 'auth.account_locked',
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_ROLE_CHANGED: 'user.role_changed',
  TENANT_CREATED: 'tenant.created',
};
