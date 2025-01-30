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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { IoMdEye } from "react-icons/io";
import { MdDelete, MdEdit, MdDone, MdCancel, MdAdd, MdRemove } from "react-icons/md";
import Card from "components/card/Card";
import fetchWithToken from "views/auth/signIn/axiosInstance"; // Adjust the path
import Select from "react-select";
import InsertBranchServices from "../components/InsertBranchServices";
import ServicePackage from "../components/ServicePackage";
import InsertItemServices from "../components/InsertItemService";
import ListItemServices from "../components/listItemServices";
import { useTranslation } from "react-i18next";

const ListBranchServices = ({ showInsertForm, setShowInsertForm, showPackageForm, setShowPackageForm }) => {
  const { t } = useTranslation();
  const [branchServices, setBranchServices] = useState([
    {
      id: 1,
      branch_id: 1,
      branch_name: "Branch 1",
      service_name: "Service 1",
      service_description: "Description 1",
      current_price: 100,
      service_type_id: 1,
      service_type_name: "Type 1",
      type: "service",
    },
    {
      id: 2,
      branch_id: 2,
      branch_name: "Branch 2",
      service_name: "Service 2",
      service_description: "Description 2",
      current_price: 200,
      service_type_id: 2,
      service_type_name: "Type 2",
      type: "service",
    },
    {
      id: 3,
      package_name: "Package 1",
      package_description: "Package Description 1",
      package_price: 300,
      service_type_ids: [1, 2],
      type: "package",
    },
    {
      id: 4,
      branch_id: 3,
      branch_name: "Branch 3",
      service_name: "Service 3",
      service_description: "Description 3",
      current_price: 150,
      service_type_id: 3,
      service_type_name: "Type 3",
      type: "service",
    },
    {
      id: 5,
      branch_id: 4,
      branch_name: "Branch 4",
      service_name: "Service 4",
      service_description: "Description 4",
      current_price: 250,
      service_type_id: 4,
      service_type_name: "Type 4",
      type: "service",
    },
    {
      id: 6,
      package_name: "Package 2",
      package_description: "Package Description 2",
      package_price: 350,
      service_type_ids: [3, 4],
      type: "package",
    },
  ]);
  const [filteredBranchServices, setFilteredBranchServices] = useState(branchServices);
  const [error, setError] = useState("");
  const [editableBranchService, setEditableBranchService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updateUser, setUpdateUser] = useState("sampleUser");
  const [BranchID, setBranchID] = useState("sampleBranchID");
  const [branches, setBranches] = useState([
    { id: 1, name: "Branch 1" },
    { id: 2, name: "Branch 2" },
    { id: 3, name: "Branch 3" },
    { id: 4, name: "Branch 4" },
  ]);
  const [serviceTypes, setServiceTypes] = useState([
    { id: 1, name: "Type 1" },
    { id: 2, name: "Type 2" },
    { id: 3, name: "Type 3" },
    { id: 4, name: "Type 4" },
  ]);
  const [userRole, setUserRole] = useState("company admin");
  const [showItemForm, setShowItemForm] = useState(false);
  const [showInsertServiceForm, setShowInsertServiceForm] = useState(false);
  const [showServicePackageForm, setShowServicePackageForm] = useState(false);
  const [showListItemServicesModal, setShowListItemServicesModal] = useState(false);
  const [selectedBranchServiceId, setSelectedBranchServiceId] = useState(null);

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
    const fetchBranchServices = async () => {
      try {
        const url = userRole === "company admin"
          ? `${process.env.REACT_APP_API_URL}/api/branch_services`
          : `${process.env.REACT_APP_API_URL}/api/branch_services?branch_id=${BranchID}`;
        const data = await fetchWithToken(url);
        setBranchServices(data);
        setFilteredBranchServices(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (userRole) {
      fetchBranchServices();
    }
  }, [userRole, updateUser]);

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

  const handleDeleteBranchService = async (branchServiceId) => {
    try {
      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/branch_services/${branchServiceId}`,
        "DELETE"
      );
      setBranchServices(
        branchServices.filter(
          (branchService) => branchService.id !== branchServiceId
        )
      );
      setFilteredBranchServices(
        filteredBranchServices.filter(
          (branchService) => branchService.id !== branchServiceId
        )
      );
    } catch (error) {
      console.error("Error deleting branch service:", error);
      setError("Failed to delete branch service");
    }
  };

  const handleEditBranchService = (branchService) => {
    setEditableBranchService(branchService);
  };

  const handleSaveBranchService = async () => {
    try {
      const data = editableBranchService.type === "service" ? {
        id: editableBranchService.id,
        branch_id: editableBranchService.branch_id,
        service_name: editableBranchService.service_name,
        service_description: editableBranchService.service_description,
        current_price: editableBranchService.current_price,
        service_type_id: editableBranchService.service_type_id,
        updateUser: updateUser,
      } : {
        id: editableBranchService.id,
        package_name: editableBranchService.package_name,
        package_description: editableBranchService.package_description,
        package_price: editableBranchService.package_price,
        service_type_ids: editableBranchService.service_type_ids.map(option => option.value),
        updateUser: updateUser,
      };

      await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/branch_services/${editableBranchService.id}`,
        "PUT",
        data
      );

      setBranchServices((prevBranchServices) =>
        prevBranchServices.map((branchService) => {
          if (branchService.id === editableBranchService.id) {
            return { ...branchService, ...editableBranchService };
          }
          return branchService;
        })
      );

      setFilteredBranchServices((prevFilteredBranchServices) =>
        prevFilteredBranchServices.map((branchService) => {
          if (branchService.id === editableBranchService.id) {
            return { ...branchService, ...editableBranchService };
          }
          return branchService;
        })
      );

      setEditableBranchService(null);
    } catch (error) {
      console.error("Error updating branch service:", error);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = branchServices.filter((branchService) =>
      branchService.type === "service"
        ? branchService.service_name.toLowerCase().includes(query.toLowerCase())
        : branchService.package_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBranchServices(filtered);
  };

  const handleViewBranchService = (branchServiceId) => {
    setSelectedBranchServiceId(branchServiceId);
    setShowListItemServicesModal(true);
  };

  return (
    <>
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ base: "scroll", lg: "hidden" }}
        boxShadow="lg"
      >
        <Flex px={{ base: "10px", md: "25px" }} justify="space-between" mb="20px" align="center" flexWrap="wrap">
          <Flex align="center">
            <Text color="black" fontSize={{ base: "18px", md: "22px" }} fontWeight="700" lineHeight="100%">
              {t("Branch Services List")}
            </Text>
            <Button 
              onClick={() => setShowInsertServiceForm(!showInsertServiceForm)}
              ml={4}
              leftIcon={showInsertServiceForm ? <MdRemove /> : <MdAdd />}
              colorScheme={showInsertServiceForm ? "red" : "green"}
              p={4}
              borderRadius="full"
              boxShadow="md"
              _hover={{ bg: showInsertServiceForm ? "red.600" : "green.600", transform: "scale(1.05)" }}
              _active={{ bg: showInsertServiceForm ? "red.700" : "green.700", transform: "scale(0.95)" }}
              transition="all 0.2s"
            >
              {showInsertServiceForm ? t("Service") : t("Service")}
            </Button>
            <Button 
              onClick={() => setShowServicePackageForm(!showServicePackageForm)}
              ml={4}
              leftIcon={showServicePackageForm ? <MdRemove /> : <MdAdd />}
              colorScheme={showServicePackageForm ? "red" : "green"}
              p={4}
              borderRadius="full"
              boxShadow="md"
              _hover={{ bg: showServicePackageForm ? "red.600" : "green.600", transform: "scale(1.05)" }}
              _active={{ bg: showServicePackageForm ? "red.700" : "green.700", transform: "scale(0.95)" }}
              transition="all 0.2s"
            >
              {showServicePackageForm ? t("Package") : t("Package")}
            </Button>
            <Button 
            onClick={() => setShowItemForm(!showItemForm)}
            leftIcon={showItemForm ? <MdRemove /> : <MdAdd />}
            colorScheme={showItemForm ? "red" : "green"}
            p={4}
            ml={4}
            borderRadius="full"
            boxShadow="md"
            _hover={{ bg: showItemForm ? "red.600" : "green.600", transform: "scale(1.05)" }}
            _active={{ bg: showItemForm ? "red.700" : "green.700", transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            {showItemForm ? t("Item") : t("Item")}
          </Button>
          </Flex>
          {error && <Text color="red.500">{error}</Text>}
          <Input
            placeholder={t("Search branch services")}
            value={searchQuery}
            onChange={handleSearch}
            size="sm"
            w={{ base: "100%", md: "200px" }}
            mt={{ base: 2, md: 0 }}
          />
        </Flex>
        <Modal isOpen={showInsertServiceForm} onClose={() => setShowInsertServiceForm(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("Insert Branch Service")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InsertBranchServices />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setShowInsertServiceForm(false)}>
                {t("Close")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={showServicePackageForm} onClose={() => setShowServicePackageForm(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("Insert Service Package")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ServicePackage />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setShowServicePackageForm(false)}>
                {t("Close")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={showItemForm} onClose={() => setShowItemForm(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("Insert Item Service")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InsertItemServices />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setShowItemForm(false)}>
                {t("Close")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal size={"5xl"} isOpen={showListItemServicesModal} onClose={() => setShowListItemServicesModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("List Item Services")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ListItemServices branchServiceId={selectedBranchServiceId} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setShowListItemServicesModal(false)}>
                {t("Close")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box overflowY="auto" maxHeight="400px">
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr bg="blue.500" textColor="white">
                <Th textColor="white">{t("Index")}</Th>
                {userRole === "company admin" && <Th textColor="white">{t("Branch")}</Th>}
                <Th textColor="white">{t("Name")}</Th>
                <Th textColor="white">{t("Description")}</Th>
                <Th textColor="white">{t("Price")}</Th>
                <Th textColor="white">{t("Service Type(s)")}</Th>
                <Th textColor="white">{t("Actions")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBranchServices.map((branchService, index) => (
                <Tr key={branchService.id}>
                  <Td>{index + 1}</Td>
                  {userRole === "company admin" && (
                    <Td>
                      {editableBranchService && editableBranchService.id === branchService.id ? (
                        branchService.type === "service" ? (
                          <Select
                            value={editableBranchService.branch_id}
                            onChange={(e) =>
                              setEditableBranchService({
                                ...editableBranchService,
                                branch_id: e.target.value,
                              })
                            }
                            options={branches.map((branch) => ({
                              value: branch.id,
                              label: branch.name,
                            }))}
                          />
                        ) : (
                          <Input
                            value={editableBranchService.package_name}
                            onChange={(e) =>
                              setEditableBranchService({
                                ...editableBranchService,
                                package_name: e.target.value,
                              })
                            }
                          />
                        )
                      ) : (
                        branchService.branch_name || branchService.package_name
                      )}
                    </Td>
                  )}
                  <Td>
                    {editableBranchService && editableBranchService.id === branchService.id ? (
                      branchService.type === "service" ? (
                        <Input
                          value={editableBranchService.service_name}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              service_name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Input
                          value={editableBranchService.package_name}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              package_name: e.target.value,
                            })
                          }
                        />
                      )
                    ) : (
                      branchService.service_name || branchService.package_name
                    )}
                  </Td>
                  <Td>
                    {editableBranchService && editableBranchService.id === branchService.id ? (
                      branchService.type === "service" ? (
                        <Input
                          value={editableBranchService.service_description}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              service_description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Input
                          value={editableBranchService.package_description}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              package_description: e.target.value,
                            })
                          }
                        />
                      )
                    ) : (
                      branchService.service_description || branchService.package_description
                    )}
                  </Td>
                  <Td>
                    {editableBranchService && editableBranchService.id === branchService.id ? (
                      branchService.type === "service" ? (
                        <Input
                          type="number"
                          value={editableBranchService.current_price}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              current_price: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Input
                          type="number"
                          value={editableBranchService.package_price}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              package_price: e.target.value,
                            })
                          }
                        />
                      )
                    ) : (
                      branchService.current_price || branchService.package_price
                    )}
                  </Td>
                  <Td>
                    {editableBranchService && editableBranchService.id === branchService.id ? (
                      branchService.type === "service" ? (
                        <Select
                          value={editableBranchService.service_type_id}
                          onChange={(e) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              service_type_id: e.target.value,
                            })
                          }
                          options={serviceTypes.map((serviceType) => ({
                            value: serviceType.id,
                            label: serviceType.name,
                          }))}
                        />
                      ) : (
                        <Select
                          isMulti
                          value={editableBranchService.service_type_ids.map(id => ({
                            value: id,
                            label: serviceTypes.find(type => type.id === id)?.name || "",
                          }))}
                          onChange={(selectedOptions) =>
                            setEditableBranchService({
                              ...editableBranchService,
                              service_type_ids: selectedOptions,
                            })
                          }
                          options={serviceTypes.map((serviceType) => ({
                            value: serviceType.id,
                            label: serviceType.name,
                          }))}
                        />
                      )
                    ) : (
                      branchService.service_type_name || branchService.service_type_ids.map((id) => {
                        const serviceType = serviceTypes.find((type) => type.id === id);
                        return serviceType ? serviceType.name : "";
                      }).join(", ")
                    )}
                  </Td>
                  <Td>
                    {editableBranchService && editableBranchService.id === branchService.id ? (
                      <Flex>
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={handleSaveBranchService}
                          borderRadius="full"
                          boxShadow="md"
                          _hover={{ bg: "green.600", transform: "scale(1.05)" }}
                          _active={{ bg: "green.700", transform: "scale(0.95)" }}
                          transition="all 0.2s"
                        >
                        <MdDone />
                        </Button>
                        <Button
                          colorScheme="red"
                          ml={2}
                          size="sm"
                          onClick={() => setEditableBranchService(null)}
                          borderRadius="full"
                          boxShadow="md"
                          _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                          _active={{ bg: "red.700", transform: "scale(0.95)" }}
                          transition="all 0.2s"
                        >
                        <MdCancel />
                        </Button>
                      </Flex>
                    ) : (
                      <Flex>
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleEditBranchService(branchService)}
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
                          onClick={() => {
                            if (
                              window.confirm(
                                t("Are you sure you want to delete this branch service?")
                              )
                            ) {
                              handleDeleteBranchService(branchService.id);
                            }
                          }}
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
                          onClick={() => handleViewBranchService(branchService.id)}
                          borderRadius="full"
                          boxShadow="md"
                          _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
                          _active={{ bg: "teal.700", transform: "scale(0.95)" }}
                          transition="all 0.2s"
                        >
                          <IoMdEye />
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
    </>
  );
};

export default ListBranchServices;
