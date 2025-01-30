import React, { useState } from 'react';
import OrderAlerts from './components/OrderAlerts';
import OrderTable from './components/OrderTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import { Box, useDisclosure } from '@chakra-ui/react';

function Order() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        onOpen();
    };

    return (
        <div className="Order">
            <Box mt={100}>
                <OrderAlerts />
                <OrderTable onOrderClick={handleOrderClick} />
                <OrderDetailsModal isOpen={isOpen} onClose={onClose} order={selectedOrder} />
            </Box>
        </div>
    );
}

export default Order;
