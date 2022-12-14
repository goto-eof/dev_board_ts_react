import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Columns } from './components/Columns';
import { ControlPanel } from './components/ControlPanel';
import Dashboard from './components/Dashboards';
import InsertColumnForm from './components/form/InsertColumnForm';
import InsertDashboard from './components/form/InsertDashboard';
import InsertItemForm from './components/form/InsertItemForm';
import LoginForm from './components/form/LoginForm';
import NavBar from './components/NavBar';
import { NavigateFunctionComponent } from './components/NavigateFunctionComponent';
import RegistrationForm from './components/form/RegistrationForm';
import ShareDashboard from './components/ShareDashboard';
export interface SideBarI {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
/*
 * TODO load user profile in local storage and
 */
export const App = () => {
  const [changedLocalStorage, setChangedLocalStorage] =
    useState<boolean>(false);

  const toggleChangedLocalStorage = () => {
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
            <Route path="/" element={<Dashboard />} />
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
            <Route path="/board/:boardId" element={<Columns />} />
            <Route path="/board/share/:boardId" element={<ShareDashboard />} />
            <Route path="/new-item/:boardId" element={<InsertItemForm />} />
            <Route
              path="/new-item/:boardIdP/:columnIdP"
              element={<InsertItemForm />}
            />
            <Route
              path="/edit-item/boardId/:boardIdP/columnId/:columnIdP/itemid/:itemIdP"
              element={<InsertItemForm />}
            />
            <Route
              path="/edit-column/:boardIdP/:columnIdP"
              element={<InsertColumnForm />}
            />
            <Route
              path="/new-column/:boardIdP"
              element={<InsertColumnForm />}
            />
            <Route path="/new-dashboard" element={<InsertDashboard />} />
            <Route
              path="/edit-dashboard/:boardId"
              element={<InsertDashboard />}
            />
            <Route
              path="/edit-dashboard/:dashboardId"
              element={<InsertDashboard />}
            />
            <Route path="/cp" element={<ControlPanel />} />
          </Routes>
          {/* <Footer /> */}
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};
