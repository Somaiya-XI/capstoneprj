import {DeleteIcon, ConfirmIcon, CustomErrorToast, CustomSuccessToast} from '@/Components';
import {useCsrfContext} from '@/Contexts';
import {Popover, PopoverTrigger, PopoverContent, Button} from '@nextui-org/react';
import {API} from '@/backend';

const DeleteProduct = ({product_id, setLoad}) => {
  const {ax} = useCsrfContext();
  const handleDelete = async () => {
    try {
      const response = await ax.delete(`${API}product/supermarket/delete/`, {
        data: {id: product_id},
      });
      console.log('response: ', response);
      const msg = response.data.message;
      setLoad((l) => l + 1);
      CustomSuccessToast({msg: msg ? msg : 'Deleted!', position: 'top-right', shiftStart: 'ms-0'});
    } catch (error) {
      console.error(error);
      const msg = error.response.data.error;
      CustomErrorToast({msg: msg ? msg : 'please enter valid data!', position: 'top-right', shiftStart: 'ms-0'});
    }
  };
  return (
    <Popover showArrow={true} backdrop='opaque' size='sm'>
      <PopoverTrigger>
        <div>
          <DeleteIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className='px-1 py-2 flex text-center justify-content-center align-items-center'>
          <span className='text-red-600'>Confirm deletion?</span>
          <Button isIconOnly variant='ghoast' aria-label='delete item' onClick={handleDelete}>
            <ConfirmIcon width='18px' height='18px' fillbg='currentColor' />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteProduct;
