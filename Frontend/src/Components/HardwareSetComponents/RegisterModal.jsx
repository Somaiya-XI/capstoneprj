import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from '@nextui-org/react';
import {IconedInput, CustomErrorToast, CustomSuccessToast, HardwareIcon} from '../../Components/index.jsx';
import {useState} from 'react';
import axios from 'axios';
import {useCsrfContext} from '../../Contexts';
import {API} from '../../backend.jsx';

const RegisterModal = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [deviceId, setDeviceId] = useState('');
  const {csrf} = useCsrfContext();

  const handleChange = (e) => {
    setDeviceId((i) => e.target.value);
  };

  const onConfirm = async (Close) => {
    try {
      const response = await axios.post(
        `${API}device-register/`,
        {
          gateway_id: deviceId,
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      Close();
      CustomSuccessToast({msg: 'Device Registered!', position: 'top-right', shiftStart: 'ms-0'});
    } catch (error) {
      console.error(error.response);
      const msg = error.response.data.error;
      CustomErrorToast({msg: msg ? msg : 'please enter a valid ID!', position: 'top-right', shiftStart: 'ms-0'});
    }
  };
  return (
    <>
      <Button onPress={onOpen} className='text-white mx-3 my-0 bg-[#023c07]'>
        Register
      </Button>
      {/* <Tooltip disableAnimation={true} content='Enter the ID you recieved with your set'>
      </Tooltip> */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        backdrop='blur'
        className='shadow-small bg-[#f7f7f7]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-center'>
                Fill In the ID you recieved with your set
              </ModalHeader>
              <ModalBody className='flex align-items-center justify-content-center my-0 py-0 gap-0'>
                <IconedInput
                  icon={HardwareIcon}
                  placeholder='Device ID'
                  value={deviceId}
                  onChange={handleChange}
                  className='form-control'
                  autoFocus
                  required
                ></IconedInput>
                <div className='flex py-2 px-1 justify-between'></div>
              </ModalBody>
              <ModalFooter className='flex align-items-center justify-content-center my-2  py-3 mb-4'>
                <Button className='bg-[#023c07] text-white' onPress={() => onConfirm(onClose)}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterModal;
