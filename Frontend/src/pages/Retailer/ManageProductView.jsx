import {useState, useEffect} from 'react';
import './retailer.css';
import {useCsrfContext} from '@/Contexts';
import {API} from '@/backend';
import {CustomErrorToast, CustomSuccessToast, EditIcon} from '@/Components';
import {parseDate} from '@internationalized/date';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  DateInput,
} from '@nextui-org/react';
import {fileToBase64} from '@/Helpers';

const ManageProduct = ({product_id, setLoad}) => {
  const {ax} = useCsrfContext();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [date, setDate] = useState(parseDate('2024-04-04'));
  const [img, setImg] = useState();

  const [productData, setProductData] = useState({
    tag_id: '',
    product_name: '',
    brand: '',
    price: '',
    product_img: '  ',
    expiry_date: null,
  });

  const handleChange = (name) => async (e) => {
    e.preventDefault();
    if (name === 'product_img') {
      const file = e.target.files[0];
      const file64 = await fileToBase64(file);
      console.log('img path', file64);
      setImg(file64);
    } else {
      setProductData({
        ...productData,
        [name]: e.target.value,
      });
    }
  };

  const Create = async (Close) => {
    try {
      const {year, month, day} = date;
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log(formattedDate);
      const response = await ax.post(`${API}/product/supermarket/manage/`, {
        ...productData,
        expiry_date: formattedDate,
        product_img: img,
      });
      console.log('response: ', response);
      const msg = response.data.message;
      setLoad((l) => l + 1);
      CustomSuccessToast({msg: msg ? msg : 'Created!', position: 'top-right', shiftStart: 'ms-0'});
      Close();
    } catch (error) {
      console.error(error);
      const msg = error.response.data.error;
      CustomErrorToast({msg: msg ? msg : 'please enter valid data!', position: 'top-right', shiftStart: 'ms-0'});
    }
  };

  const onConfirm = async (Close) => {
    Create(Close);
  };

  const fetchProduct = async () => {
    try {
      const response = await ax.get(`${API}product/supermarket-product/${product_id}/`);
      const data = response.data;
      setProductData({
        ...data,
      });
      console.log('productData is', productData);
    } catch (error) {
      console.error(error.data);
    }
  };

  useEffect(() => {
    if (product_id !== 0) {
      fetchProduct();
    }
  }, []);

  return (
    <>
      {product_id === 0 ? (
        <Button className='AddButton retailer-link-btn text-default' type='primary' onPress={onOpen}>
          + Add
        </Button>
      ) : (
        <EditIcon onClick={onOpen} />
      )}
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
              {product_id === 0 ? (
                <ModalHeader className='flex flex-col gap-1 text-center'>Create Product</ModalHeader>
              ) : (
                <ModalHeader className='flex flex-col gap-1 text-center'>Update Product</ModalHeader>
              )}
              <ModalBody className='flex align-items-center justify-content-center my-0 py-0 gap-0'>
                <Input
                  label='Tag ID'
                  className='w-full mb-3'
                  placeholder='xxxxxxxxxxxxx'
                  value={productData.tag_id}
                  onChange={handleChange('tag_id')}
                  isDisabled={product_id === 0 ? false : true}
                  isRequired={product_id === 0 ? true : false}
                />
                <Input
                  label='Product Name'
                  className='w-full mb-3'
                  placeholder='milk 200g'
                  value={productData.product_name}
                  onChange={handleChange('product_name')}
                />
                <Input
                  label='Brand'
                  className='w-full mb-3'
                  placeholder='almarai'
                  value={productData.brand}
                  onChange={handleChange('brand')}
                />
                <Input
                  type='number'
                  label='Price'
                  className='w-full mb-3'
                  placeholder='00.00'
                  labelPlacement='inside'
                  value={productData.price}
                  onChange={handleChange('price')}
                  endContent={
                    <div className='pointer-events-none flex items-center'>
                      <span className='text-default-400 text-small'>SAR</span>
                    </div>
                  }
                />
                <Input
                  type='file'
                  label='Product Image'
                  placeholder='   '
                  className='w-full mb-3'
                  labelPlacement='inside'
                  value={productData.product_img}
                  onChange={handleChange('product_img')}
                />
                {product_id === 0 ? (
                  <DateInput label='Date' placeholder='2024-04-04' value={date} onChange={setDate} isRequired />
                ) : null}
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

export default ManageProduct;
