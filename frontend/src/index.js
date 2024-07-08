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
import LoadScreen from './screens/LoadScreen';
import OrderScreen from './screens/OrderScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreateOrderScreen from './screens/CreateOrderScreen';
import UserDatabaseScreen from './screens/UserDatabaseScreen';

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
        <Route path="/userdatabase" element={<UserDatabaseScreen/>}/> 
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
