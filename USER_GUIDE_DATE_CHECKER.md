# Quick Start Guide: Date Availability Checker

## How to Use This Feature

### Step 1: Access Your Vehicles
1. Navigate to **My Fleet** page from the sidebar
2. Find the vehicle you want to check
3. Click the **eye icon** (👁️) to view vehicle details

### Step 2: Check Date Availability
In the vehicle details modal, you'll see the **"Check Date Availability"** section:

```
┌─────────────────────────────────────────┐
│  📅 Check Date Availability             │
│  Select a date to check bookings        │
│                                         │
│  [Date Picker: Select a date...]       │
│                                         │
│  [Status will appear here]             │
└─────────────────────────────────────────┘
```

### Step 3: Select a Date
- Click on the date input field
- Choose any **future date** (past dates are disabled)
- The system will automatically check for bookings

### Step 4: View Results

#### Scenario A: No Bookings ✅
```
┌─────────────────────────────────────────┐
│  ✓ No Bookings Found                    │
│                                         │
│  This vehicle has no bookings on        │
│  Wednesday, February 20, 2026           │
│                                         │
│  [✓ Mark as Available/Unavailable]     │
└─────────────────────────────────────────┘
```
**Action**: You can toggle availability using the button

#### Scenario B: Has Booking ❌
```
┌─────────────────────────────────────────┐
│  ✗ Booking Exists                       │
│                                         │
│  This vehicle has a booking on this     │
│  date. Cannot toggle availability.      │
│                                         │
│  Booking Details:                       │
│  • Booking ID: #BK12345                 │
│  • Status: Confirmed                    │
│  • Start: 02/20/2026                    │
│  • End: 02/20/2026                      │
│                                         │
│  ⚠️ Cannot mark unavailable while       │
│     vehicle has active bookings         │
└─────────────────────────────────────────┘
```
**Action**: Toggle is disabled - you cannot change availability

### Step 5: Toggle Availability (If No Bookings)
1. Click the **"Mark as Available"** or **"Mark as Unavailable"** button
2. System updates the vehicle status
3. Success notification appears
4. Vehicle list refreshes automatically

## Important Notes

### ✅ What You CAN Do:
- Check any future date for bookings
- Toggle availability when no bookings exist
- View detailed booking information
- Check multiple dates by selecting different dates

### ❌ What You CANNOT Do:
- Select past dates (validation prevents this)
- Toggle availability when bookings exist
- Check other sponsors' vehicles
- Bypass booking checks

## Visual Indicators

| Color | Meaning |
|-------|---------|
| 🟢 Green | No bookings - Safe to toggle |
| 🔴 Red | Has bookings - Cannot toggle |
| 🔵 Blue | Loading/Checking |
| ⚪ Gray | Initial state |

## Common Use Cases

### 1. Planning Maintenance
**Scenario**: You need to service your bike on Feb 25
1. Check Feb 25 for bookings
2. If no bookings → Mark as unavailable
3. Perform maintenance
4. Mark as available again

### 2. Personal Use
**Scenario**: You want to use your vehicle on a specific date
1. Check the date
2. If no bookings → Mark as unavailable
3. Use your vehicle
4. Mark as available when done

### 3. Avoiding Conflicts
**Scenario**: Customer asks if vehicle is available on a date
1. Check the specific date
2. See booking status instantly
3. Inform customer accurately

## Troubleshooting

### Problem: "Failed to check availability"
**Solution**: 
- Check your internet connection
- Refresh the page
- Try again in a few moments

### Problem: Can't select a date
**Solution**:
- Make sure you're selecting a future date
- Past dates are automatically disabled

### Problem: Toggle button not working
**Solution**:
- Ensure there are no bookings on that date
- Check if the vehicle is approved
- Verify you're the vehicle owner

## Tips for Best Results

1. **Check Before Blocking**: Always check for bookings before marking unavailable
2. **Plan Ahead**: Check dates well in advance for better planning
3. **Regular Checks**: Periodically check upcoming dates
4. **Clear Communication**: Use this feature to give accurate availability to customers

## Need Help?

If you encounter any issues:
1. Check this guide first
2. Verify your vehicle is approved
3. Ensure you have a stable internet connection
4. Contact support if problems persist

---

**Remember**: This feature helps you manage your vehicle availability intelligently by preventing conflicts with existing bookings!
