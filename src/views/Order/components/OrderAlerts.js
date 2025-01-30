import React, { useEffect, useState } from 'react';
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Slide } from '@chakra-ui/react';

const OrderAlerts = () => {
    const [newOrder, setNewOrder] = useState(null);

    useEffect(() => {
        // Simulate receiving a new order
        const interval = setInterval(() => {
            setNewOrder({ id: Math.random(), details: 'New order details' });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box mb={4}>
            {newOrder && (
                <Slide direction="bottom" in={true} style={{ zIndex: 10 }}>
                    <Alert status="info" variant="left-accent">
                        <AlertIcon />
                        <Box flex="1">
                            <AlertTitle>New Order Alert</AlertTitle>
                            <AlertDescription>{newOrder.details}</AlertDescription>
                        </Box>
                        <CloseButton position="absolute" right="8px" top="8px" onClick={() => setNewOrder(null)} />
                    </Alert>
                </Slide>
            )}
        </Box>
    );
};

export default OrderAlerts;
