import {
  Button,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// import logoWhite from "assets/img/layout/logoWhite.png";
import React from "react";
import Logo from "assets/img/layout/comp.png";

export default function SidebarDocs() {
  const bgColor = "linear-gradient(135deg, #8ED4FF 0%, #00A3FF 10%, #0057FF 100%)";
  const borderColor = useColorModeValue("white", "navy.800");

  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      bg={bgColor}
      borderRadius='30px'
      mb={4}
      position='relative'>
      {/* <Flex
        border='5px solid'
        borderColor={borderColor}
        backgroundImage={Logo}
        backgroundSize={"cover"}
        borderRadius='50%'
        w='94px'
        h='94px'
        align='center'
        justify='center'
        mx='auto'
        position='absolute'
        left='50%'
        top='-47px'
        transform='translate(-50%, 0%)'>
      </Flex> */}
      <Flex
        direction='column'
        mb='12px'
        align='center'
        justify='center'
        px='15px'
        pt='55px'>
        <Text
          fontSize={{ base: "lg", xl: "18px" }}
          color='white'
          fontWeight='bold'
          lineHeight='150%'
          textAlign='center'
          px='10px'
          mt="10px"
          mb='6px'>
          Company Dashboard
        </Text>
      </Flex>

    </Flex>
  );
}
