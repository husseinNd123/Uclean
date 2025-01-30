import React, { useState, useEffect } from "react";
import { Box, Button, Input, Select, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";

const InsertBranchServices = () => {
  const { t } = useTranslation();
  const [branchId, setBranchId] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [entryUser, setEntryUser] = useState("sampleUser");
  const [updateUser, setUpdateUser] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([
    { id: 1, name: "Type 1" },
    { id: 2, name: "Type 2" },
  ]);
  const toast = useToast();

  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) {
      setBranchId(storedBranchId);
    }
    // Your code to get entryUser from the token

    // Fetch service types
    const fetchServiceTypes = async () => {
      try {
        const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/service_types`, "GET");
        const data = await response.json();
        setServiceTypes(data);
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    };

    fetchServiceTypes();
  }, []);


  const handleCurrentPriceChange = (event) => {
    setCurrentPrice(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { branchId, currentPrice, serviceTypeId, entryUser, updateUser};
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/branch_services`,
        "POST",
        data
      );

      const responseBody = response;
      setCurrentPrice("");
      setServiceTypeId("");
      setEntryUser("");
      setUpdateUser("");
      setError("");
      setSuccess(true);

      toast({
        title: "Service added successfully!",
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
      <Box >
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>
            {t("Service added successfully!")}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <Select
            variant="filled"
            placeholder={t("Select Service")}
            value={serviceTypeId}
            onChange={(e)=>{
              setServiceTypeId(e.target.value);
            }}
            required
            mb={4}
          >
            {serviceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {t(type.name)}
              </option>
            ))}
          </Select>
          <Input
            variant="filled"
            placeholder={t("Price")}
            type="number"
            value={currentPrice}
            onChange={handleCurrentPriceChange}
            required
            mb={4}
          />
          <Button colorScheme="blue" type="submit" w="100%">
            {t("Submit")}
          </Button>
        </form>
      </Box>
    </motion.div>
  );
};

export default InsertBranchServices;
