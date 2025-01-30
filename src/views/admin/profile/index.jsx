import React, { useEffect, useState } from "react";
import {
  // Avatar,
  Text,
  Box,
  Grid,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Banner from "views/admin/profile/components/Banner";
import banner from "assets/img/auth/banner.png";
import fetchWithToken from "views/auth/signIn/axiosInstance";
export default function Overview() {
  const [userRole, setUserRole] = useState("Role");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error , setError] = useState("");

  useEffect(() => {
    const fetchUserRoleDescription = async () => {
      try {
        const username = localStorage.getItem("username") || null;
        const responseUsers = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/users`);
        const responseRoles = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/role`);

        if (responseUsers && responseRoles) {
          const usersData = responseUsers//await .json();
          const rolesData = responseRoles//await .json();
          const user = usersData.find((user) => user.username === username);
          if (!user) {
            console.error("User not found");
            return;
          }
          setUserId(user.userId);

          const role = rolesData.find((role) => role.roleId === user.roleId);
          if (!role) {
            console.error("Role not found");
            return;
          }

          setUserRole(role.description);
        } else {
          console.error("Error fetching users or roles");
        }
      } catch (error) {
        console.error("Error fetching users or roles:", error);
      }
    };

    fetchUserRoleDescription();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match.");
      setError("Passwords do not match! Please enter the same password in both fields.");
      return console.error("Passwords doesn't match!");
    }
    try {
      const username = localStorage.getItem("username"); 
      const data = {
        userId: userId,
        userpass: newPassword,
        updateUser: username, 
      };
      const response = await fetchWithToken(`${process.env.REACT_APP_API_URL}/api/editUser`,
      "PUT",data//    {
      //   method: 
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(),
      // }
    );
      if (response) {
       // console.log("Success");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        console.log("Error updating");
        setError("Error updating password.");
      }
    } catch (error) {
      setError("Error updating password.")
     console.log(`An error occurred while updating the password: ${error.message}`);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        
        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          name={localStorage.getItem("username") || "User"}
          job={userRole}
        />
        <Box>
          <FormControl isRequired mt={4}>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button mt={4} colorScheme="blue" onClick={handlePasswordChange}>
            Update Password
          </Button>
          <Text color="red.400" fontSize="md"  mb="4">{error}</Text>
        </Box>
      </Grid>
    </Box>
  );
}