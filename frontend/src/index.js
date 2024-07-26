import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import Bookings from './screens/Bookings';
import LoadScreen from './screens/LoadScreen';
import OrderScreen from './screens/OrderScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreateOrderScreen from './screens/CreateOrderScreen';
import CreateLoadScreen from './screens/CreateLoadScreen';
import UserDatabaseCreationScreen from './screens/UserDatabaseCreationScreen';
import UserDatabaseScreen from './screens/UserDatabaseScreen';
import DatabaseScreen from './screens/DatabaseScreen';
import CarrierDatabaseScreen from './screens/CarrierDatabaseScreen';
import CarrierDatabaseCreationScreen from './screens/CarrierDatabaseCreationScreen';
import EntityDatabaseScreen from './screens/EntityDatabaseScreen';
import EntityDatabaseCreationScreen from './screens/EntityDatabaseCreationScreen';
import DatabaseUserEditScreen from './screens/DatabaseUserEditScreen';
import DatabaseCarrierEditScreen from './screens/DatabaseCarrierEditScreen';
import DatabaseEntityEditScreen from './screens/DatabaseEntityEditScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditOrderScreen from './screens/EditOrderScreen';
import EditLoadScreen from './screens/EditLoadScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import MyLoadsScreen from './screens/MyLoadsScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App/>}> {/* "/" is the parent element*/}
      <Route index={true} path="/" element={<HomeScreen/>}/>
      <Route path="/login" element={<LoginScreen/>}/>
      <Route path="/register" element={<RegisterScreen/>}/>

      <Route path='/' element={<PrivateRoute/>}>
        <Route path="/profile" element={<ProfileScreen/>}/> 
        <Route path="/myorders" element={<MyOrdersScreen/>}/> 
        <Route path="/order/:id" element={<OrderScreen/>}/> 
        <Route path="/createorder" element={<CreateOrderScreen/>}/> 
        <Route path="/editorder/:id" element={<EditOrderScreen/>}/> 
        <Route path="/myorders/search/:keyword" element={<MyOrdersScreen/>}/> {/*CHECK*/}

        <Route path="/myloads" element={<MyLoadsScreen/>}/>
        <Route path="/load/:id" element={<LoadScreen/>}/> 
        <Route path="/myloads/search/:keyword" element={<MyLoadsScreen/>}/> {/*CHECK*/}
        
        {/* <Route path="/search/:keyword/page/:pagenumber" element={<Bookings/>}/> {/*CHECK*/}
        {/* <Route path="/myorders/page/:pageNumber" element={<MyOrdersScreen/>}/>  */}
      </Route>

      <Route path='' element={<AdminRoute/>}>
        <Route path="/bookings" element={<Bookings/>}/> 
        <Route path="/editload/:id" element={<EditLoadScreen/>}/> 
        <Route path="/createload" element={<CreateLoadScreen/>}/> 
        <Route path="bookings/search/:keyword" element={<Bookings/>}/> {/*CHECK*/}
        <Route path="/database" element={<DatabaseScreen/>}/> 
        <Route path="/database/users" element={<UserDatabaseScreen/>}/> 
        <Route path="/database/usercreation" element={<UserDatabaseCreationScreen/>}/> 
        <Route path="/database/edituser/:id" element={<DatabaseUserEditScreen/>}/> 
        <Route path="/database/carriers" element={<CarrierDatabaseScreen/>}/> 
        <Route path="/database/carriercreation" element={<CarrierDatabaseCreationScreen/>}/> 
        <Route path="/database/editcarrier/:id" element={<DatabaseCarrierEditScreen/>}/> 
        <Route path="/database/entities" element={<EntityDatabaseScreen/>}/> 
        <Route path="/database/entitycreation" element={<EntityDatabaseCreationScreen/>}/> 
        <Route path="/database/editentity/:id" element={<DatabaseEntityEditScreen/>}/> 
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();