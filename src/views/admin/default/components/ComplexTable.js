import {
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo, useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Card from "components/card/Card";
import { useTranslation } from "react-i18next";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ColumnsTable() {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([
    {
      BRANCH: "New York",
      TRANSACTIONS: 120,
      ORDERS: 45,
      STATUS: true,
    },
    {
      BRANCH: "Los Angeles",
      TRANSACTIONS: 80,
      ORDERS: 0,
      STATUS: false,
    },
    {
      BRANCH: "Chicago",
      TRANSACTIONS: 100,
      ORDERS: 50,
      STATUS: true,
    },
    {
      BRANCH: "Houston",
      TRANSACTIONS: 90,
      ORDERS: 40,
      STATUS: true,
    },
    {
      BRANCH: "Phoenix",
      TRANSACTIONS: 0,
      ORDERS: 0,
      STATUS: false,
    },
  ]);
  const [totalBranches, setTotalBranches] = useState(tableData.length); // New state variable for total branches

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch('/api/branches');
        const data = await response.json();
        setTableData(data);
        setTotalBranches(data.length); // Set total branches
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchBranches();
  }, []); // Remove tableData dependency to prevent infinite loop

  const chartData = useMemo(() => {
    return {
      labels: tableData.map(branch => `${branch.BRANCH} (${branch.STATUS ? t('Active') : t('Inactive')})`), // Show if the branch is active or not
      datasets: [
        {
          label: t('Transactions'),
          data: tableData.map(branch => branch.TRANSACTIONS),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: t('Orders'),
          data: tableData.map(branch => branch.ORDERS),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }
      ]
    };
  }, [tableData]);

    const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Card
      shadow="xl"
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}
      maxW='600px' // Make the size smaller
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='24px'
          fontWeight='bold'
          lineHeight='100%'>
          {t("Branches")} ({totalBranches}) {/* Display total branches */}
        </Text>
      </Flex>
      <Bar data={chartData} />
    </Card>
  );
}
