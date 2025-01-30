import React from "react";
import { Box, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const BranchServices = () => {
  const services = [
    { id: 1, name: "Service 1", description: "Description of Service 1" },
    { id: 2, name: "Service 2", description: "Description of Service 2" },
    { id: 3, name: "Service 3", description: "Description of Service 3" },
  ];

  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const hoverBg = useColorModeValue("secondaryGray.400", "whiteAlpha.200");
  const { t } = useTranslation();
  return (
    <Box mt="40px">
      <Text fontSize="2xl" mb="20px">Our Services</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px">
        {services.map((service) => (
          <Box
            key={service.id}
            p="20px"
            bg={boxBg}
            borderRadius="8px"
            boxShadow="md"
            transition="background-color 0.3s, transform 0.3s"
            _hover={{ bg: hoverBg, transform: "scale(1.05)" }}
          >
            <Text fontSize="xl" fontWeight="bold">{service.name}</Text>
            <Text mt="10px">{service.description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BranchServices;
