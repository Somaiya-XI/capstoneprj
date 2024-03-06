import React from 'react'
import "./Supplier.css";
import { Button } from 'antd';
import DashboardHeader from './SupplierHeader';
import ProductTable from './ProductTable';
import { Layout } from 'antd';
import SearchField from './SearchField';
import ProductTable2 from './ProductTable2';
import ProductTable3 from './ProductTable3';







const Products = () => {
  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  return (


    // <div className="SupplierDashboard">
    //   <div className="DashboardContent">
    //     <h3 className="HeaderTitle">Products</h3>
    //     <Button className="AddButton" type="primary" onClick={handleAdd}>
    //       + Add
    //     </Button>
    //   </div>
    //   <SearchField/>
    //   <ProductTable2 />




    // </div>
    <>
    <ProductTable2/>
    
    </>



  )
}

export default Products

