import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Divider, Button} from '@nextui-org/react';

const PriceCard = ({Title, SubTitle, mainBody, Body, postBody, btnTxt = 'Get Started'}) => {
  return (
    <Card className='max-w-[300px] h-[400px] shadow-small bg-[#f7f7f7]'>
      <CardHeader className=' align-items-center justify-content-center m-0 p-0'>
        <div className='flex flex-col'>
          <p className='text-lg my-3'>{Title}</p>
          <div className='flex'>{SubTitle && <p className='text-small text-default-500'>{SubTitle}</p>} </div>
        </div>
      </CardHeader>
      <Divider className=' m-0 p-0' />
      <CardBody className='flex justify-content-center '>
        {mainBody && <span className='text-justify tracking-tighter'>{mainBody} </span>}{' '}
        {Body && <p className='p-2 text-center'>{Body}</p>}
        {postBody && <span className=' text-center'>{postBody}</span>}{' '}
      </CardBody>
      <Divider className=' m-0 p-0' />
      <CardFooter className='justify-content-center my-auto   '>
        <Button className='bg-[#023c07] text-white'>{btnTxt}</Button>
      </CardFooter>
    </Card>
  );
};

export default PriceCard;
