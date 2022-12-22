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
  Grid,
  GridItem,
  Select,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, Icon, TimeIcon } from '@chakra-ui/icons';

export interface MessagesProps {
  itemId: number | string;
}

export default function Messages({ itemId }: MessagesProps) {
  const [messages, setMessages] = useState<Array<MessageI>>();
  const [viewedMessages, setViewedMessages] = useState<Array<MessageI>>();
  const [states, setStates] = useState({
    message: '',
  });
  const [filterBy, setFilterBy] = useState<string>();
  const [selectedMessage, setSelectedMessage] = useState<MessageI | null>();
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
        setViewedMessages(data.result);
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

    if (selectedMessage && selectedMessage.id) {
      selectedMessage.message = states.message;
      GenericService.update<MessageI, MessageI>(
        'message',
        selectedMessage.id,
        selectedMessage
      ).then((result) => {
        if (result.success) {
          setFilterBy('all');
          setSelectedMessage(null);
          setStates({ ...states, message: '' });
        }
      });
    } else {
      GenericService.create<MessageI>('message', {
        item_id: Number(itemId),
        message: states.message || '',
        message_type: 'comment',
        user_id: user.id,
      }).then((result) => {
        if (result.success) {
          setFilterBy('all');
          addItemToTheList(result.result);
        }
      });
    }
  };

  const filterByItems = (e: any) => {
    const newFilterBy = e.target.value;
    setFilterBy(newFilterBy);
    if ('all' === newFilterBy || !newFilterBy) {
      updateViewedMessages(messages || []);
    } else {
      updateViewedMessages(
        (messages || []).filter(
          (message) => message.message_type === newFilterBy
        )
      );
    }
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

  const updateViewedMessages = (newMessages: Array<MessageI>) => {
    // filter
    setViewedMessages(newMessages);
  };

  const deleteItemFromList = (messageId: number) => {
    const newMessages = messages?.filter((message) => message.id !== messageId);
    setMessages(newMessages);
    updateViewedMessages(newMessages || []);
  };

  const addItemToTheList = (item: MessageI) => {
    const newMessages = [...(messages || [])];
    newMessages.unshift(item);
    setMessages(newMessages);
    setStates({ ...states, message: '' });
    updateViewedMessages(newMessages);
  };

  const editMessage = (message: MessageI) => {
    setSelectedMessage(message);
    setStates({ ...states, message: message.message });
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
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          <GridItem>
            <Select onChange={filterByItems} value={filterBy} name="filterBy">
              <option selected={true} value="all">
                All
              </option>
              <option value="comment">Comments</option>
              <option value="history">History</option>
            </Select>
          </GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
          <GridItem></GridItem>
        </Grid>
        {messages &&
          viewedMessages &&
          viewedMessages.map((message) => {
            return (
              <Card
                key={message.id}
                w={'100%'}
                bg={
                  selectedMessage && message.id === selectedMessage.id
                    ? 'yellow.50'
                    : 'gray.50'
                }
              >
                <CardHeader>
                  <Text fontSize={'sm'} color={'gray.400'}>
                    {message.user_id === userId &&
                      message.message_type === 'comment' && (
                        <>
                          <Icon
                            as={DeleteIcon}
                            color={'red.500'}
                            _hover={{ color: 'red.600' }}
                            onClick={() => deleteItem(message.id)}
                          />
                          <Icon
                            as={EditIcon}
                            color={'blue.500'}
                            _hover={{ color: 'blue.600' }}
                            onClick={() => editMessage(message)}
                          />
                        </>
                      )}
                    {message.message_type === 'history' && (
                      <Icon
                        as={TimeIcon}
                        color={'orange.500'}
                        _hover={{ color: 'orange.600' }}
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
