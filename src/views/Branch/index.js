import React from "react";
import { Container } from "@chakra-ui/react";
import Listbranch from "./components/BranchList";

export default function Branch() {

    return (
        <Container maxW="xxl" mt={100} p={{ base: 4, md: 8 }}>
            <Listbranch />
        </Container>
    );
}
