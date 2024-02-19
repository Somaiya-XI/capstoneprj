import React from 'react'
import "./Supplier.css";
import DashboardHeader from './DashboardHeader';
import ProductTable from './ProductTable';




const Products = () => {
  return (
    <div className="SupplierDashboard">
      
      <div className="DashboardContent">
      <h3 className="HeaderTitle">Dashboard</h3>
      </div>
      <div>
        <DashboardHeader/>
      </div>
      <div className="Table">
        <ProductTable/>
      </div>
    </div>
  )
}

export default Products

