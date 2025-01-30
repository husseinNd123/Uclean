import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import UsersList from "views/admin/Users/components/UsersList";

const Users = () => {

  return (
    <Flex direction="column" alignItems={"center"}>
      <Box width="80%">
        <UsersList />
      </Box>
    </Flex>
  );
};

export default Users;
