import {useCallback, useEffect, useState} from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Image} from '@nextui-org/react';
import {API, imgURL} from '../../backend';
import {useCsrfContext, useUserContext} from '@/Contexts';
import {EyeIcon, EditIcon} from '@/Components';
import {useNavigate} from 'react-router-dom';

const ProductBulkTable = ({product_id, setProductName}) => {
  const navigate = useNavigate();

  const columns = [
    {name: 'Bulk', uid: 'key'},
    {name: 'Quantity', uid: 'bulk_qyt'},
    {name: 'Expiry Date', uid: 'expiry_date'},
    {name: 'Days Till EXP', uid: 'days_to_expiry'},
  ];
  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case 'key':
        return `Bulk ${cellValue + 1}`;
      case 'days_to_expiry':
        return ` ${cellValue} Days`;
      case 'bulk_qyt':
        return ` ${cellValue} pcs`;
      default:
        return cellValue;
    }
  }, []);

  const [data, setData] = useState();
  const {ax} = useCsrfContext();
  useEffect(() => {
    fetchBulks();
  }, []);

  const fetchBulks = async () => {
    try {
      const response = await ax.get(`${API}product/view_bulk/${product_id}/`);

      const [Product, ...Bulks] = response.data;
      setProductName((p) => Product.product_name);
      const bulksWithKeys = Bulks.map((bulk, index) => ({
        ...bulk,
        key: index,
      }));

      console.log(bulksWithKeys);
      setData(bulksWithKeys);
      console.log(bulksWithKeys);
    } catch (error) {
      console.error(error.data);
    }
  };
  if (!data) {
    return (
      <>
        <Table>
          <TableHeader>{<TableColumn align='start'>Bulks</TableColumn>}</TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <span>EMPTY</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }
  return (
    <>
      <Table>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.key}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductBulkTable;
