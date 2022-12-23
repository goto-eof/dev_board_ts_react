import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Button,
  Icon,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericService from '../../service/GenerciService';
import Result from '../../core/ResultI';
import { ColumnResponseI } from '../../core/ColumnResponseI';
import { ItemRequestI } from '../../core/ItemI';
import { ItemUpdateRequestI } from '../../core/ItemUpdateRequestI';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { UserResponseI } from '../../core/UserResponseI';
import Messages from '../Messages';
import { insertHistoryMessage } from '../../service/MessageService';

export interface InsertItemFormI {
  boardIdPr?: number;
  columnIdPr?: string;
  itemIdPr?: number;
  updateItem?: (item: ItemRequestI) => void;
  onClose?: () => void;
}

export default function InsertItemForm({
  boardIdPr,
  columnIdPr,
  itemIdPr,
  updateItem,
  onClose,
}: InsertItemFormI) {
  const { boardIdP, columnIdP, itemIdP } = useParams();
  const boardId = boardIdP ? boardIdP : boardIdPr;
  const columnId = columnIdP ? columnIdP : columnIdPr;
  const itemId = itemIdP ? itemIdP : itemIdPr;

  const [states, setStates] = useState({
    itemName: '',
    environment: '',
    itemPriority: '3',
    issueType: 0,
    order: 0,
    description: '',
    defaultBoard: '',
    error: new Map<string, boolean>(),
    isInvalid: false,
    columns: Array<ColumnResponseI>(),
    users: new Array<UserResponseI>(),
    assignee: -1,
    reporter: -1,
    publisherId: -1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const columns = await GenericService.getAll<
          Result<Array<ColumnResponseI>>
        >('column/all/' + boardId);
        const fields = itemId
          ? await GenericService.getById<Result<ItemRequestI>>(
              'item',
              Number(itemId)
            )
          : null;

        const allUsers = await GenericService.getAll<
          Result<Array<UserResponseI>>
        >('board/board_users/' + boardId);

        setStates({
          ...states,
          itemName: fields ? fields.result.name : '',
          environment: fields ? fields.result.environment : '',
          itemPriority: fields ? '' + fields.result.priority : '3',
          issueType: fields ? fields.result.issue_type : 0,
          description: fields ? fields.result.description : '',
          defaultBoard: columnId || '',
          columns: columns.result,
          order: fields ? fields.result.order : 0,
          assignee:
            fields && fields.result.assignee_id
              ? fields.result.assignee_id
              : -1,
          reporter:
            fields && fields.result.reporter_id
              ? fields.result.reporter_id
              : -1,
          publisherId:
            fields && fields.result.publisher_id
              ? fields.result.publisher_id
              : 0,
          users: allUsers.result,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: any) => {
    setStates({
      ...states,
      [e.target.name]: e.target.value,
    });
  };

  interface ErrorsProps {
    fieldName: string;
  }
  function Errors({ fieldName }: ErrorsProps) {
    return states.isInvalid && hasError(fieldName) ? (
      <FormHelperText>Invalid {fieldName}</FormHelperText>
    ) : (
      <></>
    );
  }

  const hasError = (field: string) => {
    return !!states.error.get(field);
  };

  const save = (e: any) => {
    e.preventDefault();
    GenericService.create<ItemRequestI>('item', {
      name: e.target.elements.itemName.value,
      environment: e.target.elements.environment.value,
      issue_type: Number(e.target.elements.issueType.value),
      column_id: Number(e.target.elements.defaultBoard.value),
      assignee_id:
        e.target.elements.assignee.value &&
        Number(e.target.elements.assignee.value) !== 0
          ? Number(e.target.elements.assignee.value)
          : undefined,
      reporter_id:
        e.target.elements.reporter.value &&
        Number(e.target.elements.reporter.value) !== 0
          ? Number(e.target.elements.reporter.value)
          : undefined,
      order: states.order,
      description: e.target.elements.description.value,
      priority: Number(e.target.elements.itemPriority.value),
    }).then((response: Result<ItemRequestI>) => {
      if (response.success) {
        if (response.result.id) {
          insertHistoryMessage(response.result.id, 'issue created');
        }
        navigate('/board/' + boardId);
      }
    });
  };

  const goBack = () => {
    navigate('/board/' + boardId);
  };

  const calculatePublisher = (publisherId: number): UserResponseI => {
    const publisher = states.users.filter((item) => item.id === publisherId)[0];
    return publisher;
  };

  const update = (e: any) => {
    e.preventDefault();
    console.log('updating....');
    const newItem = {
      id: Number(itemId),
      name: e.target.elements.itemName.value,
      environment: e.target.elements.environment.value,
      issue_type: Number(e.target.elements.issueType.value),
      column_id: Number(e.target.elements.defaultBoard.value),
      assignee_id:
        e.target.elements.assignee.value &&
        Number(e.target.elements.assignee.value) !== -1
          ? Number(e.target.elements.assignee.value)
          : undefined,
      reporter_id:
        e.target.elements.reporter.value &&
        Number(e.target.elements.reporter.value) !== -1
          ? Number(e.target.elements.reporter.value)
          : undefined,
      publisher_id:
        e.target.elements.publisherId.value &&
        Number(e.target.elements.publisherId.value) !== -1
          ? Number(e.target.elements.publisherId.value)
          : undefined,
      description: e.target.elements.description.value,
      priority: Number(e.target.elements.itemPriority.value),
      order: states.order,
    };

    if (itemId && itemIdP) {
      GenericService.update<ItemUpdateRequestI, ItemRequestI>(
        'item',
        Number(itemId),
        newItem
      ).then((response) => {
        if (response.success) {
          if (response.result.id) {
            insertHistoryMessage(response.result.id, 'issue updated');
          }
          navigate('/board/' + boardId);
        }
      });
    } else {
      if (updateItem && onClose) {
        updateItem(newItem);
        onClose();
      }
    }
  };

  return (
    <Center>
      <VStack w="full" width={boardIdP ? '70%' : '100%'}>
        {boardIdP && (
          <Heading>
            <Icon
              fontSize={'2xl'}
              as={ArrowBackIcon}
              color={'gray.400'}
              _hover={{ color: 'green.200' }}
              onClick={() => (boardIdP ? goBack() : onClose && onClose())}
            />
            Issue
          </Heading>
        )}
        <form onSubmit={itemId ? update : save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {itemId && (
                <GridItem>
                  <FormLabel>Id</FormLabel>
                  <Input
                    type="text"
                    value={itemId || ''}
                    name="id"
                    readOnly={true}
                    bg={'gray.100'}
                  />
                </GridItem>
              )}
              {!!states.publisherId && (
                <GridItem w="100%">
                  <FormLabel>Publisher ID</FormLabel>
                  <Input
                    readOnly={true}
                    type="text"
                    bg={'gray.50'}
                    value={calculatePublisher(states.publisherId)?.username}
                    name="publisherId"
                    onChange={handleInputChange}
                  />
                  <Errors fieldName="publisherId" />
                </GridItem>
              )}
              <GridItem w="100%">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={states.itemName}
                  name="itemName"
                  onChange={handleInputChange}
                  autoFocus
                />
                <Errors fieldName={'name'} />
              </GridItem>
              <GridItem w="100%">
                <FormLabel>Environment</FormLabel>
                <Input
                  type="text"
                  value={states.environment}
                  name="environment"
                  onChange={handleInputChange}
                />
                <Errors fieldName="environment" />
              </GridItem>

              <GridItem w="100%">
                <FormLabel>Issue type</FormLabel>
                <Select
                  placeholder="Select option"
                  name="issueType"
                  value={states.issueType}
                  onChange={handleInputChange}
                >
                  <option value="1">Task</option>
                  <option value="2">Bug fix</option>
                  <option value="3">Feature</option>
                  <option value="4">Improvement</option>
                  <option value="5">Epic</option>
                </Select>
                <Errors fieldName="issueType" />
              </GridItem>

              <GridItem w="100%">
                <FormLabel>Priority</FormLabel>
                <Select
                  placeholder="Select option"
                  name="itemPriority"
                  value={states.itemPriority}
                  onChange={handleInputChange}
                >
                  <option value="1">Highest</option>
                  <option value="2">Hight</option>
                  <option value="3">Medium</option>
                  <option value="4">Low</option>
                  <option value="5">Lowest</option>
                </Select>
                <Errors fieldName="itemPriority" />
              </GridItem>

              <GridItem w="100%">
                <FormLabel>Board</FormLabel>
                <Select
                  placeholder="Select option"
                  name="defaultBoard"
                  value={states.defaultBoard}
                  onChange={handleInputChange}
                >
                  {states.columns &&
                    states.columns.map((item: any) => {
                      let itm = item as ColumnResponseI;
                      return (
                        <option value={itm.id} key={itm.id}>
                          {itm.name}
                        </option>
                      );
                    })}
                </Select>
                <Errors fieldName="board" />
              </GridItem>

              <GridItem w="100%">
                <FormLabel>Reporter</FormLabel>
                <Select
                  placeholder="Select option"
                  name="reporter"
                  value={states.reporter}
                  onChange={handleInputChange}
                >
                  {states.users &&
                    states.users.map((item: any) => {
                      let itm = item as UserResponseI;
                      return (
                        <option value={itm.id} key={itm.id}>
                          [{itm.username}] {itm.first_name} {item.last_name}
                        </option>
                      );
                    })}
                </Select>
                <Errors fieldName="board" />
              </GridItem>

              <GridItem w="100%">
                <FormLabel>Assignee</FormLabel>
                <Select
                  placeholder="Select option"
                  name="assignee"
                  value={states.assignee}
                  onChange={handleInputChange}
                >
                  {states.users &&
                    states.users.map((item: any) => {
                      let itm = item as UserResponseI;
                      return (
                        <option value={itm.id} key={itm.id}>
                          [{itm.username}] {itm.first_name} {item.last_name}
                        </option>
                      );
                    })}
                </Select>
                <Errors fieldName="board" />
              </GridItem>
            </Grid>

            <FormLabel>Description</FormLabel>
            <Textarea
              rows={10}
              name="description"
              value={states.description}
              placeholder="Here is a sample placeholder"
              onChange={handleInputChange}
            />
            <Errors fieldName="description" />

            <Button type="submit" mt={3} w={'100%'} colorScheme="green">
              Save
            </Button>
          </FormControl>
        </form>
        <VStack w={'100%'}>{itemId && <Messages itemId={itemId} />}</VStack>
      </VStack>
    </Center>
  );
}