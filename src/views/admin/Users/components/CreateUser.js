import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import fetchWithToken from "views/auth/signIn/axiosInstance";
import { useTranslation } from "react-i18next";

function CreateUser() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userpass, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState(null);
  const [entryUser, setEntryUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("Access Token:", accessToken);
      try {
        const [header, payload, signature] = accessToken.split(".");
        // console.log("Token Payload (Base64):", payload);
        const decodedPayload = JSON.parse(atob(payload));
        // console.log("Decoded Payload:", decodedPayload);
        const entryUser = decodedPayload.clientId;
        if (entryUser) {
          setEntryUser(entryUser);
          //  console.log("Entry User set to:", entryUser);
        } else {
          console.error("Username not found in token payload.");
        }
      } catch (error) {
        console.error("Error decoding access token:", error);
      }
    } else {
      console.error("Access token not found.");
    }
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_URL}/api/role`
        );
        if (response) {
          const rolesData = response;
          setRoles(rolesData);
        } else {
          console.error("Error fetching roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entryUser) {
      console.error("Entry user not available.");
      setError("Entry user not available.");
      return;
    }

    try {
      const data = {
        name,
        email,
        userpass,
        entryUser,
        updateUser: entryUser,
        roleId,
      };
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_URL}/api/createUser`,
        "POST",
        data
      );
      if (response) {
        console.log("User created successfully");
        window.location.reload();
      } else {
        const errorData = response;
        setError(errorData.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user");
    }
  };

  return (
      <FormControl>
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          mb="8px"
        >
          {t("Name")}
        </FormLabel>
        <Input
          isRequired={true}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          placeholder="Name"
          mb="24px"
          fontWeight="500"
          size="lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          mb="8px"
        >
          {t("Email")}
        </FormLabel>
        <Input
          isRequired={true}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="email"
          placeholder="Email"
          mb="24px"
          fontWeight="500"
          size="lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel ms="4px" fontSize="sm" fontWeight="500" display="flex">
          {t("Password")}
        </FormLabel>
        <Input
          isRequired={true}
          fontSize="sm"
          placeholder="Password"
          mb="24px"
          size="lg"
          type="password"
          variant="auth"
          value={userpass}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          mb="8px"
        >
          {t("Role")}
        </FormLabel>
        <Select
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          placeholder="Select Role"
          mb="24px"
          fontWeight="500"
          size="lg"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.description}
            </option>
          ))}
        </Select>

        <Button
          fontSize="sm"
          colorScheme="blue"
          fontWeight="500"
          w="100%"
          h="50"
          mb="24px"
          onClick={handleSubmit}
        >
           {t("Create User")}
        </Button>
        {error && <Text color="red">{error}</Text>}
      </FormControl>

  );
}

export default CreateUser;
