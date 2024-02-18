import React from 'react'
import "./Supplier.css";
import SupplierDashboard from '../SupplierDashboard';
import DashboardHeader from './DashboardHeader';

const Products = () => {
  return (
    <div className="SupplierDashboard">
      
      <div className="DashboardContent">
      <h3 className="HeaderTitle">Dashboard</h3>
      </div>
      <div>
        <DashboardHeader/>
      </div>
    </div>
  )
}

export default Products

