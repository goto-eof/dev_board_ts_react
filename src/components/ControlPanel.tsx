import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ControlPanel = () => {
  const [darkTheme, setDarkTheme] = useState<boolean>(
    localStorage.getItem('chakra-ui-color-mode') === 'dark'
  );

  useEffect(() => {});

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    let theme = localStorage.getItem('chakra-ui-color-mode');
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('chakra-ui-color-mode', theme);
    setDarkTheme(localStorage.getItem('chakra-ui-color-mode') === 'dark');
    navigate('/');
  };

  return (
    <Box p={8}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          Dark theme
        </FormLabel>
        <Switch key={'a'} onChange={toggleDarkMode} isChecked={darkTheme} />
      </FormControl>
    </Box>
  );
};
