/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import DailyOrders from "views/admin/default/components/DailyOrders";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdOutlineNaturePeople,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

export default function UserReports() {
  // Chakra Color Mode
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

  const totalClient = clientData.length;
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
          name='Total Clients'
          value={`${totalClient}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />}
            />
          }
          name='Total Orders'
          value={`${totalOrders}`}
        />
      </SimpleGrid>
      <Flex>
        <ComplexTable />
        <DailyOrders />
      </Flex>
    </Box>
  );
}
