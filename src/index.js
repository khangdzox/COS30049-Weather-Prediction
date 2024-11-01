import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import About from './components/About'; // New component
import Map from './components/Map'; // New component
import FAQ from './components/FAQ'; // New component


import About from './components/About';
import Map from './components/Map';
import FAQ from './components/FAQ';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/About",
    element: <About/>,
  }
  ,
  {
    path: "/map",
    element: <Map/>,
  }
  ,
  {
    path: "/faq",
    element: <FAQ/>,
  }
]); 



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
