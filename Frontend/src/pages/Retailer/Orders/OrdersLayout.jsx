import React, { useState, useEffect } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip, Popover,
  PopoverTrigger, PopoverContent, useDisclosure, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { EyeIcon, ConfirmIcon, CustomSuccessToast, CustomErrorToast, SearchIcon, } from "@/Components";
import { useUserContext } from "@/Contexts";
import { useCsrfContext } from "@/Contexts";
import { API } from "@/backend";
import { useParams, useNavigate, Link } from "react-router-dom";
import RetailerLayout from "../RetailerLayout";
import axios from "axios";

const statusColorMap = {
  processing: "warning",
  cancelled: "danger",
  shipped: "success",
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
  const [load, setLoad] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchOrders = async () => {
    try {
      const response = await ax.get(`${API}order/view-orders-history/`);
      setDataSource(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [load]);

  const columns = [
    { key: "order_id", title: 'Order id' },
    { key: "order_date", title: 'Order date' },
    { key: "payment_method", title: 'Payment method' },
    { key: "total_price", title: 'Total Price' },
    { key: "ordered_items", title: 'Ordered items' },
  ];

  const itemColumns = [
    { key: "product_name", name: "Product Name" },
    { key: "new_price", name: "Price" },
    { key: "ordered_quantity", name: "Quantity" },
    { key: "item_status", name: "Status" },
    { key: "cancel_order", name: "Actions" }
  ];

  const renderItemCell = (item, columnKey, order_id) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "product_name":
        return item.product_name;
      case "new_price":
        return item.new_price;
      case "item_status":
        return (
          <Chip color={statusColorMap[cellValue]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "cancel_order":
        return (
          <Popover showArrow={true} backdrop='opaque' size='sm'>
            <PopoverTrigger>
              <span
                style={{ color: item.item_status === "cancelled" ? 'gray' : 'red', cursor: item.item_status === "cancelled" ? 'not-allowed' : 'pointer' }}
              >
                Cancel order
              </span>
            </PopoverTrigger>
            {item.item_status !== "cancelled" && (
              <PopoverContent>
                <div className='px-1 py-2 flex text-center justify-content-center align-items-center'>
                  <span className='text-red-600'>Confirm cancellation?</span>
                  <Button
                    isIconOnly
                    variant='ghost'
                    aria-label='cancel order'
                    onClick={() => handleDelete(order_id, item.product_id)}
                  >
                    <ConfirmIcon width='18px' height='18px' fill='currentColor' />
                  </Button>
                </div>
              </PopoverContent>
            )}
          </Popover>
        );
      default:
        return cellValue;
    }
  };




  const getKeyValue = (item, key) => {
    switch (key) {
      case "order_id":
        return item.order_data.order_id;
      case "order_date":
        return item.order_data.order_date;
      case "payment_method":
        return item.order_data.payment_method;
      case "total_price":
        return item.order_data.total_price;
      case "ordered_items":
        return (
          <span
            style={{ color: 'green', cursor: 'pointer' }}
            onClick={() => {
              const itemsWithProductId = item.ordered_items.map(orderedItem => ({
                ...orderedItem,
                product_id: orderedItem.product_id.product_id,
                product_name: orderedItem.product_id.product_name,
                new_price: orderedItem.product_id.new_price,
                order_id: item.order_data.order_id,
              }));
              setSelectedItems(itemsWithProductId);
              console.log("items with id", itemsWithProductId);
              onOpen();
            }}
          >
            View items
          </span>
        );
      default:
        return null;
    }
  };

  const handleDelete = async (order_id, product_id) => {
    console.log("Deleting item with order_id:", order_id, "and product_id:", product_id);
    if (!order_id || !product_id) {
      console.error("order_id or product_id is undefined!");
      return;
    }
    try {
      const payload = {
        order_id,
        product_id,
      };
      console.log("Payload:", payload);

      // Increment loading state
      setLoad((load) => load + 1);

      const response = await ax.put(`${API}order/cancel-ordered-item/`, payload);

      console.log('Response:', response);

      const msg = response.data.message;

      CustomSuccessToast({ msg: msg ? msg : 'Deleted!', position: 'top-right', shiftStart: 'ms-0' });
      onClose(); // This will close the modal

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
      return new Date(a.order_data.order_date) - new Date(b.order_data.order_date);
    } else {
      return new Date(b.order_data.order_date) - new Date(a.order_data.order_date);
    }
  });

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDataSource = sortedDataSource.filter(order =>
    order.order_data.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RetailerLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold' aria-label="Product-Details">My Orders</h3>
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
                  {/* <Button className='bg-[#023c07] text-white mt-4 size-26 h-10' type='primary' onClick={toggleSortOrder}>
                    {`${sortOrder === "asc" ? "Ascending" : "Descending"}`}
                  </Button> */}
                  
                  <Dropdown align="left">
                  
                    <DropdownTrigger>
                      <Button
                      className='bg-[#023c07] text-white mt-4 size-24 h-10'

                        
                      >
                        Sort
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Action event example"
                      // onAction={(key) => alert(key)}
                    >
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
                <TableRow key={item.order_data.order_id}>
                  {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
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
        <ModalContent style={{ width: '80%', maxWidth: '800px' }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ordered Items</ModalHeader>
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
    </RetailerLayout>
  );
}

