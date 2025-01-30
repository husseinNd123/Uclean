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
import Card from "components/card/Card";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";
import CreateCompany from "./createCompany";
export const CompanyList = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [editableCompany, setEditableCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const toast = useToast();
  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const initialCompanies = [
    {
      id: 1,
      name: "Company 1",
      logo: "logo1.png",
      service_id: 101,
      service_name: "",
      manager_id: 1,
      uclean_commission: 10.0,
      is_active: true,
    },
    {
      id: 2,
      name: "Company 2",
      logo: "logo2.png",
      service_id: 102,
      manager_id: 2,
      uclean_commission: 12.5,
      is_active: false,
    },
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/companies`);
        if (!response) throw new Error("Failed to fetch companies");
        setCompanies(response);
        setFilteredCompanies(response);
        toast({
          title: "Companies fetched successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        setCompanies(initialCompanies);
        setFilteredCompanies(initialCompanies);
        toast({
          title: "Error fetching companies.",
          description: "Using initial data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCompanies();
  }, []);

  const handleDeleteCompany = async (company) => {
    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/companies/${company.id}`, "DELETE");
      if (!response) throw new Error("Failed to delete company");
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
      setFilteredCompanies((prev) => prev.filter((c) => c.id !== company.id));
      toast({
        title: "Company deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting company.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditCompany = (company) => {
    setEditableCompany(company);
  };

  const handleSaveCompany = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/companies/${editableCompany.id}`, "PUT", editableCompany);
      if (!response) throw new Error("Failed to update company");
      setCompanies((prev) =>
        prev.map((c) => (c.id === editableCompany.id ? editableCompany : c))
      );
      setFilteredCompanies((prev) =>
        prev.map((c) => (c.id === editableCompany.id ? editableCompany : c))
      );
      setEditableCompany(null);
      toast({
        title: "Company updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating company.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setFilteredCompanies(companies.filter((company) => company.name.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <Card direction="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
    <Flex px={{ base: "10px", md: "25px" }} justify="space-between" mb="20px" align="center" flexWrap="wrap">
            <Flex align="center">
            <Text color="gray.800" fontSize={{ base: "18px", md: "22px" }} fontWeight="700" lineHeight="100%" mb={{ base: "10px", md: "0" }}>
                {t("Company List")}
            </Text>
            <Button 
                onClick={() => setShowCreateCompanyModal(true)}
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
            <Input placeholder={t("Search company...")} value={searchQuery} onChange={handleSearch} size="sm" w={{ base: "100%", md: "200px" }} />
        </Flex>
        <Box overflowY="auto" maxHeight={{ base: "300px", md: "400px" }} px={{ base: "10px", md: "20px" }}>    
            <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
                <Tr bg="blue.500" textColor="white">
                <Th textColor="white">{t("Index")}</Th>
                <Th textColor="white">{t("Name")}</Th>
                <Th textColor="white">{t("Service")}</Th>
                <Th textColor="white">{t("Manager")}</Th>
                <Th textColor="white">{t("Commission")} %</Th>
                <Th textColor="white">{t("Active")}</Th>
                <Th textColor="white">{t("Actions")}</Th>
                </Tr>
            </Thead>
            <Tbody>
                {filteredCompanies.map((company, index) => (
                <Tr key={company.id}>
                    <Td>{index + 1}</Td>
                    <Td>{company.name}</Td>
                    <Td>{company.service_id}</Td>
                    <Td>{company.manager_id}</Td>
                    <Td>{company.uclean_commission}</Td>
                    <Td>{company.is_active ? "Yes" : "No"}</Td>
                    <Td>
                    <Flex>
                        <Button 
                            onClick={() => handleEditCompany(company)} 
                            colorScheme="blue"
                            size="sm"
                            borderRadius="full"
                            boxShadow="md"
                            _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                            _active={{ bg: "blue.700", transform: "scale(0.95)" }}
                            transition="all 0.2s"
                            >
                            <MdEdit />
                        </Button>
                        <Button onClick={() => handleDeleteCompany(company)}
                            colorScheme="red"
                            size="sm"
                            ml={2}
                            borderRadius="full"
                            boxShadow="md"
                            _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                            _active={{ bg: "red.700", transform: "scale(0.95)" }}
                            transition="all 0.2s"
                        >
                            <MdDelete />
                        </Button>
                    </Flex>
                    </Td>
                </Tr>
                ))}
            </Tbody>
            </Table>
        </Box>
        {editableCompany && (
        <Modal isOpen={true} onClose={() => setEditableCompany(null)} size={modalSize}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Edit Company</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <SimpleGrid columns={2} spacing={4}>
                <Box>
                    <Text>Name</Text>
                    <Input
                    value={editableCompany.name}
                    onChange={(e) =>
                        setEditableCompany({ ...editableCompany, name: e.target.value })
                    }
                    />
                </Box>
                <Box>
                    <Text>Service ID</Text>
                    <Input
                    value={editableCompany.service_id}
                    onChange={(e) =>
                        setEditableCompany({ ...editableCompany, service_id: e.target.value })
                    }
                    />
                </Box>
                <Box>
                    <Text>Manager ID</Text>
                    <Input
                    value={editableCompany.manager_id}
                    onChange={(e) =>
                        setEditableCompany({ ...editableCompany, manager_id: e.target.value })
                    }
                    />
                </Box>
                <Box>
                    <Text>Commission (%)</Text>
                    <Input
                    value={editableCompany.uclean_commission}
                    onChange={(e) =>
                        setEditableCompany({ ...editableCompany, uclean_commission: parseFloat(e.target.value) })
                    }
                    />
                </Box>
                <Box>
                    <Text>Active</Text>
                    <Input
                    value={editableCompany.is_active ? "Yes" : "No"}
                    readOnly
                    />
                </Box>
                </SimpleGrid>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSaveCompany} isLoading={isSubmitting} colorScheme="blue">
                Save
                </Button>
                <Button onClick={() => setEditableCompany(null)} colorScheme="red" ml={3}>
                Cancel
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        )}
        <Modal isOpen={showCreateCompanyModal} onClose={() => setShowCreateCompanyModal(false)} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color={textColor} fontSize="2xl"  fontWeight="700" >
            {t("Create Company")}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateCompany />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default CompanyList;
