# 🔐 Plan It - Default Account Credentials

## **🔑 ADMIN ACCOUNTS**

### **Super Admin Account**
- **📧 Email**: `admin@vitapstudent.ac.in`
- **🔒 Password**: `admin123`
- **👤 Role**: `super_admin`
- **🎓 VIT ID**: `ADMIN001`
- **📱 Phone**: `+91-9999999999`
- **🏢 Branch**: Computer Science
- **📚 Year**: 4th Year
- **🏠 Hostel**: Admin Block
- **✅ Status**: Verified & Approved

---

## **👥 USER ACCOUNTS (From Database)**

### **Student Account 1**
- **📧 Email**: `abhinay.22bce9726@vitapstudent.ac.in`
- **👤 Name**: `abhinay`
- **🎓 VIT ID**: `22bce9726`
- **🔒 Role**: `user`
- **✅ Status**: Not Verified
- **📝 Type**: Student

### **Student Account 2**
- **📧 Email**: `a1@vitapstudent.ac.in`
- **👤 Name**: `abhinay`
- **🎓 VIT ID**: `22bce9727`
- **🔒 Role**: `user`
- **✅ Status**: Not Verified
- **📝 Type**: Student

---

## **🌐 APPLICATION ACCESS POINTS**

### **Admin Dashboard**
- **URL**: `http://localhost:3000/admin`
- **Login**: Use super admin credentials above
- **Features**: User management, content moderation, analytics

### **Student Portal**
- **URL**: `http://localhost:3000`
- **Registration**: Must use `@vitapstudent.ac.in` domain
- **Features**: Places discovery, vehicle rentals, reviews

### **API Endpoints**
- **Base URL**: `http://localhost:5000/api`
- **Auth**: `/auth/login`, `/auth/register`
- **Admin**: `/admin/*` (requires admin role)

---

## **🔧 TEST CREDENTIALS FOR DEVELOPMENT**

### **Create New Test Student**
```json
{
  "name": "Test Student",
  "email": "test.student@vitapstudent.ac.in",
  "password": "password123",
  "userType": "student",
  "vitapId": "22BCE1111",
  "year": 3,
  "branch": "Computer Science",
  "phone": "+91-9876543210"
}
```

### **Create New Test Business**
```json
{
  "name": "Test Business Owner",
  "email": "business@example.com",
  "password": "business123",
  "userType": "business",
  "businessName": "Sample Restaurant",
  "businessType": "Restaurant",
  "phone": "+91-9876543211"
}
```

---

## **⚠️ SECURITY NOTES**

### **Production Deployment:**
1. **Change Default Passwords**: Update all default passwords before deployment
2. **Environment Variables**: Store credentials in `.env` files
3. **Strong Passwords**: Use complex passwords with special characters
4. **2FA**: Consider implementing two-factor authentication
5. **Regular Updates**: Rotate passwords periodically

### **Email Domain Validation:**
- **VIT Students**: Must use `@vitapstudent.ac.in` domain
- **General Public**: Any valid email domain allowed
- **Admin Access**: Requires super_admin or admin role

### **Database Security:**
- **MongoDB URI**: `mongodb://localhost:27017/planit`
- **Encryption**: Passwords are bcrypt hashed with salt rounds: 12
- **JWT Tokens**: Used for session management
- **Role-Based Access**: Admin, Super Admin, User levels

---

## **🚀 QUICK LOGIN COMMANDS**

### **Admin Login (Postman/API Testing)**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@vitapstudent.ac.in",
  "password": "admin123"
}
```

### **Student Registration**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "New Student",
  "email": "newstudent@vitapstudent.ac.in",
  "password": "student123",
  "userType": "student",
  "vitapId": "22BCE9999",
  "year": 2,
  "branch": "ECE"
}
```

---

## **📱 APPLICATION STATUS**
- ✅ **Backend Server**: Running on port 5000
- ✅ **Frontend Server**: Running on port 3000  
- ✅ **MongoDB**: Connected and operational
- ✅ **Admin Account**: Ready for use
- ✅ **Student Accounts**: 2 existing accounts
- ✅ **Email Domain**: Updated to `@vitapstudent.ac.in`

**Your Plan It application is ready for testing and development!** 🎉