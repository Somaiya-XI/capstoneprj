import {useEffect, useState} from 'react';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from '@nextui-org/react';
import {API} from '../../backend';
import axios from 'axios';
import {useCsrfContext, useUserContext} from '@/Contexts';

const SuperMarketProducts = () => {
  const [data, setData] = useState();
  const {ax} = useCsrfContext();
  const {user} = useUserContext();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ax.get(`${API}product/get-ret-products/${user.id}/`);
      const productsWithKeys = response.data.map((product) => ({
        ...product,
        key: product.product_id,
      }));

      setData(productsWithKeys);
      console.log(productsWithKeys);
    } catch (error) {
      console.error(error.data);
    }
  };
  if (!data) {
    return <div>No Data</div>;
  }
  return (
    <>
      <Table aria-label='Example table with dynamic content' className='text-start text-black'>
        <TableHeader>
          <TableHeader>
            <TableColumn key='product_name'>Name</TableColumn>
            <TableColumn key='quantity'>Qyt</TableColumn>
          </TableHeader>
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default SuperMarketProducts;
