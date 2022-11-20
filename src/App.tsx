import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
import ResultI from './core/ResultI';
import GenericService from './service/GenerciService';
export interface SideBarI {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
/*
 * TODO load user profile in local storage and
 *  - hide login/register buttons if user is logged in
 *  - show logout button if user is logged in
 */
export const App = () => {
  const [changedLocalStorage, setChangedLocalStorage] =
    useState<boolean>(false);
  const [checkIsLoggedIn, setCheckIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (checkIsLoggedIn) {
      interval = setInterval(() => {
        GenericService.simple_get('user/check_is_logged_in').then(
          (res: any) => {
            console.log('check_is_logged_in', res, res.status);
          },
          (err) => {
            console.log('STATUS', err.response.status);
            let res = err.response;
            if (res.status === 401) {
              setCheckIsLoggedIn(false);
              console.log('check KO');
              clearInterval(interval);
            } else {
              console.log('check OK');
            }
          }
        );
      }, 1000 * 10);
    }
  }, [checkIsLoggedIn]);

  const toggleChangedLocalStorage = () => {
    setCheckIsLoggedIn(true);
    setChangedLocalStorage(!changedLocalStorage);
  };
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NavigateFunctionComponent
          toggleChangedLocalStorage={toggleChangedLocalStorage}
        />
        <Box h="full">
          <NavBar
            toggleChangedLocalStorage={toggleChangedLocalStorage}
            changedLocalStorage={changedLocalStorage}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={
                <RegistrationForm
                  toggleChangedLocalStorage={toggleChangedLocalStorage}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginForm
                  toggleChangedLocalStorage={toggleChangedLocalStorage}
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
