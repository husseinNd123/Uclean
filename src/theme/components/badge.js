import { mode } from "@chakra-ui/theme-tools";
export const badgeStyles = {
  components: {
    Badge: {
      baseStyle: {
        borderRadius: "10px",
        lineHeight: "100%",
        padding: "7px",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
      variants: {
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props) => ({
          bg: mode("blue.500", "blue.400")(props),
          color: "white",
          _focus: {
            bg: mode("blue.500", "blue.400")(props),
          },
          _active: {
            bg: mode("blue.500", "blue.400")(props),
          },
          _hover: {
            bg: mode("brand.600", "blue.400")(props),
          },
        }),
      },
    },
  },
};
