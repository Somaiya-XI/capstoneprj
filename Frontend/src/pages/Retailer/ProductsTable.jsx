import {useCallback, useEffect, useState, useMemo} from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Input} from '@nextui-org/react';
import {API, imgURL} from '../../backend';
import {EyeIcon, SearchIcon} from '@/Components';
import {useNavigate} from 'react-router-dom';
import ManageProduct from './ManageProductView';

const SuperMarketProducts = ({data, setLoad}) => {
  const [filterValue, setFilterValue] = useState('');
  const hasSearchFilter = Boolean(filterValue);
  const navigate = useNavigate();
  const columns = [
    {name: 'Product Image', uid: 'product_img'},
    {name: 'Product ID', uid: 'tag_id'},
    {name: 'Product Name', uid: 'product_name'},
    {name: 'Brand', uid: 'brand'},
    {name: 'Total Qyt', uid: 'quantity'},
    {name: 'Total Bulks', uid: 'bulks'},
    {name: 'Actions', uid: 'actions'},
  ];

  const items = useMemo(() => {
    let filteredProducts = [...data];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter(
        (prod) =>
          prod.product_name.toLowerCase().includes(filterValue.toLowerCase()) || prod.tag_id.includes(filterValue)
      );
    }
    return filteredProducts;
  }, [data, filterValue]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[30%]'
            placeholder='Search by product name or id...'
            startContent={<SearchIcon />}
            value={filterValue}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <ManageProduct product_id={0} setLoad={setLoad}></ManageProduct>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, hasSearchFilter]);

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];
    const fallback = product['product_name'].slice(0, 2);
    switch (columnKey) {
      case 'product_img':
        return (
          <Avatar
            radius='lg'
            size='lg'
            name='  '
            showFallback
            fallback={fallback}
            src={`${imgURL}${cellValue}`}
            classNames={{img: 'transition-opacity !duration-500 opacity-1'}}
          ></Avatar>
        );
      case 'actions':
        return (
          <div className='relative flex items-center gap-2'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <EyeIcon onClick={() => navigate(`/retailer-dashboard/my-products/view/${product.key}`)} />
            </span>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <ManageProduct product_id={product.key} setLoad={setLoad}></ManageProduct>
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (!data || data.length === 0) {
    return (
      <>
        <Table>
          <TableHeader>{<TableColumn align='start'>Product</TableColumn>}</TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <span>No Products In Your Supermarket Dashboard</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }
  return (
    <>
      <Table topContent={topContent}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'product_name' ? 'start' : 'center'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.key}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default SuperMarketProducts;
