import React from 'react';
import { Button, message } from 'antd';
import "./Supplier.css";
const SuccessMsg = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';
  const openMessage = () => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: 'Loaded!',
        duration: 2,
      });
    }, 1000);
  };
  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={openMessage} htmlType="submit" className="AddButton">
        Open the message box
      </Button>
    </>
  );
};
export default SuccessMsg;