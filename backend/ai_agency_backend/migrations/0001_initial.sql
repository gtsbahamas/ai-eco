-- Initialize database tables for AI Agency Ecosystem

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT,
    google_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table for role-based access control
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles mapping table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions mapping table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Clients table for Client Management System
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    status TEXT,
    onboarding_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table for Project Tracking System
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tasks table for Project Tracking System
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    status TEXT,
    priority TEXT,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Resources table for Resource Allocation System
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill_set TEXT,
    availability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Resource allocations table
CREATE TABLE IF NOT EXISTS resource_allocations (
    id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    allocation_percentage INTEGER,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Financial records table for Financial Management System
CREATE TABLE IF NOT EXISTS financial_records (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    client_id TEXT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- AI models table for AI Integration Strategy
CREATE TABLE IF NOT EXISTS ai_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT,
    capabilities TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI deployments table
CREATE TABLE IF NOT EXISTS ai_deployments (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    project_id TEXT,
    deployment_date TIMESTAMP,
    status TEXT,
    performance_metrics TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES ai_models(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES
('role_admin', 'Admin', 'Full access to all system components'),
('role_manager', 'Manager', 'Access to assigned client accounts and projects'),
('role_client', 'Client', 'Access to own projects and data'),
('role_user', 'User', 'Access to assigned tasks and projects');

-- Insert default permissions
INSERT INTO permissions (id, name, description) VALUES
-- Admin permissions
('perm_manage_users', 'Manage Users', 'Create, update, and delete users'),
('perm_manage_roles', 'Manage Roles', 'Create, update, and delete roles'),
('perm_system_config', 'System Configuration', 'Configure system settings'),
('perm_view_all_data', 'View All Data', 'Access all client and project data'),

-- Manager permissions
('perm_manage_clients', 'Manage Clients', 'Create, update, and manage client accounts'),
('perm_manage_projects', 'Manage Projects', 'Create, update, and manage projects'),
('perm_allocate_resources', 'Allocate Resources', 'Assign resources to projects'),
('perm_financial_reporting', 'Financial Reporting', 'Access financial reports'),

-- Client permissions
('perm_view_own_projects', 'View Own Projects', 'View own project data'),
('perm_approve_deliverables', 'Approve Deliverables', 'Approve project deliverables'),
('perm_communicate', 'Communicate', 'Access communication tools'),

-- User permissions
('perm_view_assigned_tasks', 'View Assigned Tasks', 'View tasks assigned to the user'),
('perm_update_task_status', 'Update Task Status', 'Update status of assigned tasks'),
('perm_track_time', 'Track Time', 'Record time spent on tasks');

-- Assign permissions to roles
-- Admin role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_admin', 'perm_manage_users'),
('role_admin', 'perm_manage_roles'),
('role_admin', 'perm_system_config'),
('role_admin', 'perm_view_all_data'),
('role_admin', 'perm_manage_clients'),
('role_admin', 'perm_manage_projects'),
('role_admin', 'perm_allocate_resources'),
('role_admin', 'perm_financial_reporting'),
('role_admin', 'perm_view_own_projects'),
('role_admin', 'perm_approve_deliverables'),
('role_admin', 'perm_communicate'),
('role_admin', 'perm_view_assigned_tasks'),
('role_admin', 'perm_update_task_status'),
('role_admin', 'perm_track_time');

-- Manager role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_manager', 'perm_manage_clients'),
('role_manager', 'perm_manage_projects'),
('role_manager', 'perm_allocate_resources'),
('role_manager', 'perm_financial_reporting'),
('role_manager', 'perm_communicate'),
('role_manager', 'perm_view_assigned_tasks'),
('role_manager', 'perm_update_task_status'),
('role_manager', 'perm_track_time');

-- Client role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_client', 'perm_view_own_projects'),
('role_client', 'perm_approve_deliverables'),
('role_client', 'perm_communicate');

-- User role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_user', 'perm_view_assigned_tasks'),
('role_user', 'perm_update_task_status'),
('role_user', 'perm_track_time'),
('role_user', 'perm_communicate');

-- Create admin user (password will need to be set)
INSERT INTO users (id, email, name) VALUES
('user_admin', 'admin@aiagency.com', 'System Administrator');

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES
('user_admin', 'role_admin');
