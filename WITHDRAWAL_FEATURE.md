# Withdrawal Feature Documentation

## Overview
The withdrawal feature allows sponsors to request refunds/withdrawals from their earnings. Admins can review, approve, and process these requests through a dedicated admin panel.

## Features Implemented

### 1. **Sponsor Panel - Withdrawal Management** (`/withdrawal`)
- **Create Withdrawal Requests**: Sponsors can request withdrawals with two payment methods:
  - **Bank Transfer**: Requires account number, IFSC code, and account holder name
  - **UPI**: Requires UPI ID
- **View Request History**: See all past withdrawal requests with status tracking
- **Available Balance Display**: Shows current available balance for withdrawal
- **Status Tracking**: Track requests through different stages (Pending, Approved, Completed, Rejected)

### 2. **Admin Panel - Withdrawal Management** (`/admin/withdrawals`)
- **View All Requests**: See all withdrawal requests from all sponsors
- **Filter & Search**: 
  - Filter by status (Pending, Approved, Completed, Rejected)
  - Search by sponsor name, email, or request ID
- **Statistics Dashboard**: View key metrics including:
  - Total pending requests
  - Approved requests
  - Completed requests
  - Total withdrawal amount
- **Process Requests**:
  - Approve pending requests
  - Reject requests with admin notes
  - Mark approved requests as completed with transaction reference
- **Sponsor Details**: View complete sponsor information and payment details

### 3. **Profile Page Enhancement**
- **Update Bank Details**: Sponsors can update their bank account, IFSC code, account holder name, and UPI ID
- **View Saved Details**: Display saved payment information securely

## Database Schema

### `withdrawal_requests` Table
```sql
- id: BIGINT (Primary Key)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- sponsor_id: UUID (Foreign Key to sponsors)
- amount: DECIMAL(10, 2)
- payment_method: TEXT ('bank' or 'upi')
- bank_account_number: TEXT
- ifsc_code: TEXT
- account_holder_name: TEXT
- upi_id: TEXT
- status: TEXT ('pending', 'approved', 'rejected', 'completed')
- admin_notes: TEXT
- processed_by: UUID
- processed_at: TIMESTAMP
- transaction_reference: TEXT
```

### Updates to `sponsors` Table
```sql
- bank_account_number: TEXT
- ifsc_code: TEXT
- account_holder_name: TEXT
- upi_id: TEXT
```

## API Endpoints

### Sponsor Endpoints
- `POST /api/sponsor/withdrawal/request` - Create a new withdrawal request
- `GET /api/sponsor/withdrawal/my-requests` - Get all withdrawal requests for logged-in sponsor
- `PUT /api/sponsor/bank-details` - Update bank details

### Admin Endpoints
- `GET /api/admin/withdrawal/requests` - Get all withdrawal requests (with optional status filter)
- `PATCH /api/admin/withdrawal/requests/:requestId` - Update withdrawal request status

## Setup Instructions

### 1. Database Setup
Run the SQL script to create the necessary tables:
```bash
# Execute the SQL file in your Supabase SQL editor
backend/sql/create_withdrawal_tables.sql
```

### 2. Backend Setup
The backend routes and controllers are already configured. No additional setup needed.

### 3. Frontend Setup
The routes are already added to the application:
- Sponsor: `/withdrawal`
- Admin: `/admin/withdrawals`

## Usage Flow

### For Sponsors:
1. Navigate to **Withdrawal** from the sidebar
2. View available balance
3. Click **New Request** tab
4. Enter withdrawal amount
5. Select payment method (Bank or UPI)
6. Fill in payment details
7. Submit request
8. Track request status in **Request History** tab

### For Admins:
1. Navigate to `/admin/withdrawals`
2. View dashboard with statistics
3. Use filters to find specific requests
4. Click **Approve** or **Reject** for pending requests
5. For approved requests, click **Mark Completed**
6. Enter transaction reference number
7. Add admin notes if needed
8. Confirm action

## Workflow States

```
Pending → Approved → Completed
   ↓
Rejected
```

- **Pending**: Initial state when sponsor creates request
- **Approved**: Admin has approved the request
- **Completed**: Admin has sent the money and marked as completed
- **Rejected**: Admin has rejected the request

## Security Features

- Row Level Security (RLS) policies ensure sponsors can only view their own requests
- Admin operations use service role for full access
- Payment details are validated before submission
- Bank details are partially masked in display

## UI/UX Highlights

- **Beautiful gradient designs** with modern color schemes
- **Responsive layout** works on all devices
- **Real-time status updates** with color-coded badges
- **Confirmation modals** prevent accidental actions
- **Toast notifications** for user feedback
- **Search and filter** for easy navigation
- **Statistics dashboard** for quick overview

## Future Enhancements

- Email notifications for status changes
- Automatic balance calculation from revenue
- Withdrawal limits and minimum amounts
- Payment gateway integration
- Export withdrawal reports
- Bulk processing for admins

## Files Created/Modified

### New Files:
- `backend/sql/create_withdrawal_tables.sql`
- `backend/controllers/withdrawal.controller.js`
- `frontend/src/pages/Withdrawal.jsx`
- `frontend/src/pages/AdminWithdrawals.jsx`

### Modified Files:
- `backend/routes/api.routes.js`
- `frontend/src/App.jsx`
- `frontend/src/components/Sidebar.jsx`
- `frontend/src/pages/Profile.jsx`

## Support

For any issues or questions, please contact the development team.
