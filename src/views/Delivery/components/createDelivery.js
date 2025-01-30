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

const CreateDelivery = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryState, setDeliveryState] = useState(""); 
  const [deliveryCountry, setDeliveryCountry] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("pending");
  const [branches, setBranches] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const companyID = localStorage.getItem("companyId");
  
    if (accessToken) {
      const [header, payload, signature] = accessToken.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      const entryUser = decodedPayload.clientId;
  
      setCompanyId(companyID);
      fetchBranches(companyID); // Fetch branches when component mounts
    } else {
      console.error("Access token not found.");
    }
  }, []);
  
  const fetchBranches = async (companyID) => {
    try {
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/branches?company_id=${companyID}`, "GET");
      
      if (response) {
        setBranches(response); // Assume response is an array of branch objects
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    try {
      const data = {
        branch_id: branchId,
        company_id: companyId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_state: deliveryState,
        delivery_country: deliveryCountry,
        delivery_status: deliveryStatus,
      };

      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/deliveries`, "POST", data);

      if (response) {
        setError("");
        setSuccess(true);
        console.log("Delivery created successfully");
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
          <Card 
            p={{ base: "20px", md: "30px" }}>
            {error && (
              <Text color="#FF3B3B " textAlign="center" fontSize="lg">
                {error}
              </Text>
            )}
            {success && (
              <Text color="green.500" textAlign="center">
                {t("Delivery created successfully!")}
              </Text>
            )}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("First Name")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Last Name")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Branch")}
                </Text>
                <Select
                  variant="filled"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  mb={4}
                  required
                >
                  <option value="">{t("Select Branch")}</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Phone Number")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Delivery Address")}
                </Text>
                <Input
                  mb="0px"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("City")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("State")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Country")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={deliveryCountry}
                  onChange={(e) => setDeliveryCountry(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Email")}
                </Text>
                <Input
                  mb="0px"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Delivery Status")}
                </Text>
                <Select
                  variant="filled"
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  mb={4}
                  required
                >
                  <option value="Available">{t("Available")}</option>
                  <option value="Busy">{t("Busy")}</option>
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
                  {isSubmitting ? <Spinner size="sm" /> : "Submit"}
                </Button>
              </Box>
          </Card>
    </motion.div>
  );
};

export default CreateDelivery;
