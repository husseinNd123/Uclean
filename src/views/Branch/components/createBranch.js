import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Textarea,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { motion } from "framer-motion";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import Map from "views/map/map"; // Add this line
import { useTranslation } from "react-i18next";

const CreateBranch = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(0);
  const [ucWallet, setUcWallet] = useState(1);
  const [ucDelivery, setUcDelivery] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState(0.00);
  const [longitude, setLongitude] = useState(0.00);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("open");
  const [companyId, setCompanyId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [cleanAtLocationFee, setCleanAtLocationFee] = useState(0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const companyID = localStorage.getItem("companyId");

    if (accessToken) {
      const [header, payload, signature] = accessToken.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      const entryUser = decodedPayload.clientId;
      // setEntryUser(entryUser);
      setCompanyId(companyID);
    } else {
      console.error("Access token not found.");
    }
  }, []);

  const handleLocationSelect = (location) => {
    setLatitude(location.lat);
    setLongitude(location.lng);
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    try {
      const data = {
        id: companyId,
        name,
        about,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state,
        free_delivery: freeDelivery,
        minimum_order_amount: minimumOrderAmount,
        uc_wallet: ucWallet,
        uc_delivery: ucDelivery,
        postal_code: postalCode,
        country,
        phone_number: phoneNumber,
        email,
        latitude,
        longitude,
        password,
        status,
        delivery_fee: ucDelivery ? deliveryFee : 0,
        clean_at_location_fee: ucDelivery ? cleanAtLocationFee : 0,
      };

      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/branches`, "POST", data);

      if (response) {
        setError("");
        setSuccess(true);
        console.log("Branch created successfully");
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
                {t("Branch added successfully!")}
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
                  {t("About")}
                </Text>
                <Textarea
                  mb="0px"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Address Line 1")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Address Line 2")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("City")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("State")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Postal Code")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Country")}
                </Text>
                <Input
                  mb="0px"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
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
                  {t("Password")}
                </Text>
                <Input
                  mb="0px"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Minimum Order Amount")}
                </Text>
                <Input
                  mb="0px"
                  type="number"
                  value={minimumOrderAmount}
                  onChange={(e) => setMinimumOrderAmount(parseInt(e.target.value))}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("UC Wallet")}
                </Text>
                <Select
                  variant="filled"
                  value={ucWallet}
                  onChange={(e) => setUcWallet(parseInt(e.target.value))}
                  mb={4}
                  required
                >
                  <option value="1">{t("Yes")}</option>
                  <option value="0">{t("No")}</option>
                </Select>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Free Delivery")}
                </Text>
                <Select
                  variant="filled"
                  value={freeDelivery}
                  onChange={(e) => setFreeDelivery(e.target.value === "true")}
                  mb={4}
                  required
                >
                  <option value="true">{t("Yes")}</option>
                  <option value="false">{t("No")}</option>
                </Select>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("UC Delivery")}
                </Text>
                <Select
                  variant="filled"
                  value={ucDelivery}
                  onChange={(e) => setUcDelivery(parseInt(e.target.value))}
                  mb={4}
                  required
                >
                  <option value="1">{t("Yes")}</option>
                  <option value="0">{t("No")}</option>
                </Select>
              </Box>
              {ucDelivery === 1 && (
                <>
                  <Box>
                    <Text fontSize="sm" color="gray.800" mb="2">
                      {t("Delivery Fee")}
                    </Text>
                    <Input
                      mb="0px"
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.800" mb="2">
                      {t("Clean at Location Fee")}
                    </Text>
                    <Input
                      mb="0px"
                      type="number"
                      value={cleanAtLocationFee}
                      onChange={(e) => setCleanAtLocationFee(parseFloat(e.target.value))}
                    />
                  </Box>
                </>
              )}
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Status")}
                </Text>
                <Select
                  variant="filled"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  mb={4}
                  required
                >
                  <option value="open">{t("Open")}</option>
                  <option value="closed">{t("Closed")}</option>
                </Select>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Latitude")}
                </Text>
                <Input
                  mb="0px"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.800" mb="2">
                  {t("Longitude")}
                </Text>
                <Input
                  mb="0px"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                />
              </Box>
              <Box gridColumn={{ base: "span 1", md: "span 2", lg: "span 3" }} display="flex" justifyContent="center">
                <Map
                  onPointSelect={() => {}}
                  onLocationSelect={handleLocationSelect} // Add this line
                />
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
        {/* </Box> */}
    </motion.div>
  );
};

export default CreateBranch;
