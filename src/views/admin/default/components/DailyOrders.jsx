import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Table, Thead, Tbody, Tr, Th, Td, useToast, useColorModeValue, Text } from "@chakra-ui/react";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";

const DailyOrders = () => {
  const [dailyOrders, setDailyOrders] = useState([
    { id: 1, item: "Sample Item 1", quantity: 2, Status: "Delivered" },
    { id: 2, item: "Sample Item 2", quantity: 1 , Status: "Pending"},
  ]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { t } = useTranslation();
  useEffect(() => {
    const fetchDailyOrders = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/orders/daily`);
        if (!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response; // await .json();
        setDailyOrders(data);
      } catch (error) {
        console.error("Error fetching daily orders:", error);
        toast({
          title: "Error",
          description: "There was an error fetching daily orders.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailyOrders();
  }, [toast]);

  return (
    <Box
      p={{ base: 4, md: 6 }}
      ml={{ base: 0, md: 6 }}
      shadow="2xl"
      borderWidth="1px"
      borderRadius="2xl"
      bg={useColorModeValue("gray.50", "gray.700")}
      width={{ base: "100%", md: "80%" }}
    >
      <Text
        color={textColor}
        fontSize='26px'
        fontWeight='bold'
        lineHeight='110%'
        mb={4}
      >
        {t('Daily Orders')}
      </Text>
      {loading ? (
        <Spinner size="xl" color="teal.500" />
      ) : (
        <Table variant="simple" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th>{t("Index")}</Th>
              <Th>{t("Item")}</Th>
              <Th>{t("Quantity")}</Th>
              <Th>{t("Status")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dailyOrders.length === 0 ? (
              <Tr>
                <Td colSpan="4" textAlign="center">{t("No orders available")}</Td>
              </Tr>
            ) : (
              dailyOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.item}</Td>
                  <Td>{order.quantity}</Td>
                  <Td>{order.Status}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default DailyOrders;
