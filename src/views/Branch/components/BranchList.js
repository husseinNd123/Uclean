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
  SimpleGrid,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import Card from "components/card/Card";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import CreateBranch from "./createBranch";
import { useTranslation } from "react-i18next";

export const BranchList = () => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [editableBranch, setEditableBranch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingBranch, setViewingBranch] = useState(null);
  const [showCreateBranchModal, setShowCreateBranchModal] = useState(false);
  const toast = useToast();
  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const initialBranches = [
    {
      id: 1,
      name: "Branch 1",
      city: "City 1",
      state: "State 1",
      phone_number: "1234567890",
      email: "branch1@example.com",
      delivery_fee: 5.0,
      clean_at_location: 10.0,
      free_delivery: true,
      minimum_order_amount: 50,
      uc_wallet: 1,
      uc_delivery: 1,
      postal_code: "12345",
      country: "Country 1",
      latitude: 12.34,
      longitude: 56.78,
      password: "password1",
      status: "open",
    },
    {
      id: 2,
      name: "Branch 2",
      city: "City 2",
      state: "State 2",
      phone_number: "0987654321",
      email: "branch2@example.com",
      delivery_fee: 7.0,
      clean_at_location: 12.0,
      free_delivery: false,
      minimum_order_amount: 70,
      uc_wallet: 0,
      uc_delivery: 0,
      postal_code: "54321",
      country: "Country 2",
      latitude: 21.43,
      longitude: 65.87,
      password: "password2",
      status: "closed",
    },
  ];

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/branches`);
        if (!response) {
          throw new Error("Failed to fetch branches");
        }
        const data = response;
        setBranches(data);
        setFilteredBranches(data);
        toast({
          title: "Branches fetched successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        setBranches(initialBranches);
        setFilteredBranches(initialBranches);
        toast({
          title: "An error occurred.",
          description: "Failed to fetch branches. Using initial data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchBranches();
  }, []);

  const handleDeleteBranch = async (branch) => {
    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/branches/${branch.id}`, "DELETE");
      if (!response) {
        throw new Error("Failed to delete branch");
      }
      setBranches((prevBranches) => prevBranches.filter((b) => b.id !== branch.id));
      setFilteredBranches((prevFilteredBranches) => prevFilteredBranches.filter((b) => b.id !== branch.id));
      toast({
        title: "Branch deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description:  "Failed to delete branch.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditBranch = (branch) => {
    setEditableBranch(branch);
  };

  const handleSaveBranch = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/branches/${editableBranch.id}`, "PUT", editableBranch);
      if (!response) {
        throw new Error("Failed to update branch");
      }
      setBranches((prevBranches) => prevBranches.map((b) => (b.id === editableBranch.id ? editableBranch : b)));
      setFilteredBranches((prevFilteredBranches) => prevFilteredBranches.map((b) => (b.id === editableBranch.id ? editableBranch : b)));
      setEditableBranch(null);
      toast({
        title: "Branch updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description:  "Failed to update branch.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBranch = (branch) => {
    localStorage.setItem("BranchId", branch.id);
    setViewingBranch(branch);
    setTimeout(() => {
      setViewingBranch(null);
    }, 2000);
  };

  const handleCloseViewingModal = () => {
    setViewingBranch(null);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = branches.filter((branch) => branch.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredBranches(filtered);
  };

  return (
    <Card direction="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px={{ base: "10px", md: "25px" }} justify="space-between" mb="20px" align="center" flexWrap="wrap">
        <Flex align="center">
          <Text color="gray.800" fontSize={{ base: "18px", md: "22px" }} fontWeight="700" lineHeight="100%" mb={{ base: "10px", md: "0" }}>
            {t("Branch List")}
          </Text>
          <Button 
            onClick={() => setShowCreateBranchModal(true)}
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
        <Input placeholder={t("Search branch...")} value={searchQuery} onChange={handleSearch} size="sm" w={{ base: "100%", md: "200px" }} />
      </Flex>
      <Box overflowY="auto" maxHeight={{ base: "300px", md: "400px" }} px={{ base: "10px", md: "20px" }}>
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead>
            <Tr bg="blue.500" textColor="white">
              <Th textColor="white">{t("Index")}</Th>
              <Th textColor="white">{t("Name")}</Th>
              <Th textColor="white">{t("City")}</Th>
              <Th textColor="white">{t("State")}</Th>
              <Th textColor="white">{t("Phone")}</Th>
              <Th textColor="white">{t("Email")}</Th>
              <Th textColor="white">{t("Actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredBranches.map((branch, index) => (
              <Tr key={branch.id}>
                <Td>{index + 1}</Td>
                <Td>{branch.name}</Td>
                <Td>{branch.city}</Td>
                <Td>{branch.state}</Td>
                <Td>{branch.phone_number}</Td>
                <Td>{branch.email}</Td>
                <Td>
                  <Flex>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleEditBranch(branch)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                      _active={{ bg: "blue.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      ml={2}
                      onClick={() => handleDeleteBranch(branch)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                      _active={{ bg: "red.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <MdDelete />
                    </Button>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      ml={2}
                      onClick={() => handleViewBranch(branch)}
                      borderRadius="full"
                      boxShadow="md"
                      _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
                      _active={{ bg: "teal.700", transform: "scale(0.95)" }}
                      transition="all 0.2s"
                    >
                      <IoMdEye />
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>  
      {editableBranch && (
        <Modal isOpen={true} onClose={() => setEditableBranch(null)} size={modalSize}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text color={textColor} fontSize="2xl"  fontWeight="700" mb="20px">
                {t("Branch Info")}
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Name")}
                  </Text>
                  <Input value={editableBranch.name} onChange={(e) => setEditableBranch({ ...editableBranch, name: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("City")}
                  </Text>
                  <Input value={editableBranch.city} onChange={(e) => setEditableBranch({ ...editableBranch, city: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("State")}
                  </Text>
                  <Input value={editableBranch.state} onChange={(e) => setEditableBranch({ ...editableBranch, state: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Phone")}
                  </Text>
                  <Input value={editableBranch.phone_number} onChange={(e) => setEditableBranch({ ...editableBranch, phone_number: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Email")}
                  </Text>
                  <Input value={editableBranch.email} onChange={(e) => setEditableBranch({ ...editableBranch, email: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Delivery Fee")}
                  </Text>
                  <Input value={editableBranch.delivery_fee} onChange={(e) => setEditableBranch({ ...editableBranch, delivery_fee: parseFloat(e.target.value) })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Clean at Location Fee")}
                  </Text>
                  <Input value={editableBranch.clean_at_location} onChange={(e) => setEditableBranch({ ...editableBranch, clean_at_location: parseFloat(e.target.value) })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Free Delivery")}
                  </Text>
                  <Select value={editableBranch.free_delivery} onChange={(e) => setEditableBranch({ ...editableBranch, free_delivery: e.target.value === "true" })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Minimum Order Amount")}
                  </Text>
                  <Input value={editableBranch.minimum_order_amount} onChange={(e) => setEditableBranch({ ...editableBranch, minimum_order_amount: parseInt(e.target.value) })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("UC Wallet")}
                  </Text>
                  <Select value={editableBranch.uc_wallet} onChange={(e) => setEditableBranch({ ...editableBranch, uc_wallet: parseInt(e.target.value) })}>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("UC Delivery")}
                  </Text>
                  <Select value={editableBranch.uc_delivery} onChange={(e) => setEditableBranch({ ...editableBranch, uc_delivery: parseInt(e.target.value) })}>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Postal Code")}
                  </Text>
                  <Input value={editableBranch.postal_code} onChange={(e) => setEditableBranch({ ...editableBranch, postal_code: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Country")}
                  </Text>
                  <Input value={editableBranch.country} onChange={(e) => setEditableBranch({ ...editableBranch, country: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Latitude")}
                  </Text>
                  <Input value={editableBranch.latitude} onChange={(e) => setEditableBranch({ ...editableBranch, latitude: parseFloat(e.target.value) })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Longitude")}
                  </Text>
                  <Input value={editableBranch.longitude} onChange={(e) => setEditableBranch({ ...editableBranch, longitude: parseFloat(e.target.value) })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Password")}
                  </Text>
                  <Input value={editableBranch.password} onChange={(e) => setEditableBranch({ ...editableBranch, password: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb="2">
                    {t("Status")}
                  </Text>
                  <Select value={editableBranch.status} onChange={(e) => setEditableBranch({ ...editableBranch, status: e.target.value })}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </Select>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSaveBranch} isLoading={isSubmitting}>
                {t("Save")}
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => setEditableBranch(null)}>
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {viewingBranch && (
        <Modal isOpen={true} onClose={handleCloseViewingModal} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("Viewing Branch")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{t("You are now viewing as")} {viewingBranch.name}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      <Modal isOpen={showCreateBranchModal} onClose={() => setShowCreateBranchModal(false)} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color={textColor} fontSize="2xl"  fontWeight="700" >
            {t("Create Branch")}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateBranch />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};
export default BranchList;
