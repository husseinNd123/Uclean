import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Text, Flex, Input, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast, SimpleGrid, Select } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import Card from 'components/card/Card';
import { IoMdEye } from 'react-icons/io';
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from "react-i18next";

// Sample data
const sampleOrders = [
    { id: 1, details: 'Order details 1', date: '2023-10-01', status: 'Pending', total_price: 100, pet_id: '1', company_id: 'C1', client_id: 'CL1', delivery_id: 'D1', appointment_time: '10:00 AM', interaction_type: 'Online', service_category: 'Cleaning', with_equipment: true, start_time: '10:00 AM', end_time: '12:00 PM' },
    { id: 2, details: 'Order details 2', date: '2023-10-02', status: 'Completed', total_price: 200, car_id: '2', company_id: 'C2', client_id: 'CL2', delivery_id: 'D2', appointment_time: '11:00 AM', interaction_type: 'Offline', service_category: 'Maintenance', with_equipment: false, start_time: '11:00 AM', end_time: '01:00 PM' },
    { id: 3, details: 'Order details 3', date: '2023-10-03', status: 'Rejected', total_price: 150, company_id: 'C3', client_id: 'CL3', delivery_id: 'D3', appointment_time: '12:00 PM', interaction_type: 'Online', service_category: 'house', cleaner_count: 2, cleaning_hours: 1, with_equipment: true, start_time: '12:00 PM', end_time: '02:00 PM' },
    { id: 4, details: 'Order details 4', date: '2023-10-04', status: 'Pending', total_price: 250, laundry_id: '4', company_id: 'C4', client_id: 'CL4', delivery_id: 'D4', appointment_time: '01:00 PM', interaction_type: 'Offline', service_category: 'laundry', item_name: 'Shirt', quantity: 5, price: 50 },
];

const sampleItems = [
    { id: '1', name: 'Cat', size: 'small', photo: '/images/buddy.jpg' },
    { id: '2', name: 'Dog', size: 'big', photo: '/images/mittens.jpg' },
    { id: '3', name: 'Car', size: 'medium', photo: '/images/charlie.jpg' },
    { id: '4', name: 'Shirt', size: 'small', photo: '/images/shirt.jpg' },
];

const sampleDeliveries = [
    { id: 'D1', name: 'Delivery 1' },
    { id: 'D2', name: 'Delivery 2' },
    { id: 'D3', name: 'Delivery 3' },
    { id: 'D4', name: 'Delivery 4' },
];

const OrderTable = ({ orders = sampleOrders, onOrderClick, onAcceptOrder, onRejectOrder }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [editableOrder, setEditableOrder] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [items, setItems] = useState(sampleItems);
    const [deliveries, setDeliveries] = useState(sampleDeliveries);
    const [serviceCategories, setServiceCategories] = useState([]);
    const toast = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const branchId = localStorage.getItem('branchId');
                const response = await fetch(`/api/items?branchId=${branchId}`); // Adjust the API endpoint as needed
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };

        const fetchDeliveries = async () => {
            try {
                const response = await fetch('/api/deliveries'); // Adjust the API endpoint as needed
                const data = await response.json();
                setDeliveries(data);
            } catch (error) {
                console.error('Failed to fetch deliveries:', error);
            }
        };

        const fetchServiceCategories = async () => {
            try {
                const response = await fetch('/api/service-categories'); // Adjust the API endpoint as needed
                const data = await response.json();
                setServiceCategories(data);
            } catch (error) {
                console.error('Failed to fetch service categories:', error);
            }
        };

        fetchItems();
        fetchDeliveries();
        fetchServiceCategories();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = orders.filter((order) =>
            order.id.toString().includes(query) ||
            order.status.toLowerCase().includes(query.toLowerCase()) ||
            order.total_price.toString().includes(query) ||
            order.details?.toLowerCase().includes(query.toLowerCase()) ||
            order.date?.includes(query)
        );
        setFilteredOrders(filtered);
    };

    const handleEditOrder = (order) => {
        setEditableOrder(order);
    };

    const handleSaveOrder = async () => {
        try {
            setIsSubmitting(true);
            // Simulate API call to save order
            setTimeout(() => {
                setFilteredOrders((prevOrders) => prevOrders.map((o) => (o.id === editableOrder.id ? editableOrder : o)));
                setEditableOrder(null);
                toast({
                    title: "Order updated successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setIsSubmitting(false);
            }, 1000);
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: "Failed to update order.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsSubmitting(false);
        }
    };

    return (
        <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: "scroll", lg: "hidden" }}
            boxShadow="lg"
            borderRadius="md"
            bg="white"
        >
            <Flex px="25px" justify="space-between" mb="20px" align="center" bg="gray.100" py="10px" borderRadius="md">
                <Text color="black" fontSize="22px" fontWeight="700" lineHeight="100%">
                    {t("Orders")}
                </Text>
                <Input
                    placeholder={t("Search orders")}
                    value={searchQuery}
                    onChange={handleSearch}
                    size="sm"
                    w="200px"
                    borderRadius="md"
                    bg="white"
                />
            </Flex>
            <Box overflowY="auto" maxHeight="400px" border="1px" borderColor="gray.200" borderRadius="md">
                <Table variant="striped" colorScheme="gray" mb="24px">
                    <Thead>
                        <Tr bg="blue.500" textColor="white">
                            <Th textColor="white">{t("Order")}</Th>
                            <Th textColor="white">{t("Service")}</Th>
                            <Th textColor="white">{t("Details")}</Th>
                            <Th textColor="white">{t("Date")}</Th>
                            <Th textColor="white">{t("Status")}</Th>
                            <Th textColor="white">{t("Total Price")}</Th>
                            <Th textColor="white">{t("Actions")}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredOrders.map((order) => (
                            <Tr key={order.id}>
                                <Td>{order.id}</Td>
                                <Td>{order.service_category}</Td>
                                <Td>{order.details}</Td>
                                <Td>{order.date}</Td>
                                <Td>{order.status}</Td>
                                <Td>${order.total_price}</Td>
                                <Td>
                                    <Tooltip label="Edit Order" aria-label="Edit Order Tooltip">
                                        <Button colorScheme="blue" size="sm" ml={{ base: "0", md: "2" }} onClick={() => handleEditOrder(order)}>
                                            <MdEdit/>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip label="View Details" aria-label="View Details Tooltip">
                                        <Button colorScheme="teal" size="sm" ml={{ base: "0", md: "2" }} onClick={() => onOrderClick(order)}>
                                            <IoMdEye/>
                                        </Button>
                                    </Tooltip>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {editableOrder && (
                <Modal isOpen={true} onClose={() => setEditableOrder(null)} size="2xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{t("Edit Order")}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {editableOrder.client_id !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Client")}
                                        </Text>
                                        <Input isDisabled value={editableOrder.client_id} onChange={(e) => setEditableOrder({ ...editableOrder, client_id: e.target.value })} />
                                    </Box>
                                )}
                                {editableOrder.details !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Details")}
                                        </Text>
                                        <Input value={editableOrder.details} onChange={(e) => setEditableOrder({ ...editableOrder, details: e.target.value })} />
                                    </Box>
                                )}
                                {editableOrder.status !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Status")}
                                        </Text>
                                        <Select value={editableOrder.status} onChange={(e) => setEditableOrder({ ...editableOrder, status: e.target.value })}>
                                            <option value="Pending"> {t("Pending")}</option>
                                            <option value="Completed">{t("Completed")}</option>
                                            <option value="Rejected">{t("Accepted")}</option>
                                            <option value="Rejected">{t("Rejected")}</option>
                                        </Select>
                                    </Box>
                                )}
                                {editableOrder.date !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Date")}
                                        </Text>
                                        <Input type="date" value={editableOrder.date} onChange={(e) => setEditableOrder({ ...editableOrder, date: e.target.value })} />
                                    </Box>
                                )}
                                {editableOrder.total_price !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Total Price")}
                                        </Text>
                                        <Input type="number" value={editableOrder.total_price} onChange={(e) => setEditableOrder({ ...editableOrder, total_price: parseFloat(e.target.value) })} />
                                    </Box>
                                )}
                                <Box>
                                    <Text fontSize="sm" color="gray.500" mb="2">
                                        {t("Delivery")}
                                    </Text>
                                    <Select value={editableOrder.delivery_id} onChange={(e) => setEditableOrder({ ...editableOrder, delivery_id: e.target.value })}>
                                        {deliveries.map((delivery) => (
                                            <option key={delivery.id} value={delivery.id}>
                                                {delivery.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                                {editableOrder.appointment_time !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Appointment Time")}
                                        </Text>
                                        <Input
                                            type="time"
                                            value={editableOrder.appointment_time.slice(0, 5)} // Ensure the value is in HH:MM format
                                            onChange={(e) => setEditableOrder({ ...editableOrder, appointment_time: e.target.value })}
                                        />
                                    </Box>
                                )}
                                {editableOrder.interaction_type !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Interaction Type")}
                                        </Text>
                                        <Input value={editableOrder.interaction_type} onChange={(e) => setEditableOrder({ ...editableOrder, interaction_type: e.target.value })} />
                                    </Box>
                                )}
                                {editableOrder.cleaner_count !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Cleaner Count")}
                                        </Text>
                                        <Input type="number" value={editableOrder.cleaner_count} onChange={(e) => setEditableOrder({ ...editableOrder, cleaner_count: parseInt(e.target.value) })} />
                                    </Box>
                                )}
                                {editableOrder.cleaning_hours !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Cleaning Hours")}
                                        </Text>
                                        <Input type="number" value={editableOrder.cleaner_count} onChange={(e) => setEditableOrder({ ...editableOrder, cleaner_count: parseInt(e.target.value) })} />
                                    </Box>
                                )}
                                {editableOrder.with_equipment !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("With Equipment")}
                                        </Text>
                                        <Select isDisabled value={editableOrder.with_equipment} onChange={(e) => setEditableOrder({ ...editableOrder, with_equipment: e.target.value === 'true' })}>
                                            <option value="true">{t("Yes")}</option>
                                            <option value="false">{t("No")}</option>
                                        </Select>
                                    </Box>
                                )}
                                {editableOrder.start_time !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Start Time")}
                                        </Text>
                                        <Input type='time' value={editableOrder.start_time} onChange={(e) => setEditableOrder({ ...editableOrder, start_time: e.target.value })} />
                                    </Box>
                                )}
                                {editableOrder.end_time !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("End Time")}
                                        </Text>
                                        <Input value={editableOrder.end_time} type='time' onChange={(e) => setEditableOrder({ ...editableOrder, end_time: e.target.value })} />
                                    </Box>
                                )}
                                {editableOrder.pet_id !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Pet")}
                                        </Text>
                                        <Menu>
                                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="white">
                                                {items.find(item => item.id === editableOrder.item_id)?.name || 'Select Pet'}
                                            </MenuButton>
                                            <MenuList>
                                                {items.map((item) => (
                                                    <MenuItem key={item.id} onClick={() => setEditableOrder({ ...editableOrder, item_id: item.id })}>
                                                        <Avatar size="sm" src={item.photo} mr="12px" />
                                                        {item.name} - {item.size}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                )}
                                {editableOrder.car_id !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Car")}
                                        </Text>
                                        <Menu>
                                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="white">
                                                {items.find(item => item.id === editableOrder.id)?.model || 'Select Car'}
                                            </MenuButton>
                                            <MenuList>
                                                {items.map((item) => (
                                                    <MenuItem key={item.id} onClick={() => setEditableOrder({ ...editableOrder, car_id: item.id })}>
                                                        <Avatar size="sm" src={item.photo} mr="12px" />
                                                        {item.name} - {item.size}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                )}
                                {editableOrder.service_category !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Service")}
                                        </Text>
                                        <Select value={editableOrder.service_category} onChange={(e) => setEditableOrder({ ...editableOrder, service_category: e.target.value })}>
                                            {serviceCategories.map((service) => (
                                                <option key={service.id} value={service.name}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </Box>
                                )}
                                {editableOrder.item_id !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Item")}
                                        </Text>
                                        <Menu>
                                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="white">
                                                {items.find(item => item.id === editableOrder.id)?.model || 'Select Item'}
                                            </MenuButton>
                                            <MenuList>
                                                {items.map((item) => (
                                                    <MenuItem key={item.id} onClick={() => setEditableOrder({ ...editableOrder, item_id: item.id })}>
                                                        <Avatar size="sm" src={item.photo} mr="12px" />
                                                        {item.name} - {item.size}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                )}
                                {editableOrder.quantity !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Quantity")}
                                        </Text>
                                        <Input type="number" value={editableOrder.quantity} onChange={(e) => setEditableOrder({ ...editableOrder, quantity: parseInt(e.target.value) })} />
                                    </Box>
                                )}
                                {editableOrder.price !== undefined && (
                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {t("Price")}
                                        </Text>
                                        <Input type="number" value={editableOrder.price} onChange={(e) => setEditableOrder({ ...editableOrder, price: parseFloat(e.target.value) })} />
                                    </Box>
                                )}
                            </SimpleGrid>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleSaveOrder} isLoading={isSubmitting}>
                                {t("Save")}
                            </Button>
                            <Button colorScheme="red" ml={3} onClick={() => setEditableOrder(null)}>
                                {t("Cancel")}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Card>
    );
};

export default OrderTable;
