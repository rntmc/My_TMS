## TO DO LIST:

- [] check if really need bookingSlice.js

- [] loginScreen.jsx: Remove /register as only admin must be able to create users
- [] RegisterScreen.jsx: Only admins must be able to add users/carriers
- [] fix the middlewares to ensure the accesses are assigned correctly! (if include admin in )
- [] implement logs in orders, loads and databases

- [] User Database: active or inactive.
- [] Perhaps add OrganizationID to userModel, so they are linked to that organization orders only
- [x] When updating an user, I want to see the current state of the name, email and role instead of Enter name.
- [x] If an user/carrier/supplier is updated, my userInfo in Redux changes to the data I have updated. Correct this.

- [] Supplier Database: adjust opening hours to accept blank days or create drop down list

- [] automatically generate order ID
- [] implement googleAPI to validate address (USA Only)
- [x] Order Component: if status is Open, show confirm button(carrier & admin only)
- [] add distance and freight cost to Orders
- [] Add Product quantity rows
- [] Add measurements rows
- [] Add possibility to attach docs to Orders and Loads
- [] checkbox next to "open" orders so they can be cancelled easily ('/bookings')

- [] The status should change once the button "check" is clicked. We need to refresh the page to work
- [] Only Carrier and Admin should be able to change orders/load status

- [] Carrier address should be udpated to location