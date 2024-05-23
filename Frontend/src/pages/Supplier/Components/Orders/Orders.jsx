import React, { useState, useEffect } from "react";
import {
  EditIcon,
  SearchIcon,
  EyeIcon
} from "@/Components/Icons";
import { CustomSuccessToast, CustomErrorToast } from "@/Components/BasicComponents/CustomAlerts"
import { useUserContext } from "@/Contexts";
import { useCsrfContext } from "@/Contexts";
import { API } from "@/backend";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  SelectItem,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';

import SupplierLayout from '../Layout/SupplierLayout';

const statusColorMap = {
  processing: "default",
  ready_for_delivery: "warning",
  shipped: "success",
  delivered: "success",
  cancelled: "danger",
};

export default function OrdersLayout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { ax } = useCsrfContext();
  const { user } = useUserContext();
  const { csrf } = useCsrfContext();
  const [dataSource, setDataSource] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItems, setSelectedItems] = useState([]);
  const [OrderID, setOrderId] = useState([]);
  const [load, setLoad] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchOrders = () => {
    ax.get(`${API}order/view-supplier-orders/`)
      .then((response) => {
        console.log(response.data);
        const updatedData = response.data.map(order => ({
          order_id: order.order_data.order_id,
          order_date: order.order_data.order_date,
          retailer: order.order_data.retailer,
          shipping_address: order.order_data.shipping_address,
          total_price: order.order_data.total_price,
          ordered_items: order.ordered_items.map(item => ({
            product_id: item.product_id.product_id,
            product_name: item.product_id.product_name,
            new_price: item.product_id.new_price,
            ordered_quantity: item.ordered_quantity,
            item_status: item.item_status,
          }))
        }));
        setDataSource(updatedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [load]);

  const columns = [
    { key: "order_id", title: 'Order id' },
    { key: "retailer", title: 'Retailer' },
    { key: "order_date", title: 'Order date' },
    { key: "shipping_address", title: 'Shipping Address' },
    { key: "total_price", title: 'Total Price' },
    { key: "ordered_items", title: 'Ordered items' },
  ];

  const itemColumns = [
    { key: "product_id", name: "ID" },
    { key: "product_name", name: "Product Name" },
    { key: "new_price", name: "Price" },
    { key: "ordered_quantity", name: "Quantity" },
    { key: "item_status", name: "Status" },
    { key: "update_Status", name: "Update status" }
  ];

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderItemCell = (item, columnKey, order_id) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "item_status":
        return (
          <Chip color={statusColorMap[cellValue]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "update_Status":
        return (
          <Dropdown>
            <DropdownTrigger>
              <span>
                <EditIcon className='text-lg text-danger cursor-pointer active:opacity-50' />
              </span>
            </DropdownTrigger>
            <DropdownMenu aria-label="Update status">
              {Object.keys(statusColorMap).map(status => (
                <DropdownItem key={status} onClick={() => handleStatusUpdate(item, status)}>
                  <Chip color={statusColorMap[status]} size="sm" variant="flat" style={{ marginRight: '8px' }}>
                    {status}
                  </Chip>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <span className="table-cell-text">{cellValue}</span>;
    }
  };


  const getKeyValue = (item, key) => {
    switch (key) {
      case "ordered_items":
        return (
          <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
            <EyeIcon onClick={() => {
              setSelectedItems(item.ordered_items);
              setOrderId(item.ordered_items);
              console.log("items with id", item.ordered_items);
              console.log("items order id", item.order_id);
              onOpen();
            }} />

          </span>
        );
      default:
        return <span className="table-cell-text">{item[key]}</span>;
    }
  };

  const handleStatusUpdate = (item, item_status) => {
    const order_id = item.order_id
    console.log("Updating item with order_id:", item.order_id, "and status:", item_status);
    if (!item.order_id || !item_status) {
      console.error("order_id, item_status, or product_id is undefined!");
      return;
    }
    try {

      const payload = {
        order_id,
        item_status,
      };
      console.log("Payload:", payload);

      setLoad((load) => load + 1);

      const response = ax.put(`${API}order/update-order-item-status/`, payload);

      console.log('Response:', response);

      const msg = response.data.message;

      CustomSuccessToast({ msg: msg ? msg : 'Order status updated successfuly!', position: 'top-right', shiftStart: 'ms-0' });
      onClose();

    } catch (error) {
      console.error(error);

      const msg = error.response.data.error;

      CustomErrorToast({ msg: msg ? msg : 'Please enter valid data!', position: 'top-right', shiftStart: 'ms-0' });
    }
  };


  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedDataSource = dataSource.slice().sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.order_date) - new Date(b.order_date);
    } else {
      return new Date(b.order_date) - new Date(a.order_date);
    }
  });

  const filteredDataSource = sortedDataSource.filter(order =>
    order.order_id && order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SupplierLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold' aria-label="Product-Details">Incoming orders</h3>
        </div>
        <div className='mt-4'>
          <Table
            aria-label="Example table with dynamic content"
            topContent={
              <div className='flex flex-col gap-4'>
                <div className='flex justify-between gap-3 items-end'>
                  <Input
                    isClearable
                    className='w-full sm:max-w-[30%]'
                    placeholder='Search by order id...'
                    startContent={<SearchIcon />}
                    value={searchTerm}
                    onChange={onSearchChange}
                  />
                  <Dropdown align="left">
                    <DropdownTrigger>
                      <Button className='bg-[#023c07] text-white mt-4 size-24 h-10'>
                        Sort
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Action event example">
                      <DropdownItem onClick={toggleSortOrder}>Newest</DropdownItem>
                      <DropdownItem onClick={toggleSortOrder}>Oldest</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.title}</TableColumn>}
            </TableHeader>
            <TableBody items={filteredDataSource} className="mb-2">
              {(item, index) => (
                <TableRow key={item.order_id}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === "update_Status" ? renderItemCell(item, column.key, item.order_data.order_id) : getKeyValue(item, column.key)}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>


          </Table>
        </div>
      </div>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onClose}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >

        <ModalContent style={{ width: '100%', maxWidth: '60%' }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Ordered Items</ModalHeader>
              <ModalBody>
                <Table aria-label="Ordered items table">
                  <TableHeader columns={itemColumns}>
                    {(column) => (
                      <TableColumn key={column.key}>
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={selectedItems}>
                    {(item) => (
                      <TableRow key={item.product_id}>
                        {(columnKey) => (
                          <TableCell>{renderItemCell(item, columnKey, item.order_id)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>

                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </SupplierLayout>
  );
}
