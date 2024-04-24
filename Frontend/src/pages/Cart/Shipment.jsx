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
import { DeleteOutlined, EditOutlined,} from "@ant-design/icons";
import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { CiWarning } from "react-icons/ci";
import { useUserContext } from "../../Contexts";
import axios from "axios";
import { API } from "../../backend";

export default function Shipment() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUserContext();
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    district: "",
    street: "",
  });

  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${API}/user/${user.id}`, {
        withCredentials: true,
      });
      console.log("Address response:", response.data);
      setAddresses(response.data.addresses || []); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = () => {
    const { state, city, district, street } = formData;
    if (!state || !city || !district || !street) {
      setError("This field is required");
    } else {
      setAddresses([...addresses, formData]);
      onClose();
      setError("");
    }
  };

  const handleDelete = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => { }

  return (
    <div>
      <Card className="max-w-[600px] py-3 mx-4 mb-3" >
        <CardHeader className="justify-between">
          <div className="flex flex-col">
            <h6 className="text-lg text-black">Shipping Address</h6>
          </div>
          <FaPlus
            className="text-[#023c07] mx-3 size-5 cursor-pointer hover:text-[#a3e189]"
            onClick={onOpen}
          />
        </CardHeader>
        <CardBody>
          {loading ? ( 
            <p>Loading...</p>
          ) : addresses.length === 0 ? (
            <div className="flex items-center justify-center">
              <p className="text-grey-300">No address is added yet</p>
              <CiWarning className="size-5 ml-1 mb-3 text-grey-300" />
            </div>
          ) : (
            <div className="flex gap-3">
              {addresses.map((address, index) => (
                <Card
                  key={index}
                  className="max-w-[250px] shadow-none border-1 border-[#a3e189] px-2 py-2"
                >
                  <CardHeader className="justify-between p-1">
                    <p className="text-md text-black">Shipping</p>
                    <div className="flex gap-3 mb-3 mx-2">
                      <DeleteOutlined className="text-rose-500 size-3 cursor-pointer" onClick={() => handleDelete(index)} />
                      <EditOutlined className="text-[#023c07] size-3 cursor-pointer" />
                    </div>
                  </CardHeader>
                  <p>{`${user.address}, ${address.city}, ${address.district}, ${address.street}`}</p>
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
              Add New Address
            </ModalHeader>
            <ModalBody>
              <Input
                name="state"
                isRequired
                label="State"
                placeholder="Enter your state"
                variant="bordered"
                value={formData.state}
                onChange={handleChange}
                errorMessage={!formData.state && error}
              />
              <Input
                name="city"
                isRequired
                label="City"
                placeholder="Enter your city"
                variant="bordered"
                value={formData.city}
                onChange={handleChange}
                errorMessage={!formData.city && error}
              />
              <Input
                name="district"
                isRequired
                label="District"
                placeholder="Enter your district"
                variant="bordered"
                value={formData.district}
                onChange={handleChange}
                errorMessage={!formData.district && error}
              />
              <Input
                name="street"
                isRequired
                label="Street"
                placeholder="Enter your street"
                variant="bordered"
                value={formData.street}
                onChange={handleChange}
                errorMessage={!formData.street && error}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
