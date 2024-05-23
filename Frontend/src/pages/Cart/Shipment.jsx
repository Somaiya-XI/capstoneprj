import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Radio,
  RadioGroup
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Popconfirm} from 'antd';
import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import { CiWarning } from "react-icons/ci";
import { useUserContext } from "../../Contexts";
import axios from "axios";
import { API } from "../../backend";
import { CustomSuccessToast } from "@/Components/FormComponents/CustomAlerts";

export default function Shipment({address, setAddress}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadState, setLoadState] = useState(0);
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [AddressData, setAddressData] = useState({
    state: "",
    city: "",
    district: "",
    street: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAddressData({ ...AddressData, [e.target.name]: e.target.value }); 
  };

  const fetchAddresses = async () => {
    axios.get(`${API}user/${user.id}`, {
      withCredentials: true,
    })
      .then(response => {
        const addressString = response.data.address;
        const addressArray = addressString.split(";");
        setAddress([{
          state: addressArray[0] || "",
          city: addressArray[1] || "",
          district: addressArray[2] || "",
          street: addressArray[3] || ""
        }]);
      })
      .catch(err => console.log(err));
  };



  useEffect(() => {
    fetchAddresses();
  }, [loadState]);
  

  const UpdateAddress = async () => {
    const { state, city, district, street } = AddressData;
    if (!state || !city || !district || !street) {
      setError("This field is required");
    } else {
      try {
        const compiledAddress = `${state};${city};${district};${street};`;
        console.log('Compiled Address:', compiledAddress);
        await axios.put(
          `${API}user/update/${user.id}/`,
          { address: compiledAddress }
        );
  
        setAddress([{ state, city, district, street }]);
        CustomSuccessToast({ msg: 'Your address has been updated!', dur: 3000 });
  
        onClose();
        setError("");
      } catch (error) {
        console.error("Error updating address:", error);
      }
    }
  };
  


  const handleAddressDelete = (index) => {
    axios.put(
      `${import.meta.env.VITE_API_URL}user/update/${user.id}/`,
      { address: null }
    );
    CustomSuccessToast({ msg: 'Success! Your address has been deleted.', dur: 2000 });
    setAddress(address.filter((_, i) => i !== index));
    setTimeout(() => {
      window.location.reload();
    }, 2000);


  };

  const handleEdit = (index) => {
    const editedAddress = address[index];
    setAddressData({
      state: editedAddress.state,
      city: editedAddress.city,
      district: editedAddress.district,
      street: editedAddress.street
    });
    onOpen();
  };


  return (
    <div>
      <Card className="max-w-[600px] py-3 mx-4 mb-3">
        <CardHeader className="justify-between">
          <div className="flex flex-col">
            <h6 className="text-lg text-black">Shipping Address</h6>
          </div>
          {address.length === 0 && (
            <FaPlus
              className="text-[#023c07] mx-3 size-5 cursor-pointer hover:text-[#a3e189]"
              onClick={onOpen}
            />
          )}
        </CardHeader>
        <CardBody>
          {loading && address.length === 0 ? (
            <div className="flex items-center justify-center">
              <p className="text-grey-300">No address is added yet</p>
              <CiWarning className="size-5 ml-1 mb-3 text-grey-300" />
            </div>
          ) : (
            <div className="flex gap-3">
              {address.map((address, index) => (
                <Card
                  key={index}
                  className="max-w-[250px] shadow-none border-1 border-[#a3e189] px-2 py-2"
                >
                  <CardHeader className="justify-between p-1">
                    <p className="text-md text-black">Shipping</p>
                    <div className="flex gap-3 mb-3 mx-2">
                        <Popconfirm title='Sure to delete?' onConfirm={() => handleAddressDelete(index)}>
                          <DeleteOutlined className="text-rose-500 size-3 cursor-pointer"/>
                        </Popconfirm>
                      
                      <EditOutlined className="text-[#023c07] size-3 cursor-pointer" onClick={() => handleEdit(index)} />
                    </div>
                  </CardHeader>
                  <p>{`${address.state}, ${address.city}, ${address.district}, ${address.street} `}</p>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editIndex !== null ? "Edit Address" : "Add New Address"}
            </ModalHeader>
            <ModalBody>
              <Input
                name="state"
                isRequired
                label="State"
                placeholder="Enter your state"
                variant="bordered"
                value={AddressData.state}
                onChange={handleChange}
                errorMessage={!AddressData.state && error}
              />
              <Input
                name="city"
                isRequired
                label="City"
                placeholder="Enter your city"
                variant="bordered"
                value={AddressData.city}
                onChange={handleChange}
                errorMessage={!AddressData.city && error}
              />
              <Input
                name="district"
                isRequired
                label="District"
                placeholder="Enter your district"
                variant="bordered"
                value={AddressData.district}
                onChange={handleChange}
                errorMessage={!AddressData.district && error}
              />
              <Input
                name="street"
                isRequired
                label="Street"
                placeholder="Enter your street"
                variant="bordered"
                value={AddressData.street}
                onChange={handleChange}
                errorMessage={!AddressData.street && error}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={UpdateAddress}>
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
