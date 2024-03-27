import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SupplierLayout from "../Layout/SupplierLayout";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import ScheduleCard from "./ScheduleCard";
import axios from "axios";
import {API} from "../../../../backend";
import {useCsrfContext, useUserContext} from "../../../../Contexts";
import {toast} from "sonner";

const Schedule = () => {
  const {user} = useUserContext();

  const {csrf} = useCsrfContext();
  const [dataForm, setFormData] = useState({
    day: "",
    time: "",
  });
  const [load, setLoad] = useState(0);
  const days = [
    {value: "sun", label: "Sunday"},
    {value: "mon", label: "Monday"},
    {value: "tue", label: "Tuesday"},
    {value: "wed", label: "Wednesday"},
    {value: "thu", label: "Thursday"},
    {value: "fri", label: "Friday"},
    {value: "sat", label: "Saturday"},
  ];
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  const handleClose = () => {
    onClose();
  };

  const handleChange = (name) => (e) => {
    setFormData({
      ...dataForm,
      [name]: e.target.value,
    });
  };
  const handleonAdd = (event) => {
    event.preventDefault();
    if (!dataForm.day || !dataForm.time) {
      toast.error("All fields are required.");
      return;
    }
    axios
      .post(`${API}schedule/create/`, dataForm, {
        headers: {
          "X-CSRFToken": csrf,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        onClose();
      })
      .catch((err) => {
        console.log("Error:", err);
        if (err.response) {
          console.log("Server Response Data:", err.response.data);
        }
      });
    setFormData({day: "", time: ""});
    setLoad((l) => l + 1);
  };

  return (
    <SupplierLayout>
      <div className="SupplierDashboard">
        <div className="DashboardContent">
          <h3 className="HeaderTitle">Supply Schedule</h3>
          <Button className="AddButton text-light" type="primary" onClick={handleOpen}>
            + Add
          </Button>
        </div>
        <div
          key={load}
          style={{
            borderRadius: 24,
            backgroundColor: "white",
            boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)",
            padding: 5,
            paddingLeft: 40,
            maxWidth: 1555,
            margin: "0 auto",
            marginTop: 5,
          }}
        >
          <ScheduleCard />
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={handleClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Add Schedule</ModalHeader>
            <ModalBody>
              <Select
                items={days}
                autoFocus
                label="Day"
                placeholder="Select day"
                variant="bordered"
                value={dataForm.day}
                onChange={(selectedDay) => {
                  setFormData({...dataForm, day: selectedDay.target.value});
                }}
              >
                {(days) => <SelectItem key={days.value}>{days.label}</SelectItem>}
              </Select>

              <Input
                label="Time"
                placeholder="Enter your time"
                type="time"
                variant="bordered"
                value={dataForm.time}
                onChange={(e) => setFormData({...dataForm, time: e.target.value})}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={handleClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleonAdd}>
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </SupplierLayout>
  );
};

export default Schedule;
