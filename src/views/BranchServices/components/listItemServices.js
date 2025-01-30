import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Input,
  Select,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdDone, MdCancel } from "react-icons/md";
import Card from "components/card/Card";
import fetchWithToken from "views/auth/signIn/axiosInstance"; // Adjust the path

const ListItemServices = ({ branchServiceId }) => {
  const [itemServices, setItemServices] = useState([
    {
      id: 1,
      branch_id: 1,
      branch_name: "Branch 1",
      item_name: "Service 1",
      item_description: "Description 1",
      current_price: 100,
      service_type_id: 1,
      service_type_name: "Type 1",
    },
    {
      id: 2,
      branch_id: 2,
      branch_name: "Branch 2",
      item_name: "Service 2",
      item_description: "Description 2",
      current_price: 200,
      service_type_id: 2,
      service_type_name: "Type 2",
    },
  ]);
  const [filteredItemServices, setFilteredItemServices] = useState(itemServices);
  const [error, setError] = useState("");
  const [editableItemService, setEditableItemService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updateUser, setUpdateUser] = useState(null);
  const [BranchID, setBranchID] = useState(null);
  const [branches, setBranches] = useState([
    { id: 1, name: "Branch 1" },
    { id: 2, name: "Branch 2" },
  ]);
  const [serviceTypes, setServiceTypes] = useState([
    { id: 1, name: "Type 1" },
    { id: 2, name: "Type 2" },
  ]);
  const [userRole, setUserRole] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("UserRole");
    const BranchID = localStorage.getItem("BranchID");
    if (accessToken) {
      const [header, payload, signature] = accessToken.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      const updateUser = decodedPayload.clientId;
      setUpdateUser(updateUser);
      setBranchID(BranchID);
      setUserRole(role);
    } else {
      console.error("Access token not found.");
    }
  }, []);

  useEffect(() => {
    const fetchItemServices = async () => {
      try {
        const url = userRole === "company admin"
          ? `${process.env.REACT_APP_API_URL}/api/item_services?branch_service_id=${branchServiceId}`
          : `${process.env.REACT_APP_API_URL}/api/item_services?branch_id=${BranchID}&branch_service_id=${branchServiceId}`;
        const data = await fetchWithToken(url);
        setItemServices(data);
        setFilteredItemServices(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (userRole && branchServiceId) {
      fetchItemServices();
    }
  }, [userRole, updateUser, branchServiceId]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/branches`
        );
        setBranches(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const data = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/service_types`
        );
        setServiceTypes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchServiceTypes();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/items`
        );
        setItems(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteItemService = async (itemServiceId) => {
    try {
      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/item_services/${itemServiceId}`,
        "DELETE"
      );
      setItemServices(
        itemServices.filter(
          (itemService) => itemService.id !== itemServiceId
        )
      );
      setFilteredItemServices(
        filteredItemServices.filter(
          (itemService) => itemService.id !== itemServiceId
        )
      );
    } catch (error) {
      console.error("Error deleting item service:", error);
      setError("Failed to delete item service");
    }
  };

  const handleEditItemService = (itemService) => {
    setEditableItemService(itemService);
  };

  const handleSaveItemService = async () => {
    try {
      const data = {
        id: editableItemService.id,
        branch_id: editableItemService.branch_id,
        item_name: editableItemService.item_name,
        item_description: editableItemService.item_description,
        current_price: editableItemService.current_price,
        service_type_id: editableItemService.service_type_id,
        updateUser: updateUser,
      };

      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/item_services/${editableItemService.id}`,
        "PUT",
        data
      );

      setItemServices((prevItemServices) =>
        prevItemServices.map((itemService) => {
          if (itemService.id === editableItemService.id) {
            return { ...editableItemService, ...itemService };
          }
          return itemService;
        })
      );

      setFilteredItemServices((prevFilteredItemServices) =>
        prevFilteredItemServices.map((itemService) => {
          if (itemService.id === editableItemService.id) {
            return { ...editableItemService, ...itemService };
          }
          return itemService;
        })
      );

      setEditableItemService(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating item service:", error);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = itemServices.filter((itemService) =>
      itemService.item_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItemServices(filtered);
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ base: "scroll", lg: "hidden" }}
      boxShadow="lg"
    >
      <Flex px={{ base: "10px", md: "25px" }} justify="space-between" mb="20px" align="center" flexWrap="wrap">
        <Text color="black" fontSize={{ base: "18px", md: "22px" }} fontWeight="700" lineHeight="100%">
          Item Services List
        </Text>
        {error && <Text color="red.500">{error}</Text>}
        <Input
          placeholder="Search item services..."
          value={searchQuery}
          onChange={handleSearch}
          size="sm"
          w={{ base: "100%", md: "200px" }}
          mt={{ base: 2, md: 0 }}
        />
      </Flex>
      <Box overflowY="auto" maxHeight="400px">
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead>
            <Tr bg="blue.500" textColor="white">
              <Th textColor="white">Index</Th>
              <Th textColor="white">Item</Th>
              <Th textColor="white">Service</Th>
              <Th textColor="white">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredItemServices.map((itemService, index) => (
              <Tr key={itemService.id}>
                <Td>{index + 1}</Td>
                {/* <Td>
                  {editableItemService && editableItemService.id === itemService.id ? (
                    <Select
                      value={editableItemService.branch_id}
                      onChange={(e) =>
                        setEditableItemService({
                          ...editableItemService,
                          branch_id: e.target.value,
                        })
                      }
                    >
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    itemService.branch_name
                  )}
                </Td> */}
                <Td>
                  {editableItemService && editableItemService.id === itemService.id ? (
                    <Select
                      value={editableItemService.item_id}
                      onChange={(e) =>
                        setEditableItemService({
                          ...editableItemService,
                          item_id: e.target.value,
                        })
                      }
                    >
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    itemService.item_name
                  )}
                </Td>
                <Td>
                  {editableItemService && editableItemService.id === itemService.id ? (
                    <Select
                      value={editableItemService.service_type_id}
                      onChange={(e) =>
                        setEditableItemService({
                          ...editableItemService,
                          service_type_id: e.target.value,
                        })
                      }
                    >
                      {serviceTypes.map((serviceType) => (
                        <option key={serviceType.id} value={serviceType.id}>
                          {serviceType.name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    itemService.service_type_name
                  )}
                </Td>
                <Td>
                  {editableItemService && editableItemService.id === itemService.id ? (
                    <Flex>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={handleSaveItemService}
                        borderRadius="full"
                        boxShadow="md"
                        _hover={{ bg: "green.600", transform: "scale(1.05)" }}
                        _active={{ bg: "green.700", transform: "scale(0.95)" }}
                      >
                        <MdDone />
                      </Button>
                      <Button
                        colorScheme="red"
                        ml={2}
                        size="sm"
                        onClick={() => setEditableItemService(null)}
                        borderRadius="full"
                        boxShadow="md"
                        _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                        _active={{ bg: "red.700", transform: "scale(0.95)" }}
                      >
                        <MdCancel />
                      </Button>
                    </Flex>
                  ) : (
                    <Flex>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEditItemService(itemService)}
                        borderRadius="full"
                        boxShadow="md"
                        _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                        _active={{ bg: "blue.700", transform: "scale(0.95)" }}
                      >
                        <MdEdit />
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        ml={2}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item service?"
                            )
                          ) {
                            handleDeleteItemService(itemService.id);
                          }
                        }}
                        borderRadius="full"
                        boxShadow="md"
                        _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                        _active={{ bg: "red.700", transform: "scale(0.95)" }}
                      >
                        <MdDelete />
                      </Button>
                    </Flex>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export default ListItemServices;
