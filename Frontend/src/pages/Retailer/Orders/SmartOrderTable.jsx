import {useCallback, useState, useMemo} from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input} from '@nextui-org/react';
import {SearchIcon} from '@/Components';
import {useNavigate} from 'react-router-dom';
import {useCsrfContext} from '@/Contexts';
import AutoOrderModal from './autoOrderModal';

const SmartOrder = ({data, total, setLoad}) => {
  const {ax} = useCsrfContext();
  const [filterValue, setFilterValue] = useState('');
  const hasSearchFilter = Boolean(filterValue);
  const navigate = useNavigate();

  const columns = [
    {name: 'Product Name', uid: 'name'},
    {name: 'Unit Price', uid: 'unit_price'},
    {name: 'Qyt', uid: 'quantity'},
    {name: 'Subtotal', uid: 'subtotal'},
  ];

  const items = useMemo(() => {
    let filteredProducts = [...data];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((prod) => prod.name.toLowerCase().includes(filterValue.toLowerCase()));
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
            placeholder='Search for product..'
            startContent={<SearchIcon />}
            value={filterValue}
            onValueChange={onSearchChange}
          />
          <AutoOrderModal></AutoOrderModal>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, hasSearchFilter]);

  const bottomContent = (
    <div className='flex justify-end px-[290px] font-medium'>
      <p>Total: {total}</p>
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <>
        <Table topContent={topContent}>
          <TableHeader>{<TableColumn align='start'>Product</TableColumn>}</TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <span>No Orders to confirm</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }
  return (
    <>
      <Table topContent={topContent} bottomContent={bottomContent}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align='start'>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.product_id}>{(columnKey) => <TableCell>{item[columnKey]}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default SmartOrder;
