import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

const UnauthorizedPage = () => {
  const history = useHistory();

  const handleGoBack = () => {
    history.push('/auth'); // Redirect to the login or authentication page
  };

  return (
    <Box
      textAlign="center"
      mt="100px"
      p="20px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="8px"
      boxShadow="sm"
    >
      <Text fontSize="3xl" fontWeight="bold" mb="20px">
        403 - Unauthorized Access
      </Text>
      <Text mb="20px">
        Sorry, you do not have the necessary permissions to view this page.
      </Text>
    </Box>
  );
};

export default UnauthorizedPage;
