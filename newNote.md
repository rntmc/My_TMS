## TO DO LIST:

- [] check if really need bookingSlice.js
- [X] logInfo at models

- [X] loginScreen.jsx: Remove /register as only admin must be able to create users
- [X] RegisterScreen.jsx: Only admins must be able to add users/carriers
- [] fix the middlewares to ensure the accesses are assigned correctly! (if include admin in )
- [X] Only Carrier and Admin should be able to change orders/load status
- [X] implement logs in orders, loads.
- [] Correct the issue with logout. Next day, I remained logged in but Im unable to createOrders. 

- [X] User Database: active or inactive.
- [] Perhaps add OrganizationID to userModel, so they are linked to that organization orders only
- [x] When updating an user, I want to see the current state of the name, email and role instead of Enter name.
- [x] If an user/carrier/supplier is updated, my userInfo in Redux changes to the data I have updated. Correct this.

- [] Supplier Database: adjust opening hours to accept blank days or create drop down list

- [X] automatically generate order and load ID
- [X] implement googleAPI to validate address
- [X] validate orderNumbers before fill in the form
- [] add distance and freight cost to Orders
- [x] Order Component: if status is Open, show confirm button(carrier & admin only)
- [X] Add Product quantity rows
- [X] Add measurements rows
- [] Add possibility to attach multiple docs to Orders and Loads. Validate file format an max number of files. Add icon for orders with docs attached
- [] Download docs
- [X] checkbox next to "open" orders so they can be cancelled easily ('/bookings')
- [X] update dangerousGoods so the icon changes in the bookings page
- [x] Include dangerousGoods description in booking page
- [X] Special notes at orderModel
- [] users should only be able to open their own orders

- [X] The status should change once the button "check" is clicked. We need to refresh the page to work

- [X] Carrier address should be udpated to location

- [] Barcode with main packages information
- [] Roteirizacao pelo TMS??
- [] Pagination
- [X] Search function in /myorders and /myloads