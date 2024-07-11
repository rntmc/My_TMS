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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}> {/* "/" is the parent element*/}
      <Route index={true} path="/" element={<HomeScreen/>}/>
      <Route path="/login" element={<LoginScreen/>}/>
      <Route path="/register" element={<RegisterScreen/>}/>

      <Route path='/' element={<PrivateRoute/>}>
        <Route path="/load/:id" element={<LoadScreen/>}/> 
        <Route path="/order/:id" element={<OrderScreen/>}/> 
        <Route path="/createorder" element={<CreateOrderScreen/>}/> 
        <Route path="/createload" element={<CreateLoadScreen/>}/> 
        <Route path="/database" element={<DatabaseScreen/>}/> 
        <Route path="/database/usercreation" element={<UserDatabaseCreationScreen/>}/> 
        <Route path="/database/users" element={<UserDatabaseScreen/>}/> 
        <Route path="/database/carriercreation" element={<CarrierDatabaseCreationScreen/>}/> 
        <Route path="/database/carriers" element={<CarrierDatabaseScreen/>}/> 
        <Route path="/database/entitycreation" element={<EntityDatabaseCreationScreen/>}/> 
        <Route path="/database/entities" element={<EntityDatabaseScreen/>}/> 
        <Route path="/profile" element={<ProfileScreen/>}/> 
        <Route path="/Bookings" element={<Bookings/>}/> 
        <Route path="/database/edituser/:id" element={<DatabaseUserEditScreen/>}/> 
        <Route path="/database/editcarrier/:id" element={<DatabaseCarrierEditScreen/>}/> 
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