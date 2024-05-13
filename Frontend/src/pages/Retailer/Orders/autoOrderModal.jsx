import {useCsrfContext} from '@/Contexts';
import {API} from '@/backend';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import axios from 'axios';
import {useState} from 'react';
import {toast} from 'sonner';

const AutoOrderModal = ({total}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {ax} = useCsrfContext();
  const [balance, setBalance] = useState([]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API}payment/view-wallet-balance/`, {
        withCredentials: true,
      });
      const walletbalance = response.data.payment_wallet;
      setBalance((b) => walletbalance);
      console.log(response.data.payment_wallet);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleOpen = async () => {
    await fetchBalance();
    onOpen();
  };

  const handleConfirm = async () => {
    try {
      const response = await ax.post(`${API}order/make-auto-order/`);
      console.log(response);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <div className='flex gap-3'>
        <div>
          <Button onPress={handleOpen}>Confirm Auto Ordering!</Button>
        </div>
      </div>
      <Modal size='sm' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <div className='flex align-items-center'>
              <ModalHeader className='flex justify-center py-3 font-base'>Complete Order</ModalHeader>
              <ModalFooter className='flex justify-center py-3'>
                <Button
                  onPress={handleConfirm}
                  className='bg-[#023c07] text-white'
                  isDisabled={parseFloat(balance) < parseFloat(total) ? true : false}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AutoOrderModal;
