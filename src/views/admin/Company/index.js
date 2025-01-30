import React from "react";
import { Container } from "@chakra-ui/react";
import Listcompany from "./components/CompanyList";

export default function Company() {

    return (
        <Container maxW="xxl" mt={100} p={{ base: 4, md: 8 }}>
            <Listcompany />
        </Container>
    );
}
