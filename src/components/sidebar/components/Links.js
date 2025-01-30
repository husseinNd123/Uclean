/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { RiUserSettingsLine } from "react-icons/ri";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue, Collapse, Icon } from "@chakra-ui/react";

import Users from "views/admin/Users";

import { 
  MdSettings,
  MdPermContactCalendar,
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";
import { useTranslation } from "react-i18next";


export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("blue.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("blue.500", "blue.400");

  const { t } = useTranslation();
  const { routes } = props;

  const [clickedLinkIndex, setClickedLinkIndex] = useState(null);

  const [hasSettingsPermission, setHasSettingsPermission] = useState(false);

  useEffect(() => {
    const userPermissions = JSON.parse(localStorage.getItem("userPermissions"));
    if (userPermissions && userPermissions.includes("settings")) {
      setHasSettingsPermission(true);
    } else {
      setHasSettingsPermission(true);
    }
  }, []);

  // State to manage the dropdown's open/close state
  const [isDropdownOpen, setDropdownOpen] = useState(false);
// Function to toggle the dropdown state
const toggleDropdown = () => {
  setDropdownOpen(!isDropdownOpen);
};

const activeRoute = (routeName) => {
  return location.pathname.includes(routeName);
};

// Function to render links within the dropdown
const renderDropdownLinks = () => {
  // You can customize the links and paths based on your requirements
const dropdownLinks = [
  {
    name: "Users",
    layout: "/admin",
    path: "/users",
    icon: <Icon as={MdPermContactCalendar} width='20px' height='20px' color='inherit' />,
    component: Users,
  },
  ];

  return dropdownLinks.map((link, index) => (
    <NavLink key={index} to={link.layout + link.path} onClick={() => setClickedLinkIndex(index)}>
            {link.icon ? (
              <Box>
                <HStack
                  spacing={
                    activeRoute(link.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box
                      color={
                        activeRoute(link.path.toLowerCase())
                         ? activeIcon
                         : textColor
                      }
                      me='18px'>
                      {link.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(link.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(link.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }>
                      {t(link.name)}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={
                      activeRoute(link.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(link.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Text
                    me='auto'
                    color={
                      activeRoute(link.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(link.path.toLowerCase()) ? "bold" : "normal"
                    }>
                    {link.name}
                  </Text>
                  <Box h='36px' w='4px' bg='blue.400' borderRadius='5px' />
                </HStack>
              </Box>
            )}
          </NavLink>

  ));
};
  
const createLinks = (routes) => {
    return routes.map((route, index) => {
      if( route.name !== "Users" && 
          route.name !== "Sign In"&&
          route.name !== "Profile"&&
          route.name !== "ListItemServices"
          ){
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" 
      ) {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me='18px'>
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }>
                      {t(route.name)}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Text
                    me='auto'
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }>
                    {t(route.name)}
                  </Text>
                  <Box h='36px' w='4px' bg='blue.400' borderRadius='5px' />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    }
    });
  };
  //  BRAND
  return (
    <>
      {createLinks(routes)}

      {/* Conditionally render the settings dropdown */}
      {hasSettingsPermission && (
        <>
          <Box>
            <HStack
              spacing={"26px"}
              cursor="pointer"
              onClick={toggleDropdown}
              py='5px'
              ps='10px'>
              <Flex w='100%' alignItems='center' justifyContent='center'>
                <Box color={textColor} me='18px'>
                  <Icon as={MdSettings} boxSize={5} />
                </Box>
                <Text me='auto' color={textColor} fontWeight={"normal"}>
                    {t("Settings")}
                </Text>
                <Box color={isDropdownOpen ? activeIcon : textColor} me='0px' pt={"1"}>
                  <Icon as={isDropdownOpen ? MdArrowDropUp : MdArrowDropDown} boxSize={8} pt='1' />
                </Box>
              </Flex>
            </HStack>
          </Box>
          <Collapse in={isDropdownOpen}>
            <Box ml="30px">
              {renderDropdownLinks()}
            </Box>
          </Collapse>
        </>
      )}
    </>
  );
}

export default SidebarLinks;
