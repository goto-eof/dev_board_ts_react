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
import { useEffect, useState } from 'react';
import { ItemRequestI } from '../core/ItemI';
import { UserResponseI } from '../core/UserResponseI';

export interface ViewItemI {
  onClose: () => void;
  isOpen: boolean;
  item: ItemRequestI;
  users: Array<UserResponseI>;
}

export function ViewItem({ isOpen, onClose, item, users }: ViewItemI) {
  const [assignee, setAssignee] = useState<UserResponseI>(
    users.filter((user) => user.id === item.assignee_id)[0]
  );

  useEffect(() => {
    setAssignee(users.filter((user) => user.id === item.assignee_id)[0]);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading fontSize={'xl'}>{item.name}</Heading>
            <Text>{item.description}</Text>
            <Text>Assignee: {assignee && assignee.username}</Text>
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
