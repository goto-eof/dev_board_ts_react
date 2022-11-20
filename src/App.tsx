import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Boards from './components/Boards';
import Footer from './components/Footer';
import Home from './components/Home';
import InsertColumnForm from './components/InsertBoardForm';
import InsertItemForm from './components/InsertItemForm';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import { NavigateFunctionComponent } from './components/NavigateFunctionComponent';
import RegistrationForm from './components/RegistrationForm';
export interface SideBarI {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const setLoggedIn = (value: boolean): void => {
    console.log('value', value);
    setIsLoggedIn(value);
  };
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NavigateFunctionComponent />
        <Box h="full">
          <NavBar isLoggedIn={isLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route
              path="/login"
              element={
                <LoginForm
                  setIsLoggedIn={setLoggedIn}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route path="/board" element={<Boards />} />
            <Route path="/new-item/:boardId" element={<InsertItemForm />} />
            <Route path="/new-item" element={<InsertItemForm />} />
            <Route
              path="/edit-item/boardid/:boardId/itemid/:itemId"
              element={<InsertItemForm />}
            />
            <Route path="/edit-board/:boardId" element={<InsertColumnForm />} />
            <Route path="/new-board" element={<InsertColumnForm />} />
          </Routes>
          <Footer />
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};
