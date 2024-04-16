import {useEffect, useState} from 'react';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from '@nextui-org/react';
import {API} from '../../backend';
import axios from 'axios';

const RetTable = ({data}) => {
  return (
    <>
      <Table aria-label='Example table with dynamic content' className='text-start text-black'>
        <TableHeader>
          <TableHeader>
            <TableColumn key='product_name'>Name</TableColumn>
            <TableColumn key='quantity'>Qyt</TableColumn>
            <TableColumn key='expiry_date'>Exp</TableColumn>
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

export default RetTable;
