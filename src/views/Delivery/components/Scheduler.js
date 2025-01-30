import React, { useState, useEffect } from "react";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { 
  Box, Button, Input, FormControl, FormLabel, 
  Select, SimpleGrid, Stack, Table, Thead, Tbody, Tr, Th, Td, IconButton, 
  useBreakpointValue, VStack, Text, Flex 
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { EditIcon, CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";

const Scheduler = ({ deliveryID }) => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedSchedule, setEditedSchedule] = useState({});
  const [newSchedule, setNewSchedule] = useState({
    deliveryID: deliveryID,
    branch_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    is_open: "1",
    available_slots: "",
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Sample schedule data
  const sampleSchedules = [
    { id: 1, day_of_week: "Monday", start_time: "08:00", end_time: "12:00", available_slots: 5, is_open: "1" },
    { id: 2, day_of_week: "Wednesday", start_time: "14:00", end_time: "18:00", available_slots: 3, is_open: "1" },
    { id: 3, day_of_week: "Friday", start_time: "10:00", end_time: "16:00", available_slots: 7, is_open: "0" },
  ];

  // Fetch existing schedules for the delivery
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/schedules?deliveryID=${deliveryID}`, 
        "GET"
      );
      setSchedules(response && response.length > 0 ? response : sampleSchedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules(sampleSchedules);
    }
  };

  // Handle new schedule input change
  const handleNewScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new schedule
  const handleCreateSchedule = async () => {
    try {
      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/schedules`,
        "POST",
        newSchedule
      );
      alert("Schedule created successfully!");
      setNewSchedule({
        branch_id: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        is_open: "1",
        available_slots: "",
      });
      fetchSchedules();
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  // Handle editing a schedule
  const handleEditSchedule = (schedule) => {
    setIsEditing(schedule.id);
    setEditedSchedule({ ...schedule });
  };

  // Handle edited schedule input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving an updated schedule
  const handleSaveSchedule = async (id) => {
    try {
      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/schedules/${id}`,
        "PUT",
        editedSchedule
      );
      alert("Schedule updated successfully!");
      setIsEditing(null);
      fetchSchedules();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // Handle canceling an edit
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedSchedule({});
  };

  // Handle deleting a schedule
  const handleDeleteSchedule = async (id) => {
    try {
      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/schedules/${id}`,
        "DELETE"
      );
      alert("Schedule deleted successfully!");
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  // Responsive layout for mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4} w="full">
      {/* Add New Schedule Form */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
        <FormControl>
          <FormLabel>{t("Day of Week")}</FormLabel>
          <Select name="day_of_week" value={newSchedule.day_of_week} onChange={handleNewScheduleChange}>
            <option value="">{t("Select Day")}</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>{t("Start Time")}</FormLabel>
          <Input type="time" name="start_time" value={newSchedule.start_time} onChange={handleNewScheduleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("End Time")}</FormLabel>
          <Input type="time" name="end_time" value={newSchedule.end_time} onChange={handleNewScheduleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("Available Slots")}</FormLabel>
          <Input type="number" name="available_slots" value={newSchedule.available_slots} onChange={handleNewScheduleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("Status")}</FormLabel>
          <Select name="is_open" value={newSchedule.is_open} onChange={handleNewScheduleChange}>
            <option value="1">{t("Open")}</option>
            <option value="0">{t("Closed")}</option>
          </Select>
        </FormControl>
      </SimpleGrid>
      <Button mt={4} colorScheme="blue" w="full" onClick={handleCreateSchedule}>
        {t("Create Schedule")}
      </Button>

      {/* List of Existing Schedules */}
      <Box mt={8} w="full">
        {isMobile ? (
          // Mobile View - Display as Cards
          <Stack spacing={4}>
            {schedules.map((schedule) => (
              <Box key={schedule.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
                <VStack align="stretch" spacing={2}>
                    <Text fontWeight="bold">
                        {isEditing === schedule.id ? 
                            <Select name="day_of_week" value={editedSchedule.day_of_week} onChange={handleEditChange}>
                            {daysOfWeek.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                            </Select> 
                            : schedule.day_of_week
                        }
                    </Text>
                    <Text>{t("Time")}:
                        {isEditing === schedule.id ? 
                            <Input type="time" name="start_time" value={editedSchedule.start_time} onChange={handleEditChange} /> 
                            : schedule.start_time
                        }
                        -
                        {isEditing === schedule.id ? 
                            <Input type="time" name="end_time" value={editedSchedule.end_time} onChange={handleEditChange} /> 
                            : schedule.end_time
                        }
                    </Text>
                    <Text>{t("Slots")}: 
                        {isEditing === schedule.id ? 
                            <Input type="number" name="available_slots" value={editedSchedule.available_slots} onChange={handleEditChange} /> 
                            : schedule.available_slots
                        }
                    </Text>
                    <Text>{t("Status")}:
                        {isEditing === schedule.id ? (
                            <Select
                            name="is_open"
                            value={editedSchedule.is_open}
                            onChange={handleEditChange}
                            >
                            <option value="1">Open</option>
                            <option value="0">Closed</option>
                            </Select>
                        ) : (
                            schedule.is_open === "1" ? "Open" : "Closed"
                        )}
                    </Text>
                    <Flex justify="space-between">
                        {isEditing === schedule.id ? (
                        <>
                            <IconButton icon={<CheckIcon />} onClick={() => handleSaveSchedule(schedule.id)} colorScheme="green" />
                            <IconButton icon={<CloseIcon />} onClick={handleCancelEdit} colorScheme="red" />
                        </>
                        ) : (
                        <>
                            <IconButton icon={<EditIcon />} onClick={() => handleEditSchedule(schedule)} colorScheme="blue" />
                            <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteSchedule(schedule.id)} colorScheme="red" />
                        </>
                        )}
                    </Flex>
                </VStack>
              </Box>
            ))}
          </Stack>
        ) : (
          // Desktop View - Table Layout
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("Day")}</Th>
                  <Th>{t("Start Time")}</Th>
                  <Th>{t("End Time")}</Th>
                  <Th>{t("Slots")}</Th>
                  <Th>{t("Status")}</Th>
                  <Th>{t("Actions")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {schedules.map((schedule) => (
                  <Tr key={schedule.id}>
                  <Td>
                    {isEditing === schedule.id ? 
                        <Select name="day_of_week" value={editedSchedule.day_of_week} onChange={handleEditChange}>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                        </Select> 
                        : schedule.day_of_week
                    }
                    </Td>
                    <Td>
                    {isEditing === schedule.id ? 
                        <Input type="time" name="start_time" value={editedSchedule.start_time} onChange={handleEditChange} /> 
                        : schedule.start_time
                    }
                    </Td>
                    <Td>
                    {isEditing === schedule.id ? 
                        <Input type="time" name="end_time" value={editedSchedule.end_time} onChange={handleEditChange} /> 
                        : schedule.end_time
                    }
                    </Td>
                    <Td>
                    {isEditing === schedule.id ? 
                        <Input type="number" name="available_slots" value={editedSchedule.available_slots} onChange={handleEditChange} /> 
                        : schedule.available_slots
                    }
                    </Td>
                    <Td>
                    {isEditing === schedule.id ? (
                        <Select
                        name="is_open"
                        value={editedSchedule.is_open}
                        onChange={handleEditChange}
                        >
                        <option value="1">Open</option>
                        <option value="0">Closed</option>
                        </Select>
                    ) : (
                        schedule.is_open === "1" ? "Open" : "Closed"
                    )}
                    </Td>
                    <Td>
                      {isEditing === schedule.id ? (
                        <>
                          <IconButton icon={<CheckIcon />} onClick={() => handleSaveSchedule(schedule.id)} colorScheme="green" mr={2} />
                          <IconButton icon={<CloseIcon />} onClick={handleCancelEdit} colorScheme="red" />
                        </>
                      ) : (
                        <>
                          <IconButton icon={<EditIcon />} onClick={() => handleEditSchedule(schedule)} colorScheme="blue" mr={2} />
                          <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteSchedule(schedule.id)} colorScheme="red" />
                        </>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Scheduler;
