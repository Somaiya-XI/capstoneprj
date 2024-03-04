import React from 'react'
import "./Supplier.css";
import { Button } from 'antd';
import DashboardHeader from './SupplierHeader';
import ProductTable from './ProductTable';
import { Layout } from 'antd';






const Products = () => {
  return (


    <div className="SupplierDashboard">
      <div className="DashboardContent">
        <h3 className="HeaderTitle">Products</h3>
        <Button className="AddButton" type="primary" >
          + Add
        </Button>
      </div>
      <ProductTable />




    </div>



  )
}

export default Products

