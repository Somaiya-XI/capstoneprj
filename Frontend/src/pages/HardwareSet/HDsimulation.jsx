import '../../index.css';
import './hd.css';
import src from './page_assets/bg.json';
import {useLottie} from 'lottie-react';
import {Card, CardBody, Button, Tabs, Tab} from '@nextui-org/react';
import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API, ESP_URL, WS_API} from '../../backend';
import RetTable from './SimulationTable';
import SmartCart from './SimulationCart';

const HardwareSimulation = () => {
  const [data, setData] = useState();
  const [load, setLoad] = useState(0);

  useEffect(() => {
    const socket = new WebSocket(`${WS_API}/ws/updates/`);

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const msg = data.message;
      console.log('Message from server ', msg);
      setLoad((l) => l + 1);
    });
  }, []);

  const Default = (
    <>
      <div className='mt-6'>{data && <RetTable data={data}></RetTable>}</div>
    </>
  );

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}product/get-simulation`, {
        withCredentials: true,
      });
      const productsWithKeys = response.data.map((product) => ({
        ...product,
        key: product.product_id,
      }));

      setData(productsWithKeys);
      console.log(productsWithKeys);
    } catch (error) {
      console.error(error.data);
    }
  };

  const handleReset = () => {
    axios
      .get(`${API}product/reset-simulation/`)
      .then((response) => {
        console.log(response.data);
        setLoad((l) => l + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const reset = <span className='icon-[mdi--loop] text-white ml-2 cursor-pointer' onClick={handleReset}></span>;
  const cart = <SmartCart></SmartCart>;

  useEffect(() => {
    fetchProducts();
  }, [load]);

  const lottieStyle = {
    position: 'absolute',
    borderRadius: '30px',
    overflow: 'hidden',
  };

  const lottieOptions = {
    animationData: src,
    loop: true,
    autoplay: true,
  };

  const {View} = useLottie(lottieOptions, lottieStyle);

  const callESP = (url) => {
    axios
      .get(url)
      .then((response) => {
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdateQuantity = (type, n) => {
    if (type == 'add') {
      callESP(`${ESP_URL}/add`);
    } else if (type == 'remove') {
      switch (n) {
        case 1:
          callESP(`${ESP_URL}/remove1`);
          break;
        case 2:
          callESP(`${ESP_URL}/remove2`);
          break;
      }
    } else {
      callESP(`${ESP_URL}/new`);
    }
  };

  return (
    <div>
      <div className='container-fluid simulation-section-wrapper'>
        <div className='sim-logo-btn'>
          <Link to='/'>
            <p className='font-bold text-[#023c07] text-center text-4xl '>WiseR</p>
          </Link>
        </div>
        <div className='row align-items-center justify-content-center'>
          <div className='col-4'>
            <Card className='sim-content-wrapper px-4 py-0 shadow-sm bg-[#333333fc]'>
              <CardBody className=''>
                <Tabs
                  aria-label='Options'
                  variant='light'
                  classNames={{
                    tabList: 'gap-12 w-full text-center relative ',
                    cursor: 'bg-[#4b4b4b] h-9 my-auto ',
                    tabContent: 'group-data-[selected=true]:text-[#ffffff] text-zinc-400 text-lg ',
                  }}
                >
                  <Tab key='1' title='New' className=' px-2 text-center'>
                    {Default}
                    <div className='flex align-items-center justify-content-center mt-9'>
                      <Button className='bg-[#617F62] text-white' onClick={() => handleUpdateQuantity('new', 1)}>
                        Add new product
                      </Button>
                      {reset} {cart}
                    </div>
                  </Tab>
                  <Tab key='2' title='Add' className=' px-2 text-center'>
                    {Default}
                    <div className='flex align-items-center justify-content-center mt-9'>
                      <Button className='bg-[#617F62] text-white' onClick={() => handleUpdateQuantity('add', 1)}>
                        Add more to shelf
                      </Button>
                      {reset} {cart}
                    </div>
                  </Tab>
                  <Tab key='3' title='Remove' className=' px-2 text-center'>
                    {Default}
                    <div className='flex align-items-center justify-content-center mt-9'>
                      <Button className='bg-[#617F62] text-white' onClick={() => handleUpdateQuantity('remove', 1)}>
                        Remove from shelf
                      </Button>
                      <Button
                        className='bg-[#617F62] text-white ml-2'
                        onClick={() => handleUpdateQuantity('remove', 2)}
                      >
                        Reach 0
                      </Button>
                      {reset} {cart}
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>
          <div className='col-8'>
            <Card className='sim-secondry-content-wrapper d-flex align-items-center justify-content-center py-0 shadow-sm bg-transparent'>
              {View}
              <div className='lottie-title text-zinc-50 text-7xl '>Hardware Simulation</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareSimulation;

//bg-[#f7f7f7] [#023c07]
