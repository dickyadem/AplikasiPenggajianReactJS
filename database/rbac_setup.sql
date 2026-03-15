-- ============================================
-- CHECK EXISTING COLUMNS
-- ============================================

-- Lihat struktur tabel yang sudah ada
DESCRIBE tbl_user;

-- ============================================
-- ADD MISSING COLUMNS ONLY
-- ============================================

-- Cek dan tambahkan kolom department jika belum ada
ALTER TABLE tbl_user 
ADD COLUMN IF NOT EXISTS department VARCHAR(100) NULL AFTER role;

-- Cek dan tambahkan kolom permissions jika belum ada
ALTER TABLE tbl_user 
ADD COLUMN IF NOT EXISTS permissions JSON NULL AFTER department;

-- Cek dan tambahkan kolom is_active jika belum ada
ALTER TABLE tbl_user 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE AFTER permissions;

-- Cek dan tambahkan kolom last_login jika belum ada
ALTER TABLE tbl_user 
ADD COLUMN IF NOT EXISTS last_login DATETIME NULL AFTER is_active;

-- Cek dan tambahkan kolom created_at jika belum ada
ALTER TABLE tbl_user 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER last_login;

-- Cek dan tambahkan kolom updated_at jika belum ada
ALTER TABLE tbl_user 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- ============================================
-- SET DEFAULT ROLE FOR EXISTING USERS
-- ============================================

-- Set role 'admin' untuk user dengan email admin
UPDATE tbl_user 
SET role = 'admin' 
WHERE email = 'admin@perusahaan.com' 
   OR email = 'admin@admin.com'
   OR username = 'admin';

-- Set role 'user' untuk user lain yang belum punya role
UPDATE tbl_user 
SET role = 'user' 
WHERE role IS NULL OR role = '';

-- ============================================
-- VERIFY CHANGES
-- ============================================

-- Lihat struktur tabel setelah perubahan
DESCRIBE tbl_user;

-- Lihat semua user dengan role
SELECT ID_User, username, email, role, department, is_active, created_at 
FROM tbl_user 
ORDER BY created_at DESC;

-- ============================================
-- CREATE DEFAULT ADMIN USER (IF NOT EXISTS)
-- ============================================

-- Check if admin exists, if not create one
-- Note: Password 'admin123' harus di-hash dengan bcrypt di backend
INSERT INTO tbl_user (
    ID_User, 
    username, 
    email, 
    password, 
    role, 
    department, 
    is_active,
    created_at
)
SELECT 
    'USR-ADMIN-001',
    'Administrator',
    'admin@perusahaan.com',
    '$2b$10$YourHashedPasswordHere',  -- Ganti dengan hash bcrypt dari 'admin123'
    'admin',
    'IT',
    TRUE,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM tbl_user WHERE email = 'admin@perusahaan.com'
);

-- ============================================
-- SAMPLE USERS FOR TESTING
-- ============================================

-- HR Staff
INSERT INTO tbl_user (
    ID_User, username, email, password, role, department, is_active
) VALUES (
    'USR-HR-001', 
    'HR Staff', 
    'hr@perusahaan.com',
    '$2b$10$YourHashedPasswordHere',  -- Hash dari 'hr123'
    'hr_staff',
    'HR',
    TRUE
) ON DUPLICATE KEY UPDATE username=username;

-- Finance
INSERT INTO tbl_user (
    ID_User, username, email, password, role, department, is_active
) VALUES (
    'USR-FIN-001', 
    'Finance User', 
    'finance@perusahaan.com',
    '$2b$10$YourHashedPasswordHere',  -- Hash dari 'finance123'
    'finance',
    'Finance',
    TRUE
) ON DUPLICATE KEY UPDATE username=username;

-- Manager
INSERT INTO tbl_user (
    ID_User, username, email, password, role, department, is_active
) VALUES (
    'USR-MGR-001', 
    'Manager User', 
    'manager@perusahaan.com',
    '$2b$10$YourHashedPasswordHere',  -- Hash dari 'manager123'
    'manager',
    'Management',
    TRUE
) ON DUPLICATE KEY UPDATE username=username;

-- Employee
INSERT INTO tbl_user (
    ID_User, username, email, password, role, department, is_active
) VALUES (
    'USR-EMP-001', 
    'Regular Employee', 
    'employee@perusahaan.com',
    '$2b$10$YourHashedPasswordHere',  -- Hash dari 'employee123'
    'employee',
    'IT',
    TRUE
) ON DUPLICATE KEY UPDATE username=username;

-- ============================================
-- CREATE AUDIT LOG TABLE (IF NOT EXISTS)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    user_email VARCHAR(150),
    user_role VARCHAR(50),
    action VARCHAR(50),
    module VARCHAR(100),
    record_id VARCHAR(50),
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_module (module),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Index untuk role-based queries
CREATE INDEX IF NOT EXISTS idx_role ON tbl_user(role);
CREATE INDEX IF NOT EXISTS idx_department ON tbl_user(department);
CREATE INDEX IF NOT EXISTS idx_is_active ON tbl_user(is_active);
CREATE INDEX IF NOT EXISTS idx_email ON tbl_user(email);
