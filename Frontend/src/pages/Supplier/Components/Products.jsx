import React from 'react'
import "./Supplier.css";
import DashboardHeader from './DashboardHeader';
import { Space, Table, Tag } from 'antd';
import { TableProps } from 'antd';



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

