import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductTable3 = () => {
    const [columns, setColumns] = useState([
        {
            title: 'Image',
            dataIndex: 'product_img',
        },

    ]);
    const { id } = useParams();
    const [dataSource, setDataSource] = useState([]);


    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product/`)
            .then((result) => { setDataSource(result.data) })
            .catch(err => console.log(err))

    }, []);



    return (
        <div>
            <Table columns={columns} dataSource={dataSource} />

        </div>
    )
}

export default ProductTable3
