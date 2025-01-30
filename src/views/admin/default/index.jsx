// Chakra imports
import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdBarChart,
  MdOutlineNaturePeople,
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";


import fetchWithToken from "views/auth/signIn/axiosInstance";
import DailyOrders from "views/admin/default/components/DailyOrders";
// import BranchServices from "views/admin/default/components/BranchServices";
import { useTranslation } from "react-i18next";

export default function UserReports() {
  const { t } = useTranslation();
  const [clientData, setclientData] = useState([{ id: 1, name: "Default Client" }]);
  const [orderData, setOrderData] = useState([{ id: 1, amount: 100 }]);
  const brandColor = useColorModeValue("blue.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/orders`);
        if (!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response; // await .json();
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
  

    const fetchClients = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/clients`);
        if (!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response; // await .json();
        setclientData(data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchOrders();
    fetchClients();
  }, []);
    
  const totalClient=clientData.length;
  const totalOrders = orderData.length;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdOutlineNaturePeople} color={brandColor} />
              }
            />
            }        
        name={t('Total Clients')} 
        value={`${totalClient}` } />

        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />}
            />
          }
          name={t('Total Orders')}
          value={`${totalOrders}`}
        />
      </SimpleGrid>
      <Flex>
        <ComplexTable/> 
        <DailyOrders />
      </Flex>
      {/* <BranchServices /> */}
    </Box>
  );
}
