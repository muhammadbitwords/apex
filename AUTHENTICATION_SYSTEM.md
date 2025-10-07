# Authentication System - Role-Based Access Control

## ✅ Implementation Complete

### User Roles

The platform supports **4 user roles**:

1. **👤 Buyer** - Can browse cars, place bids, and purchase vehicles
2. **🏪 Seller** - Can list cars for sale and manage their listings
3. **🏢 Dealer** - Business accounts with additional features (business name, license)
4. **⚙️ Admin** - Full access to admin dashboard and platform management

---

## 📄 Pages Created

### 1. **Login Page** (`/login`)
- Email and password authentication
- "Forgot password?" link
- **"Browse as Guest"** button for walk-in customers
- Redirects based on user role after login
- Session token management

**Features:**
- ✓ Show/hide password toggle
- ✓ Form validation
- ✓ Error handling
- ✓ Guest browsing option

### 2. **Register Page** (`/register`)
- Role selection (Buyer, Seller, Dealer)
- Dynamic form fields based on role
- Business information for Dealers/Sellers
- Password confirmation
- Phone number with Pakistan format (+92)

**Form Fields:**
- Full Name *
- Phone Number * (+92 format)
- Email Address *
- Password * (min 8 characters)
- Confirm Password *
- **Business Name*** (for Dealers/Sellers)
- Business License Number (optional for Dealers/Sellers)

**Features:**
- ✓ Visual role selection cards
- ✓ Conditional business fields
- ✓ Password strength validation
- ✓ Show/hide password toggles
- ✓ Real-time form validation

### 3. **Dashboard Page** (`/dashboard`)
- For Sellers and Dealers only
- Stats overview (listings, views, sales, bids)
- Quick actions (add listing, view auctions, trade-in)
- My listings management
- Logout functionality

**Features:**
- ✓ Role-based access control
- ✓ User profile display
- ✓ Stats cards
- ✓ Quick action buttons
- ✓ Empty state for new users

---

## 🔌 API Endpoints

### 1. **POST /api/auth/register**
Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92 300 1234567",
  "password": "securepassword",
  "role": "buyer|seller|dealer|admin",
  "businessName": "Optional for dealers/sellers",
  "businessLicense": "Optional"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "businessName": null
  },
  "sessionToken": "abc123..."
}
```

### 2. **POST /api/auth/login**
Authenticate user and create session

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "businessName": null,
    "phone": "+92 300 1234567"
  },
  "sessionToken": "abc123..."
}
```

### 3. **POST /api/auth/logout**
Invalidate user session

**Request Body:**
```json
{
  "sessionToken": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. **POST /api/auth/verify**
Verify session token and get user data

**Request Body:**
```json
{
  "sessionToken": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "businessName": null,
    "phone": "+92 300 1234567"
  }
}
```

---

## 🗄️ Database Schema

### Updated `users` Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- phone (VARCHAR)
- password_hash (VARCHAR) -- bcrypt hashed
- role (ENUM: buyer, seller, dealer, admin)
- business_name (VARCHAR) -- for dealers/sellers
- business_license (VARCHAR) -- optional
- is_verified (BOOLEAN)
- email_verified (BOOLEAN)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)
```

### New `user_sessions` Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK -> users.id)
- session_token (VARCHAR UNIQUE)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
- ip_address (VARCHAR)
- user_agent (TEXT)
```

**Indexes:**
- `idx_users_email` - Fast email lookup
- `idx_users_role` - Role-based queries
- `idx_sessions_token` - Session verification
- `idx_sessions_user_id` - User sessions lookup
- `idx_sessions_expires_at` - Cleanup expired sessions

---

## 🔐 Security Features

### Password Security
- ✓ **bcrypt hashing** with salt rounds (10)
- ✓ Minimum 8 characters required
- ✓ Password confirmation validation
- ✓ Secure password storage (never plain text)

### Session Management
- ✓ **32-character random tokens**
- ✓ 30-day session expiration
- ✓ IP address tracking
- ✓ User agent logging
- ✓ Automatic session cleanup

### Access Control
- ✓ **Role-based redirects** after login
- ✓ Protected dashboard routes
- ✓ Guest browsing for public pages
- ✓ Session verification on protected pages

---

## 🚶 Walk-in Customer Access

**Guest users can:**
- ✅ Browse all car listings (`/cars`)
- ✅ View live auctions (`/auctions`)
- ✅ See inspection reports (`/inspection`)
- ✅ Use AI trade-in valuation (`/trade-in`)
- ✅ View car details

**Guest users cannot:**
- ❌ Place bids on auctions
- ❌ Save favorite cars
- ❌ Contact sellers directly
- ❌ List cars for sale
- ❌ Access dashboard

**To unlock full features:**
- Click "Browse as Guest" on login page
- Or click "Sign Up" to create an account

---

## 🔄 User Flow

### Registration Flow
1. User visits `/register`
2. Selects role (Buyer/Seller/Dealer)
3. Fills in personal information
4. If Dealer/Seller: Adds business information
5. Creates password (min 8 chars)
6. Submits form → API creates user + session
7. Redirected based on role:
   - **Buyer** → Homepage (`/`)
   - **Seller/Dealer** → Dashboard (`/dashboard`)
   - **Admin** → Admin Panel (`/admin`)

### Login Flow
1. User visits `/login`
2. Enters email and password
3. Submits form → API verifies credentials
4. Session token stored in localStorage
5. Redirected based on role
6. **OR** clicks "Browse as Guest" → `/cars`

### Dashboard Access
1. User logs in as Seller/Dealer
2. Redirected to `/dashboard`
3. Page checks session token
4. If invalid → Redirect to `/login`
5. If valid → Show dashboard with stats

---

## 📊 Role-Based Features

| Feature | Buyer | Seller | Dealer | Admin |
|---------|-------|--------|--------|-------|
| Browse Cars | ✅ | ✅ | ✅ | ✅ |
| Place Bids | ✅ | ✅ | ✅ | ✅ |
| List Cars | ❌ | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ | ✅ |
| Business Profile | ❌ | ✅ | ✅ | ❌ |
| Admin Panel | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |

---

## 🧪 Testing

### Test Accounts (Mock Data)
You can test with any email/password combination. The system will:
1. Hash the password with bcrypt
2. Store user in database
3. Create session token
4. Redirect based on role

### Test Scenarios

**1. Register as Buyer:**
- Email: buyer@test.com
- Password: password123
- Role: Buyer
- Expected: Redirect to homepage

**2. Register as Dealer:**
- Email: dealer@test.com
- Password: password123
- Role: Dealer
- Business Name: Test Motors
- Expected: Redirect to dashboard

**3. Browse as Guest:**
- Click "Browse as Guest" on login page
- Expected: View all car listings without login

**4. Login with Invalid Credentials:**
- Email: wrong@test.com
- Password: wrongpass
- Expected: Error message "Invalid email or password"

---

## 🔧 Technical Stack

- **Frontend:** Next.js 14, React, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS
- **Authentication:** bcryptjs for password hashing
- **Database:** PostgreSQL with pg driver
- **Session Storage:** localStorage (client-side)
- **API Routes:** Next.js API routes

---

## 📱 Responsive Design

All authentication pages are fully responsive:
- ✓ Mobile-friendly forms
- ✓ Touch-optimized buttons
- ✓ Adaptive layouts
- ✓ Accessible form controls

---

## 🚀 Live URLs

- **Login:** https://car-marketplace-2.lindy.site/login
- **Register:** https://car-marketplace-2.lindy.site/register
- **Dashboard:** https://car-marketplace-2.lindy.site/dashboard
- **Browse as Guest:** https://car-marketplace-2.lindy.site/cars

---

## 📝 Next Steps (Future Enhancements)

1. **Email Verification**
   - Send verification emails on registration
   - Verify email before full account access

2. **Password Reset**
   - Implement forgot password flow
   - Send reset links via email

3. **OAuth Integration**
   - Google Sign-In
   - Facebook Login

4. **Two-Factor Authentication**
   - SMS verification
   - Authenticator app support

5. **Profile Management**
   - Edit profile page
   - Change password
   - Update business information

6. **Session Management**
   - View active sessions
   - Logout from all devices
   - Session activity log

---

## ✅ Summary

The authentication system is now **fully functional** with:
- ✅ Role-based signup and login
- ✅ Secure password hashing (bcrypt)
- ✅ Session management with tokens
- ✅ Walk-in customer access (guest browsing)
- ✅ Protected dashboard for sellers/dealers
- ✅ Database schema with proper indexes
- ✅ API endpoints for auth operations
- ✅ Responsive UI with form validation

**All users can now register, login, and access features based on their role!** 🎉
