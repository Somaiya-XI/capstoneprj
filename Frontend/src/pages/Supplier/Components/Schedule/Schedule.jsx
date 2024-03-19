import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Schedule = () => {
    const [dataForm, setFormData] = useState({
        day: null,
        time: "",
        supplier_id: "",
    });
    const days = [
        { value: "sun", label: "Sunday" },
        { value: "mon", label: "Monday" },
        { value: "tue", label: "Tuesday" },
        { value: "wed", label: "Wednesday" },
        { value: "thu", label: "Thursday" },
        { value: "fri", label: "Friday" },
        { value: "sat", label: "Saturday" },
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}schedule/`)
            .then((result) => {
                const productsWithKeys = result.data.map((schedule) => ({
                    ...schedule,
                    key: schedule.supplier_id,
                }));
                setFormData(productsWithKeys);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleOpen = () => {
        onOpen();
    };

    const handleClose = () => {
        onClose();
    };

    const handleonAdd = (event) => {
        event.preventDefault();
        if (!dataForm.day) {
            console.log("Day is required.");
            return;
        }
        axios
            .post(`${import.meta.env.VITE_API_URL}schedule/create/`, dataForm)
            .then((res) => {
                console.log(res.data);
                onClose();
                window.location.reload();
            })
            .catch((err) => {
                console.log("Error:", err);
                if (err.response) {
                    console.log("Server Response Data:", err.response.data);
                }
            });
    };
    


    return (
        <SupplierLayout>
            <div className="SupplierDashboard">
                <div className="DashboardContent">
                    <h3 className="HeaderTitle">Supply Schedule</h3>
                    {/* Update onClick handler to open modal */}
                    <Button className="AddButton" type="primary" onClick={handleOpen}>
                        + Add
                    </Button>
                </div>
                <div
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
                        <ModalHeader className="flex flex-col gap-1">
                            Add Schedule
                        </ModalHeader>
                        <ModalBody>
                            <Select
                                items={days}
                                autoFocus
                                label="Day"
                                placeholder="Select day"
                                variant="bordered"
                                value={dataForm.day}
                                onChange={(selectedDay) => {
                                    setFormData({ ...dataForm, day: selectedDay.target.value }); 
                                }}
                            >
                                {(days) => (
                                    <SelectItem key={days.value}>{days.label}</SelectItem>
                                )}
                            </Select>


                            <Input
                                label="Time"
                                placeholder="Enter your time"
                                type="time"
                                variant="bordered"
                                value={dataForm.time}
                                onChange={(e) =>
                                    setFormData({ ...dataForm, time: e.target.value })
                                }
                            />

                            <Input
                                label="Supplier ID"
                                placeholder="Enter supplier ID"
                                type="number"
                                variant="bordered"
                                value={dataForm.supplier_id}
                                onChange={(e) =>
                                    setFormData({ ...dataForm, supplier_id: e.target.value })
                                }
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
