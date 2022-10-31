import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Boards from './components/Boards';
import Footer from './components/Footer';
import InsertItemForm from './components/InsertItemForm';
import NavBar from './components/NavBar';

export interface SideBarI {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Box h="full">
          <NavBar />
          <Routes>
            <Route path="/board" element={<Boards />} />
            <Route path="/new-item/:boardId" element={<InsertItemForm />} />
          </Routes>
          <Footer />
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};
