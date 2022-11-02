import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  ModalOverlay,
} from '@chakra-ui/react';
import { ItemRequestI } from '../core/ItemRequestI';

export interface ViewItemI {
  onClose: () => void;
  isOpen: boolean;
  item: ItemRequestI;
}

export function ViewItem({ isOpen, onClose, item }: ViewItemI) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading>{item.name}</Heading>
            <Text>{item.description}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
