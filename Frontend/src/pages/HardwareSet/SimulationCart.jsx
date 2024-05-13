import {API} from '@/backend';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from '@nextui-org/react';
import axios from 'axios';
import {useEffect, useState} from 'react';

const SmartCart = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}cart/view-smart-cart/`, {
        withCredentials: true,
      });
      const Items = response.data.products;
      setCartItems(Items);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleOpen = async () => {
    await fetchCart();
    onOpen();
  };

  return (
    <>
      <div className='flex flex-wrap gap-3'>
        <span
          class='icon-[solar--cart-large-outline] text-white ml-2 cursor-pointer'
          onClick={handleOpen}
          data-test='smart-cart-btn'
        ></span>
        {/* <Button onPress={onOpen}>show cart</Button> */}
      </div>
      <Modal size='lg' isOpen={isOpen} onClose={onClose} className='bg-zinc-300'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col'>Currently in smart cart</ModalHeader>
              <ModalBody>
                <div className='justify-between py-0 px-2 align-middle my-0'>
                  <div className='flex gap-14'>
                    <p className='my-3'>Name</p>
                    <p className='my-3'>Quantity</p>
                    <p className='my-3'>Price</p>
                  </div>
                </div>
                {cartItems.map((item, index) => (
                  <Card key={index} className='max-w-[500px] shadow-sm' isBlurred data-test='cartitem-cards'>
                    <CardHeader className='justify-between py-0 align-middle my-0'>
                      <div className='flex gap-14'>
                        <p className='my-3'>{item.name}</p>
                        <p className='my-3'>{item.quantity}</p>
                        <p className='my-3'>{item.subtotal}</p>
                      </div>
                    </CardHeader>
                    <CardBody className='px-3 py-0 text-small text-default-400 my-0'></CardBody>
                  </Card>
                ))}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SmartCart;
