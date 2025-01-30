import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Box } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang); // Change the language
    };

    // Map language codes to full language names for display
    const languageNames = {
        en: 'English',
        it: 'Italian',
    };

    return (
        <Box display="flex" justifyContent="flex-start" p={4}>
            <Menu>
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    colorScheme="teal"
                    boxShadow="lg"
                    _hover={{ bg: "teal", color: "white", transform: "scale(0.98)" }}
                    _active={{ bg: "teal", color: "white", transform: "scale(0.98)" }}
                >
                    {languageNames[i18n.language] || t('language')}
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                    <MenuItem onClick={() => changeLanguage('it')}>Italian</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default LanguageSwitcher;
