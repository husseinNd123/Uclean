import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { motion } from "framer-motion";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";

const CreateCompany = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [managerId, setManagerId] = useState("");
  const [ucleanCommission, setUcleanCommission] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLogoUpload = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("logo", logo);
    formData.append("service_id", serviceId);
    formData.append("manager_id", managerId);
    formData.append("uclean_commission", ucleanCommission);
    formData.append("is_active", isActive);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/companies`,
        "POST",
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (response) {
        setError("");
        setSuccess(true);
        console.log("Company created successfully");
      } else {
        const errorData = response;
        setError(errorData.error || "An error occurred. Please try again later.");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Card p={{ base: "20px", md: "30px" }}>
        {error && (
          <Text color="#FF3B3B " textAlign="center" fontSize="lg">
            {error}
          </Text>
        )}
        {success && (
          <Text color="green.500" textAlign="center">
            {t("Company created successfully!")}
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Box>
            <Text fontSize="sm" color="gray.800" mb="2">
              {t("Name")}
            </Text>
            <Input
              mb="0px"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.800" mb="2">
              {t("Logo")}
            </Text>
            <Input
              mb="0px"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.800" mb="2">
              {t("Service ID")}
            </Text>
            <Input
              mb="0px"
              type="text"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.800" mb="2">
              {t("Manager ID")}
            </Text>
            <Input
              mb="0px"
              type="text"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.800" mb="2">
              {t("Uclean Commission")}
            </Text>
            <Input
              mb="0px"
              type="number"
              value={ucleanCommission}
              onChange={(e) => setUcleanCommission(parseFloat(e.target.value))}
            />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.800" mb="2">
              {t("Is Active")}
            </Text>
            <Select
              variant="filled"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
              mb={4}
            >
              <option value="true">{t("Yes")}</option>
              <option value="false">{t("No")}</option>
            </Select>
          </Box>
        </SimpleGrid>
        <Box>
          <Button
            mt={4}
            colorScheme="blue"
            fontSize="m"
            borderRadius="16px"
            w={{ base: "100%", md: "148px" }}
            h="46px"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="sm" /> : t("Submit")}
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default CreateCompany;
