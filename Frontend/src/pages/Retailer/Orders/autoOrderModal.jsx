import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from '@nextui-org/react';
const AutoOrderModal = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleConfirm = () => {
    console.log('Confim!');
  };

  return (
    <>
      <div className='flex gap-3'>
        <Button onPress={onOpen}>Confirm Auto Ordering!</Button>
      </div>
      <Modal size='sm' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <div className='flex align-items-center'>
              <ModalHeader className='flex justify-center py-3 font-base'>Complete Order</ModalHeader>
              <ModalFooter className='flex justify-center py-3'>
                <Button onPress={handleConfirm} className='bg-[#023c07] text-white'>
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
