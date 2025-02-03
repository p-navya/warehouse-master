import React from 'react'
import {Routes, Route} from "react-router-dom";
import Dashboard from "../Dashboard";
import Recommendations from '../Recommendations';
import Alerts from "../Alerts";
import Login from '../Login';
import Resources from '../Resources';
import Plant from '../Plant';
import Admin from '../Admin';

function Routers() {
  return (
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/alerts" element={<Alerts/>}/>
        <Route path="/recommendations" element={<Recommendations/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/Resources" element={<Resources/>}/>
        <Route path="/plant" element={<Plant/>}/>
        <Route path="/admin" element={<Admin/>}/>
    </Routes>
  )
}

export default Routers;
