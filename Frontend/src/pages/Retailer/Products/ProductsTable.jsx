import {useCallback, useState, useMemo} from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Input, Button} from '@nextui-org/react';
import {imgURL, API} from '@/backend';
import {EyeIcon, SearchIcon, CustomErrorToast, CustomSuccessToast} from '@/Components';
import {useNavigate} from 'react-router-dom';
import ManageProduct from './ManageProductView';
import DeleteProduct from './DeleteProduct';
import {useCsrfContext} from '@/Contexts';


const SuperMarketProducts = ({data, setLoad}) => {
  const {ax} = useCsrfContext();
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

  const applyAutoOrder = (product_id) =>  async () => {
    try {
        const { data } = await ax.put(`${API}config/auto-order-config/update-product-config/`, {product_id:product_id, config_type:"default"});
        console.log(data)
        if (data.hasOwnProperty("message")){
            CustomSuccessToast({ msg: data.message, dur: 3000 });
        }
        else if(data.hasOwnProperty("error")){
            CustomErrorToast({ msg: data.error, dur: 3000 });
        }
    }catch (error) {
    console.error(error.message);
  }
}

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
    switch (columnKey) {
      case 'product_img':
        return (
          <Avatar
            radius='lg'
            size='lg'
            name={product['product_name']}
            showFallback
            src={`${imgURL}${cellValue}`}
            classNames={{img: cellValue ? 'opacity-1' : 'opacity-0'}}
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
            <span className='text-lg text-red-600 cursor-pointer active:opacity-50'>
              <DeleteProduct product_id={product.key} setLoad={setLoad} />
            </span>
            <span className='text-default cursor-pointer active:opacity-50'>
              <Button className='bg-[#023c07] text-default' onClick={applyAutoOrder(product.key)}>Apply Auto-order</Button>
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
        <Table topContent={topContent}>
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
