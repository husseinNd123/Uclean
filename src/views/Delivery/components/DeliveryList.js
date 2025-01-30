import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  useColorModeValue,
  useBreakpointValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdAdd, MdRemove, MdOutlineSchedule } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import Card from "components/card/Card";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import CreateDelivery from "./createDelivery";
import countryList from 'country-list';
import { useTranslation } from "react-i18next";
import Scheduler from "./Scheduler";

export const DeliveryList = () => {
  const { t } = useTranslation();
  const [deliveryes, setDeliveryes] = useState([]);
  const [filteredDeliveryes, setFilteredDeliveryes] = useState([]);
  const [editableDelivery, setEditableDelivery] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingDelivery, setViewingDelivery] = useState(null);
  const [showCreateDeliveryModal, setShowCreateDeliveryModal] = useState(false);
  const [schedulerDeliveryID, setSchedulerDeliveryID] = useState(null);
  const toast = useToast();
  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const initialDeliveryes = [
    {
      id: 1,
      company_id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      delivery_address: "123 Main St",
      delivery_city: "City 1",
      delivery_state: "State 1",
      delivery_country: "Country 1",
      contact_number: "1234567890",
      delivery_email: "delivery.john@example.com",
      delivery_status: "pending",
    },
    {
      id: 2,
      company_id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone_number: "0987654321",
      delivery_address: "456 Elm St",
      delivery_city: "City 2",
      delivery_state: "State 2",
      delivery_country: "Country 2",
      contact_number: "0987654321",
      delivery_email: "delivery.jane@example.com",
      delivery_status: "completed",
    },
  ];

  const countryOptions = countryList.getNames();

  useEffect(() => {
    const fetchDeliveryes = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/deliveryes`);
        if (!response) {
          throw new Error("Failed to fetch deliveryes");
        }
        const data = response;
        setDeliveryes(data);
        setFilteredDeliveryes(data);
        toast({
          title: "Deliveryes fetched successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        setDeliveryes(initialDeliveryes);
        setFilteredDeliveryes(initialDeliveryes);
        toast({
          title: "An error occurred.",
          description: "Failed to fetch deliveryes. Using initial data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchDeliveryes();
  }, []);

  const handleDeleteDelivery = async (delivery) => {
    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/deliveryes/${delivery.id}`, "DELETE");
      if (!response) {
        throw new Error("Failed to delete delivery");
      }
      setDeliveryes((prevDeliveryes) => prevDeliveryes.filter((b) => b.id !== delivery.id));
      setFilteredDeliveryes((prevFilteredDeliveryes) => prevFilteredDeliveryes.filter((b) => b.id !== delivery.id));
      toast({
        title: "Delivery deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description:  "Failed to delete delivery.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditDelivery = (delivery) => {
    setEditableDelivery(delivery);
  };

  const handleSaveDelivery = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/deliveryes/${editableDelivery.id}`, "PUT", editableDelivery);
      if (!response) {
        throw new Error("Failed to update delivery");
      }
      setDeliveryes((prevDeliveryes) => prevDeliveryes.map((b) => (b.id === editableDelivery.id ? editableDelivery : b)));
      setFilteredDeliveryes((prevFilteredDeliveryes) => prevFilteredDeliveryes.map((b) => (b.id === editableDelivery.id ? editableDelivery : b)));
      setEditableDelivery(null);
      toast({
        title: "Delivery updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description:  "Failed to update delivery.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDelivery = (delivery) => {
    setViewingDelivery(delivery);
  };

  const handleCloseViewingModal = () => {
    setViewingDelivery(null);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = deliveryes.filter((delivery) => delivery.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredDeliveryes(filtered);
  };

  return (
    <Card direction="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px={{ base: "10px", md: "25px" }} justify="space-between" mb="20px" align="center" flexWrap="wrap">
        <Flex align="center">
          <Text color="gray.800" fontSize={{ base: "18px", md: "22px" }} fontWeight="700" lineHeight="100%" mb={{ base: "10px", md: "0" }}>
            {t("Delivery List")}
          </Text>
          <Button 
            onClick={() => setShowCreateDeliveryModal(true)}
            mb={1}
            ml={4}
            colorScheme="green"
            borderRadius="full"
            boxShadow="sm"
            _hover={{ bg: "green.600", transform: "scale(1.05)" }}
            _active={{ bg: "green.700", transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            <MdAdd/>
          </Button>
        </Flex>
        <Input placeholder={t("Search delivery")} value={searchQuery} onChange={handleSearch} size="sm" w={{ base: "100%", md: "200px" }} />
      </Flex>
      <Box overflowY="auto" maxHeight={{ base: "300px", md: "400px" }} px={{ base: "10px", md: "20px" }}>
        <Table variant="simple" color="gray.600" mb="24px">
          <Thead>
            <Tr bg="blue.500" textColor="white">
              <Th textColor="white">{t("Index")}</Th>
              <Th textColor="white">{t("First Name")}</Th>
              <Th textColor="white">{t("Last Name")}</Th>
              <Th textColor="white">{t("Email")}</Th>
              <Th textColor="white">{t("Phone")}</Th>
              <Th textColor="white">{t("Address")}</Th>
              <Th textColor="white">{t("Status")}</Th>
              <Th textColor="white">{t("Actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredDeliveryes.map((delivery, index) => (
              <Tr key={delivery.id}>
                <Td>{index + 1}</Td>
                <Td>{delivery.first_name}</Td>
                <Td>{delivery.last_name}</Td>
                <Td>{delivery.email}</Td>
                <Td>{delivery.phone_number}</Td>
                <Td>{delivery.delivery_address}</Td>
                <Td>{delivery.delivery_status}</Td>
                <Td>
                  <Flex>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleEditDelivery(delivery)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                      _active={{ bg: "blue.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      ml={2}
                      onClick={() => handleDeleteDelivery(delivery)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                      _active={{ bg: "red.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <MdDelete />
                    </Button>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      ml={2}
                      onClick={() => handleViewDelivery(delivery)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
                      _active={{ bg: "teal.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <IoMdEye />
                    </Button>
                    <Button
                      colorScheme="purple"
                      size="sm"
                      ml={2}
                      onClick={() => setSchedulerDeliveryID(delivery.id)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "purple.600", transform: "scale(1.05)" }}
                      _active={{ bg: "purple.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <MdOutlineSchedule />
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {editableDelivery && (
        <Modal isOpen={true} onClose={() => setEditableDelivery(null)} size={modalSize}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text color={textColor} fontSize="2xl"  fontWeight="700" mb="20px">
                {t("Delivery Info")}
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("First Name")}
                  </Text>
                  <Input value={editableDelivery.first_name} onChange={(e) => setEditableDelivery({ ...editableDelivery, first_name: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("Last Name")}
                  </Text>
                  <Input value={editableDelivery.last_name} onChange={(e) => setEditableDelivery({ ...editableDelivery, last_name: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("Email")}
                  </Text>
                  <Input value={editableDelivery.email} onChange={(e) => setEditableDelivery({ ...editableDelivery, email: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("Phone Number")}
                  </Text>
                  <Input value={editableDelivery.phone_number} onChange={(e) => setEditableDelivery({ ...editableDelivery, phone_number: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("Address")}
                  </Text>
                  <Input value={editableDelivery.delivery_address} onChange={(e) => setEditableDelivery({ ...editableDelivery, delivery_address: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("City")}
                  </Text>
                  <Input value={editableDelivery.delivery_city} onChange={(e) => setEditableDelivery({ ...editableDelivery, delivery_city: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("State")}
                  </Text>
                  <Input value={editableDelivery.delivery_state} onChange={(e) => setEditableDelivery({ ...editableDelivery, delivery_state: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("Country")}
                  </Text>
                  <Select value={editableDelivery.delivery_country} onChange={(e) => setEditableDelivery({ ...editableDelivery, delivery_country: e.target.value })}>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb="2">
                    {t("Status")}
                  </Text>
                  <Select value={editableDelivery.delivery_status} onChange={(e) => setEditableDelivery({ ...editableDelivery, delivery_status: e.target.value })}>
                    <option value="pending">{t("Pending")}</option>
                    <option value="completed">{t("Completed")}</option>
                    <option value="cancelled">{t("Cancelled")}</option>
                  </Select>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSaveDelivery} isLoading={isSubmitting} borderRadius="full" boxShadow="md">
                {t("Save")}
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => setEditableDelivery(null)} borderRadius="full" boxShadow="md">
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Modal isOpen={showCreateDeliveryModal} onClose={() => setShowCreateDeliveryModal(false)} size={modalSize}>
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl" bg={useColorModeValue("white", "gray.800")}>
          <ModalHeader>
            <Text color={textColor} fontSize="2xl"  fontWeight="700" >
            {t("Create Delivery")}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateDelivery />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={schedulerDeliveryID !== null} onClose={() => setSchedulerDeliveryID(null)} size={"4xl"}>
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="xl" bg={useColorModeValue("white", "gray.800")}>
        <ModalHeader>
          <Text color={textColor} fontSize="2xl" fontWeight="700">
            {t("Schedule Delivery")}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {schedulerDeliveryID && <Scheduler deliveryID={schedulerDeliveryID} />}
        </ModalBody>
      </ModalContent>
    </Modal>

    </Card>
  );
};
export default DeliveryList;
