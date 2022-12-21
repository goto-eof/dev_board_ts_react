import GenericService from '../service/GenerciService';
import Result from '../core/ResultI';
import MessageI from '../core/message';
import { useEffect, useState } from 'react';
import { UserResponseI } from '../core/UserResponseI';
import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card';
import {
  Button,
  Textarea,
  Text,
  VStack,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, Icon } from '@chakra-ui/icons';

export interface MessagesProps {
  itemId: number | string;
}

export default function Messages({ itemId }: MessagesProps) {
  const [messages, setMessages] = useState<Array<MessageI>>();
  const [states, setStates] = useState({
    message: '',
  });

  const [userId, setUserId] = useState<number>(
    JSON.parse(localStorage.getItem('user') || '{}').id
  );

  useEffect(() => {
    GenericService.get<Result<Array<MessageI>>>(
      'message/get_by_item_id/' + itemId
    ).then((data) => {
      if (data.success) {
        console.log(data.result);
        setMessages(data.result);
      }
    });
  }, []);

  const handleInputChange = (e: any) => {
    setStates({
      ...states,
      [e.target.name]: e.target.value,
    });
  };

  const saveMessage = () => {
    if (!states.message) {
      return;
    }
    const user: UserResponseI = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    GenericService.create<MessageI>('message', {
      item_id: Number(itemId),
      message: states.message || '',
      message_type: 'comment',
      user_id: user.id,
    }).then((result) => {
      if (result.success) {
        addItemToTheList(result.result);
      }
    });
  };

  const deleteItem = (messageId: number | undefined) => {
    if (!messageId) {
      return;
    }
    GenericService.delete<Result<boolean>>('message', messageId).then(
      (result) => {
        if (result.success) {
          deleteItemFromList(messageId);
        }
      }
    );
  };

  const deleteItemFromList = (messageId: number) => {
    const newMessages = messages?.filter((message) => message.id !== messageId);
    setMessages(newMessages);
  };

  const addItemToTheList = (item: MessageI) => {
    const newMessages = [...(messages || [])];
    newMessages.unshift(item);
    setMessages(newMessages);
    setStates({ ...states, message: '' });
  };

  return (
    <VStack w={'100%'} bg={'gray.50'}>
      <>
        <Textarea
          bg={'white.100'}
          w={'100%'}
          name="message"
          value={states.message}
          onChange={handleInputChange}
        />
        <Button onClick={saveMessage} w={'100%'}>
          Save comment
        </Button>
        {messages &&
          messages.map((message) => {
            return (
              <Card key={message.id} w={'100%'}>
                <CardHeader>
                  <Text fontSize={'sm'} color={'gray.400'}>
                    {message.user_id === userId && (
                      <Icon
                        as={DeleteIcon}
                        color={'red.500'}
                        _hover={{ color: 'red.600' }}
                        onClick={() => deleteItem(message.id)}
                      />
                    )}
                    <Badge colorScheme="green">{message.id} </Badge>{' '}
                    {message && message.created_at?.toString()}
                  </Text>
                </CardHeader>
                <CardBody minHeight={'32px'}>
                  <Text color={'black.500'}>{message.message}</Text>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            );
          })}
      </>
    </VStack>
  );
}
