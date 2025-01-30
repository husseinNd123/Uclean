import React, { useState, useEffect } from "react";
import { Box, Button, Input, useToast, Checkbox, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@chakra-ui/icons";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";

const ServicePackage = () => {
  const { t } = useTranslation();

  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch service types from API
    const fetchServiceTypes = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/service_types`, "GET");
        const data = await response.json();
        setServiceTypes(data);
      } catch (error) {
        console.error("Error fetching service types:", error);
        // Example service types for demonstration
        setServiceTypes([
          { id: "1", name: "Consultation" },
          { id: "2", name: "Installation" },
          { id: "3", name: "Maintenance" },
        ]);
      }
    };

    fetchServiceTypes();
  }, []);

  const handlePackageNameChange = (event) => {
    setPackageName(event.target.value);
  };

  const handlePackageDescriptionChange = (event) => {
    setPackageDescription(event.target.value);
  };

  const handlePackagePriceChange = (event) => {
    setPackagePrice(event.target.value);
  };

  const handleServiceTypeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServiceTypes((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { 
        packageName, 
        packageDescription, 
        packagePrice, 
        serviceTypeIds: selectedServiceTypes,
      };
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/service_packages`,
        "POST",
        data
      );

      const responseBody = response;

      setPackageName("");
      setPackageDescription("");
      setPackagePrice("");
      setSelectedServiceTypes([]);
      setError("");
      setSuccess(true);

      toast({
        title: "Package added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
      toast({
        title: "An error occurred.",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>
            {t("Package added successfully!")}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            variant="filled"
            placeholder={t("Package Name")}
            value={packageName}
            onChange={handlePackageNameChange}
            required
            mb={4}
          />
          <Input
            variant="filled"
            placeholder={t("Package Description")}
            value={packageDescription}
            onChange={handlePackageDescriptionChange}
            mb={4}
          />
          <Input
            variant="filled"
            placeholder={t("Package Price")}
            type="number"
            value={packagePrice}
            onChange={handlePackagePriceChange}
            required
            mb={4}
          />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} mb={4}>
              {t("Select Service")}s
            </MenuButton>
            <MenuList>
              {serviceTypes.map((type) => (
                <MenuItem key={type.id}>
                  <Checkbox
                    value={type.id}
                    isChecked={selectedServiceTypes.includes(type.id)}
                    onChange={handleServiceTypeChange}
                  >
                    {type.name}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button colorScheme="blue" type="submit" w="100%">
            {t("Submit")}
          </Button>
        </form>
      </Box>
    </motion.div>
  );
};

export default ServicePackage;
