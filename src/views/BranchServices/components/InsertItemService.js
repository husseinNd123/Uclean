import React, { useState, useEffect } from "react";
import { Box, Button, Heading, Select, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";

const InsertItemService = () => {
  const { t } = useTranslation();
  const [branchId, setBranchId] = useState("");
  const [itemId, setItemId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [entryUser, setEntryUser] = useState(null);
  const [updateUser, setUpdateUser] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) {
      setBranchId(storedBranchId);
    }
    // Your code to get entryUser from the token

    const fetchServices = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/services`,
          "GET"
        );
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError("Failed to fetch services");
      }
    };

    const fetchItems = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/items`,
          "GET"
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError("Failed to fetch items");
      }
    };

    fetchServices();
    fetchItems();
  }, []);

  const handleItemIdChange = (event) => {
    setItemId(event.target.value);
  };

  const handleServiceIdChange = (event) => {
    setServiceId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { branchId, itemId, serviceId, entryUser, updateUser };
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/item_management`,
        "POST",
        data
      );

      const responseBody = response;
      setItemId("");
      setServiceId("");
      setEntryUser("");
      setUpdateUser("");
      setError("");
      setSuccess(true);

      toast({
        title: "Item added successfully!",
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
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>
            {t("Item added successfully!")}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <Select
            variant="filled"
            placeholder={t("Select Service")}
            value={serviceId}
            onChange={handleServiceIdChange}
            required
            mb={4}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
          <Select
            variant="filled"
            placeholder={t("Select Item")}
            value={itemId}
            onChange={handleItemIdChange}
            required
            mb={4}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Button colorScheme="blue" type="submit" w="100%">
            {t("Submit")}
          </Button>
        </form>
    </motion.div>
  );
};

export default InsertItemService;
