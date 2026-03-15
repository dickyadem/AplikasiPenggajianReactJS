# 🔐 RBAC Integration Guide

## ✅ BACKEND SUDAH SIAP!

Backend Anda sudah memiliki sistem RBAC lengkap dengan endpoints:

```
GET    /rbac/roles                      - Get all roles
POST   /rbac/roles                      - Create role
GET    /rbac/roles/:ID_Role             - Get role details
PUT    /rbac/roles/:ID_Role             - Update role
DELETE /rbac/roles/:ID_Role             - Delete role

GET    /rbac/permissions                - Get all permissions
POST   /rbac/permissions                - Create permission
GET    /rbac/roles/:ID_Role/permissions - Get role permissions
POST   /rbac/roles/:ID_Role/permissions - Assign permission
DELETE /rbac/roles/:ID_Role/permissions - Remove permission

POST   /rbac/users/:ID_User/role        - Assign role to user
GET    /rbac/users/:ID_User/role        - Get user role
DELETE /rbac/users/:ID_User/role        - Remove user role
```

---

## 🚀 FRONTEND INTEGRATION

### **Files Created:**

1. ✅ `src/services/AuthService.js` - Updated with role methods
2. ✅ `src/services/RBACService.js` - RBAC API integration
3. ✅ `src/widgets/commons/ProtectedRoute.js` - Route protection
4. ✅ `src/pages/auth/Unauthorized.js` - 403 page
5. ✅ `src/pages/rbac/RBACTestPage.js` - Test & debug page
6. ✅ `src/App.js` - Protected routes

---

## 📋 **CARA TESTING:**

### **Step 1: Login sebagai Admin**

```
Email: admin@perusahaan.com
Password: admin123 (atau password yang sudah di-set di backend)
```

### **Step 2: Akses RBAC Test Page**

Buka browser dan navigate ke:
```
http://localhost:3000/rbac-test
```

### **Step 3: Test Assign Role**

1. Lihat informasi user Anda di "User Information" card
2. Di "Available Roles", klik **"Assign to Me"** untuk role yang diinginkan
3. Lihat "My Permissions" untuk melihat permissions yang didapat

### **Step 4: Test Role Changes**

1. Logout
2. Login dengan user yang baru di-assign role
3. Coba akses halaman yang diprotect
4. Lihat apakah tombol/action muncul sesuai role

---

## 🎯 **TESTING SCENARIOS:**

### **Scenario 1: Admin Access**
```
1. Login: admin@perusahaan.com
2. Access: /rbac-test ✅
3. Access: /settings ✅
4. Access: /user ✅
5. Can assign roles to other users ✅
```

### **Scenario 2: HR Staff Access**
```
1. Login: hr@perusahaan.com
2. Access: /rbac-test ❌ (redirect to /unauthorized)
3. Access: /karyawan ✅
4. Access: /penggajian/input ✅
5. Cannot access: /settings ❌
```

### **Scenario 3: Finance Access**
```
1. Login: finance@perusahaan.com
2. Access: /laporan ✅
3. Access: /potongan ✅
4. Access: /pendapatan ✅
5. Cannot access: /karyawan ❌
```

---

## 🔧 **BACKEND RESPONSE FORMAT:**

### **Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "ID_User": "USR-001",
    "username": "admin",
    "email": "admin@perusahaan.com",
    "role": "admin",
    "department": "IT"
  }
}
```

### **Get Roles Response:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Role": "ADMIN",
      "role_name": "admin",
      "description": "Full system access"
    },
    {
      "ID_Role": "HR_STAFF",
      "role_name": "hr_staff",
      "description": "HR management"
    }
  ]
}
```

### **Get User Role Response:**
```json
{
  "success": true,
  "data": {
    "ID_User": "USR-001",
    "role": "admin",
    "permissions": [
      "user.manage",
      "role.manage",
      "karyawan.create",
      "karyawan.edit",
      "karyawan.delete",
      "penggajian.create",
      "laporan.view"
    ]
  }
}
```

---

## 📊 **ROLE HIERARCHY:**

```
ADMIN (Level 5)
  └─ Can access EVERYTHING
  └─ Can manage ROLES & PERMISSIONS
  └─ Can assign roles to users

MANAGER (Level 4)
  └─ Can view all departments
  └─ Can approve payroll
  └─ Cannot manage roles

HR_STAFF (Level 3)
  └─ Can manage employees
  └─ Can manage positions
  └─ Can create payroll
  └─ Cannot access finance data

FINANCE (Level 2)
  └─ Can manage income/deductions
  └─ Can view reports
  └─ Can process payroll
  └─ Cannot manage employees

EMPLOYEE (Level 1)
  └─ Can view own profile
  └─ Can view own slip gaji
  └─ Cannot access management pages
```

---

## 🔍 **DEBUGGING:**

### **Check Console Logs:**

Open browser console (F12) and run:

```javascript
// Check current user
console.log("User:", AuthService.getUser());

// Check role
console.log("Role:", AuthService.getRole());

// Check permissions
console.log("Is Admin:", AuthService.hasRole('admin'));
console.log("Is HR:", AuthService.hasRole('hr_staff'));
console.log("Is Finance:", AuthService.hasRole('finance'));

// Check hierarchy
console.log("Manager or higher:", AuthService.hasRoleOrHigher('manager'));
console.log("HR or higher:", AuthService.hasRoleOrHigher('hr_staff'));
```

### **Common Issues:**

**Issue 1: "Token tidak ditemukan"**
```
Solution: Pastikan login berhasil dan token tersimpan di localStorage
Check: localStorage.getItem('TOKEN')
```

**Issue 2: "Access denied" untuk admin**
```
Solution: Pastikan backend return role: 'admin' di response login
Check: console.log(AuthService.getUser())
```

**Issue 3: RBAC Test Page 404**
```
Solution: Pastikan route '/rbac-test' sudah ditambahkan di App.js
Check: Lihat file src/App.js
```

---

## 📝 **NEXT STEPS:**

### **1. Test dengan Backend:**
```bash
# 1. Login sebagai admin
POST /user/login
{
  "email": "admin@perusahaan.com",
  "password": "admin123"
}

# 2. Get all roles
GET /rbac/roles
Authorization: Bearer <token_from_login>

# 3. Assign role to user
POST /rbac/users/USR-001/role
{
  "ID_Role": "HR_STAFF"
}
```

### **2. Update UI dengan Permission:**
```javascript
// Show button only for users with permission
{AuthService.hasPermission('karyawan.create') && (
  <Button onClick={handleCreate}>
    <FaPlus /> Tambah Karyawan
  </Button>
)}

// Show section only for specific roles
{AuthService.hasAnyRole(['admin', 'hr_staff']) && (
  <HRManagementPanel />
)}
```

### **3. Add Permission Check to API Calls:**
```javascript
// Before calling API, check permission first
const handleDeleteKaryawan = async (id) => {
  if (!AuthService.hasPermission('karyawan.delete')) {
    error("Anda tidak memiliki izin untuk menghapus karyawan");
    return;
  }
  
  try {
    await KaryawanService.delete(id);
    success("Karyawan berhasil dihapus");
  } catch (err) {
    error("Gagal menghapus karyawan");
  }
};
```

---

## ✅ **CHECKLIST:**

- [ ] Backend RBAC endpoints ready ✅
- [ ] Database has role column ✅
- [ ] Login returns user role ✅
- [ ] Frontend AuthService updated ✅
- [ ] RBACService created ✅
- [ ] ProtectedRoute created ✅
- [ ] Unauthorized page created ✅
- [ ] RBAC Test Page created ✅
- [ ] Routes protected in App.js ✅
- [ ] Test dengan different roles ⏳
- [ ] Test permission-based UI ⏳
- [ ] Test data filtering by role ⏳

---

**Ready to test! 🚀**

Navigate to: `http://localhost:3000/rbac-test`
