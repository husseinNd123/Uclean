import React from "react";
import { Container } from "@chakra-ui/react";
import DeliveryList from "./components/DeliveryList";

export default function Delivery() {
    return (
        <Container maxW="xxl" mt={100} p={{ base: 4, md: 8 }}>
            <DeliveryList />
        </Container>
    );
}
