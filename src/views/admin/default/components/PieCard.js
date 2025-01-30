// import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

import {
  Box,
  Flex,
  Text,
  // Select,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React, { useEffect, useState } from "react";
import fetchWithToken from "views/auth/signIn/axiosInstance";
export default function Conversion(props) {
  const { ...rest } = props;

  const [providerData, setProviderData] = useState([]);
  // const [chartData, setChartData] = useState([]);
  const totalProviders = providerData.length;
  const femalePercentage = totalProviders
    ? providerData.filter(
        (provider) => provider.Sex === "c6d7c072-da59-4af4-aceb-beb6b7973908"
      ).length
    : 0;

  const malePercentage = totalProviders
    ? providerData.filter(
        (provider) => provider.Sex === "956cd7f0-4c87-4ac0-a7b7-6afbda52f4f8"
      ).length
    : 0;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  // Fetch provider data from the API on component mount
  // useEffect(() => {
  //   const fetchProviderData = async () => {
  //     try {
  //       const response = await fetchWithToken(
  //         `${process.env.REACT_APP_API_URL}/api/provider`
  //       );
  //       if (!response) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = response; //await .json();
  //       setProviderData(data);
  //     } catch (error) {
  //       console.error("Error fetching provider data:", error);
  //     }
  //   };

  //   fetchProviderData();
  // }, []);

  const pieChartData = [
    (femalePercentage * 100) / totalProviders,
    (malePercentage * 100) / totalProviders,
  ];

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontWeight="600" mt="4px" fontSize="22px">
          Provider Chart
        </Text>
      </Flex>

      {totalProviders === 0 && <Text>Loading provider data...</Text>}
      {totalProviders > 0 ? (
        <>
          <Text>Chart Data Available</Text>
          <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
        </>
      ) : (
        <Text>Loading provider data delay...</Text>
      )}

      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        <Flex direction="column" py="5px" ml="130px">
          <Flex align="center">
            <Box h="8px" w="8px" bg=" #6AD2FF" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              Female Providers
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {`${femalePercentage}`}
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction="column" py="5px" me="10px">
          <Flex align="center">
            <Box h="8px" w="8px" bg="blue.500" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              Male Providers
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {`${malePercentage}`}
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
