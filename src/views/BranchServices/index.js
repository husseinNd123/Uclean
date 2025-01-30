import React, { useState } from "react";
import { Container, Box, Button, Flex } from "@chakra-ui/react";

import ListBranchServices from "./components/listBranchServices";

export default function Branchservices() {
    const [showInsertForm, setShowInsertForm] = useState(false);
    const [showPackageForm, setShowPackageForm] = useState(false);

    return (
        <Container maxW="xxl" mt={100} p={{ base: 4, md: 8 }}>
            <Box>
                <ListBranchServices 
                    showInsertForm={showInsertForm} 
                    setShowInsertForm={setShowInsertForm} 
                    showPackageForm={showPackageForm} 
                    setShowPackageForm={setShowPackageForm} 
                />
            </Box>

        </Container>
    );
}
