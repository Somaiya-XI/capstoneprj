import React, {useEffect, useState} from "react";
import {FiTrash2} from "react-icons/fi";
import {CiEdit} from "react-icons/ci";
import {useNavigate, useParams} from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import {Card, Popconfirm, TimePicker} from "antd";
import {useUserContext, useCsrfContext} from "../../../../Contexts";
import { EditIcon, DeleteIcon } from '../../../../Components/Icons';
import axios from "axios";
import {API} from "../../../../backend";
import {toast} from "sonner";

const ScheduleCard = () => {
  const [dataForm, setFormData] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);

  const [editedData, setEditedData] = useState({day: "", time: ""});
  const {isOpen, onOpen, onClose} = useDisclosure();

  const {user} = useUserContext();
  const {csrf} = useCsrfContext();
  const {id} = useParams();
  const days = [
    {value: "sun", label: "Sunday"},
    {value: "mon", label: "Monday"},
    {value: "tue", label: "Tuesday"},
    {value: "wed", label: "Wednesday"},
    {value: "thu", label: "Thursday"},
    {value: "fri", label: "Friday"},
    {value: "sat", label: "Saturday"},
  ];

  const getFullWeekdayName = (abbreviation) => {
    const days = {
      sun: "Sunday",
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
    };
    return days[abbreviation.toLowerCase()] || abbreviation;
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API}schedule/view/${user.id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchSchedules();
  }, []);

  const onDeleteProduct = (key, selectedKey) => {
    const newData = {...dataForm};
    delete newData[key];
    setFormData(newData);

    axios
      .delete(`${API}schedule/delete/`, {
        data: {id: key},
        headers: {
          "X-CSRFToken": csrf,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
    fetchSchedules();
  };

  const handleEdit = (key) => {
    setSelectedKey(key);
    setEditedData(dataForm[key]);
    onOpen();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`${API}schedule/update/`, editedData, {
        headers: {
          "X-CSRFToken": csrf,
        },
        withCredentials: true,
      });
      console.log(response.data);
      toast.success(response.data.message);
      onClose();
    } catch (error) {
      console.log("Error!!:", error.message);
      if (error.response) {
        console.log("Server Response Data:", error.response.data);
      }
    }
    setEditedData({day: editedData.day, ...editedData});
    fetchSchedules();
  };

  return (
    <>
      <Table aria-label="Schedule table">
        <TableHeader>
          <TableColumn>Day</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {dataForm &&
            Object.keys(dataForm).map((key, index) => (
              <TableRow key={String(index)}>
                <TableCell>{getFullWeekdayName(dataForm[key].day)}</TableCell>
                <TableCell>{dataForm[key].time}</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-3">
                  <span
                      className='text-lg text-default-400 cursor-pointer active:opacity-50'
                      onClick={() => handleEdit(key)}
                    >
                      <EditIcon />
                    </span>

                    <Popconfirm
                      title="Sure to delete?"
                      onConfirm={() => onDeleteProduct(dataForm[key].id, selectedKey)}
                    >
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        <DeleteIcon />
                      </span>
                    </Popconfirm>

                    {/* <Tooltip content="Edit user"> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Schedule</ModalHeader>
            <ModalBody>
              <ModalBody>
                <Select
                  required
                  items={days}
                  autoFocus
                  label="Day"
                  placeholder="Select day"
                  variant="bordered"
                  value={editedData.day}
                  onChange={(selectedDay) =>
                    setEditedData({
                      ...editedData,
                      day: selectedDay.target.value,
                    })
                  }
                >
                  {(days) => <SelectItem key={days.value}>{days.label}</SelectItem>}
                </Select>

                <Input
                  required
                  label="Time"
                  placeholder="Enter your time"
                  type="time"
                  variant="bordered"
                  value={editedData.time}
                  onChange={(e) => setEditedData({...editedData, time: e.target.value})}
                />
              </ModalBody>
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
    </>
  );
};

export default ScheduleCard;
