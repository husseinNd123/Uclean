import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Stack,
    Box,
    Badge,
    Tooltip,
    SimpleGrid,
    Divider,
    useToast
} from '@chakra-ui/react';

const OrderDetailsModal = ({ isOpen, onClose, order, onAcceptOrder, onRejectOrder }) => {
    const toast = useToast();

    if (!order) {
        return null;
    }

    const handleAcceptOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${order.id}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                onAcceptOrder(order);
                toast({
                    title: "Order accepted.",
                    description: "The order has been successfully accepted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error('Failed to accept order');
                toast({
                    title: "Error",
                    description: "Failed to accept the order.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            toast({
                title: "Error",
                description: "An error occurred while accepting the order.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRejectOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${order.id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                onRejectOrder(order);
                toast({
                    title: "Order rejected.",
                    description: "The order has been successfully rejected.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error('Failed to reject order');
                toast({
                    title: "Error",
                    description: "Failed to reject the order.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error rejecting order:', error);
            toast({
                title: "Error",
                description: "An error occurred while rejecting the order.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal size='2xl' isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius="md" p={4}>
                <ModalHeader  color="black" borderRadius="md">Order Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <SimpleGrid columns={2} spacing={4}>
                                <Text><strong>Order ID:</strong> {order.id}</Text>
                                <Text><strong>Company ID:</strong> {order.company_id}</Text>
                                <Text><strong>Client ID:</strong> {order.client_id}</Text>
                                <Text><strong>Delivery ID:</strong> {order.delivery_id}</Text>
                                <Text><strong>Total Price:</strong> ${order.total_price}</Text>
                                <Text><strong>Appointment Time:</strong> {order.appointment_time}</Text>
                                <Text><strong>Status:</strong> {order.status}</Text>
                                {order.pet_id && <Text><strong>Pet ID:</strong> {order.pet_id}</Text>}
                                {order.car_id && <Text><strong>Car ID:</strong> {order.car_id}</Text>}
                                <Text><strong>Interaction Type:</strong> {order.interaction_type}</Text>
                                <Text><strong>Service Category:</strong> {order.service_category}</Text>
                                <Text><strong>Cleaner Count:</strong> {order.cleaner_count}</Text>
                                <Text><strong>With Equipment:</strong> {order.with_equipment ? 'Yes' : 'No'}</Text>
                                <Text><strong>Start Time:</strong> {order.start_time}</Text>
                                <Text><strong>End Time:</strong> {order.end_time}</Text>
                            </SimpleGrid>
                            <Divider my={4} />
                            <Badge colorScheme="green" p={1} borderRadius="md">{order.status}</Badge>
                        </Box>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Tooltip label="Accept this order" aria-label="Accept Order Tooltip">
                        <Button colorScheme="green" mr={3} onClick={handleAcceptOrder} borderRadius="md">
                            Accept
                        </Button>
                    </Tooltip>
                    <Tooltip label="Reject this order" aria-label="Reject Order Tooltip">
                        <Button colorScheme="red" mr={3} onClick={handleRejectOrder} borderRadius="md">
                            Reject
                        </Button>
                    </Tooltip>
                    <Tooltip label="Close this modal" aria-label="Close Modal Tooltip">
                        <Button colorScheme="blue" onClick={onClose} borderRadius="md">
                            Close
                        </Button>
                    </Tooltip>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default OrderDetailsModal;
