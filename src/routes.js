import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  
  MdPerson,
  MdHome,
  MdLock,
  MdDesignServices,
  MdPermContactCalendar,
  MdOutlineHomeWork,
  MdOutlineShoppingCart,
  MdDeliveryDining,
} from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import users from "views/admin/Users";
import Branch from "views/Branch/index";
import Company from "views/admin/Company/index";
import BranchServices from "views/BranchServices/index";
import Order from "views/Order/index";
import Delivery from "views/Delivery/index";
import SignInCentered from "views/auth/signIn";


const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Company",
    layout: "/admin",
    path: "/company",
    icon: <Icon as={HiOutlineBuildingOffice2} width='20px' height='20px' color='inherit' />,
    component: Company,
  },
  {
    name: "Branch",
    layout: "/admin",
    path: "/branch",
    icon: <Icon as={MdOutlineHomeWork} width='20px' height='20px' color='inherit' />,
    component: Branch,
  },
  {
    name: "Services",
    layout: "/admin",
    path: "/services",
    icon: <Icon as={MdDesignServices} width='20px' height='20px' color='inherit' />,
    component: BranchServices,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    icon: <Icon as={MdOutlineShoppingCart} width='20px' height='20px' color='inherit' />,
    component: Order,
  },
  {
    name: "Delivery",
    layout: "/admin",
    path: "/delivery",
    icon: <Icon as={MdDeliveryDining} width='20px' height='20px' color='inherit' />,
    component: Delivery,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "/users",
    icon: <Icon as={MdPermContactCalendar} width='20px' height='20px' color='inherit' />,
    component: users,
  },
];

export default routes;
