import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Input,
  Flex,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  useColorModeValue,
  useBreakpointValue,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { MdEdit, MdDelete, MdDone, MdCancel, MdAdd } from "react-icons/md";
import Card from "components/card/Card";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import CreateUser from "views/admin/Users/components/CreateUser";
import { useTranslation } from "react-i18next";

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editableUser, setEditableUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [updateUser, setupdateUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const toggleCreateUserModal = () => {
    setShowCreateUserModal(!showCreateUserModal);
  };

  const handleEditUser = (user) => {
    const u = user;
    u.username = null;
    setEditableUser(u);
  };

  const handleSaveUser = async () => {
    try {
      const data = {
        userpass: editableUser.password,
        updateUser: updateUser,
        roleId: editableUser.roleId,
        userId: editableUser.userId,
      };

      if (
        editableUser.username !== null &&
        editableUser.username !== undefined
      ) {
        data.username = editableUser.username;
      }

      console.log("Sending data:", data);

      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/editUser`,
        "PUT",
        data
      );

      if (!response || !response.success) {
        throw new Error(response.message || "Failed to update user");
      }

      setEditableUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleEditFormClose = () => {
    window.location.reload();
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        "DELETE"
      );

      if (!response) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.filter((user) => user.userId !== userId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const [header, payload, signature] = accessToken.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      const updateUser = decodedPayload.clientId;
      setupdateUser(updateUser);
    } else {
      console.error("Access token not found.");
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseUsers = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/users`
        );
        const responseRoles = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/role`
        );

        if (responseUsers && responseRoles) {
          const usersData = responseUsers;
          const rolesData = responseRoles;

          const usersWithRoleNames = usersData.map((user) => {
            const role = rolesData.find((role) => role.roleId === user.roleId);
            return { ...user, roleName: role ? role.description : "" };
          });

          setUsers(usersWithRoleNames);
          setRoles(rolesData);
        } else {
          console.error("Error fetching users or roles");
        }
      } catch (error) {
        console.error("Error fetching users or roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filteredResults = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredResults);
  }, [searchTerm, users]);

  return (
    <Card
      mt={90}
      boxShadow="lg"
      p="6"
      borderRadius="md"
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Box
        px="25px"
        mb="20px"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
      >
        <Flex alignItems="center" mb={{ base: 4, md: 0 }}>
          <Text color="gray.800" fontSize={{ base: "18px", md: "22px" }} fontWeight="700" lineHeight="100%" mb={{ base: "10px", md: "0" }}>
            {t("Users List")}
          </Text>
          <Button
            onClick={toggleCreateUserModal}
            mb={1}
            ml={4}
            colorScheme="green"
            borderRadius="full"
            boxShadow="sm"
            _hover={{ bg: "green.600", transform: "scale(1.05)" }}
            _active={{ bg: "green.700", transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            <MdAdd/>
          </Button>
        </Flex>
        <Input
          placeholder={t("Search by username")}
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          w={{ base: "100%", md: "200px" }}
        />
      </Box>
      <Box overflowY="auto" maxHeight="400px">
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr bg="blue.500" textColor="white">
                <Th textColor="white">{t("Index")}</Th>
                <Th textColor="white">{t("Name")}</Th>
                <Th textColor="white">{t("Email")}</Th>
                <Th textColor="white">{t("Role")}</Th>
                <Th textColor="white">{t("Password")}</Th>
                <Th textColor="white">{t("Actions")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user, index) => (
                <Tr key={user.userId}>
                  <Td>{index + 1}</Td>
                  <Td>
                    {editableUser && editableUser.userId === user.userId ? (
                      <Input
                        value={editableUser.name}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            name: e.target.value,
                          })
                        }
                        size="sm"
                      />
                    ) : (
                      user.name
                    )}
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {editableUser && editableUser.userId === user.userId ? (
                      <Select
                        value={editableUser.roleId}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            roleId: e.target.value,
                          })
                        }
                        size="sm"
                      >
                        {roles.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.description}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      user.roleName
                    )}
                  </Td>
                  <Td>
                    {editableUser && editableUser.userId === user.userId ? (
                      <Input
                        type="password"
                        value={editableUser.password}
                        onChange={(e) =>
                          setEditableUser({
                            ...editableUser,
                            password: e.target.value,
                          })
                        }
                        size="sm"
                      />
                    ) : (
                      "********"
                    )}
                  </Td>
                  <Td>
                    {editableUser && editableUser.userId === user.userId ? (
                      <Flex>
                        <Button
                          leftIcon={<MdDone />}
                          colorScheme="green"
                          size="sm"
                          onClick={handleSaveUser}
                        >
                          {t("Save")}
                        </Button>
                        <Button
                          leftIcon={<MdCancel />}
                          colorScheme="red"
                          ml={2}
                          size="sm"
                          onClick={handleEditFormClose}
                        >
                          {t("Cancel")}
                        </Button>
                      </Flex>
                    ) : (
                      <Flex>
                        <Button
                          leftIcon={<MdEdit />}
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          {t("Edit")}
                        </Button>
                        <Button
                          leftIcon={<MdDelete />}
                          colorScheme="red"
                          size="sm"
                          ml={2}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?"
                              )
                            ) {
                              handleDeleteUser(user.userId);
                            }
                          }}
                        >
                          {t("Delete")}
                        </Button>
                      </Flex>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Modal isOpen={showCreateUserModal} onClose={toggleCreateUserModal} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color={textColor} fontSize="2xl" fontWeight="700">
              {t("Create User")}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateUser />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={toggleCreateUserModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default UsersList;
