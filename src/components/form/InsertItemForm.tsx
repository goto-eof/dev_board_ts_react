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
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { Md5 } from 'md5-typescript';
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
import { GuiFileI } from '../../core/GuiFileI';
import { ItemAttachmentsI } from '../../core/ItemAttachmentsI';
import { DeleteResultI } from '../../core/DeleteResultI';

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
    filesListValue: '',
    estimatedTime: '',
  });

  // const [filesList, setFilesList] = useState<Array<any>>([]);
  const [guiFileList, setGuiFileList] = useState<Array<GuiFileI>>(
    new Array<GuiFileI>()
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const columns = await GenericService.getAll<
          Result<Array<ColumnResponseI>>
        >('column/all/' + boardId);
        const fields = itemId
          ? await GenericService.getById<Result<ItemAttachmentsI>>(
              'item',
              Number(itemId)
            )
          : null;

        const allUsers = await GenericService.getAll<
          Result<Array<UserResponseI>>
        >('board/board_users/' + boardId);

        setGuiFileList(fields?.result.attachments || []);
        const itemOld = fields?.result.item || {
          id: 0,
          name: '',
          environment: '',
          issue_type: 0,
          order: 0,
          priority: '3',
          description: '',
          assignee_id: 0,
          reporter_id: 0,
          publisher_id: 0,
          estimated_time: '',
          files: [],
          created_at: null,
        };
        setStates({
          ...states,
          itemName: itemOld.name,
          environment: itemOld.environment,
          itemPriority: '' + itemOld.priority,
          issueType: itemOld.issue_type,
          description: itemOld.description,
          defaultBoard: columnId || '',
          columns: columns.result,
          order: itemOld.order,
          assignee: itemOld.assignee_id || 0,
          reporter: itemOld.reporter_id || 0,
          publisherId: itemOld.publisher_id || 0,
          users: allUsers.result,
          estimatedTime: itemOld.estimated_time,
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

  const deleteAttachment = (id: number) => {
    GenericService.delete<DeleteResultI>('attachment', id).then(
      (result: DeleteResultI) => {
        if (result.success) {
          let newGuiFilesList = guiFileList.filter(
            (item: any) => item.id !== id
          );
          setGuiFileList(newGuiFilesList);
        }
      }
    );
  };

  const handleFileEvent = async (e: any) => {
    const files: any[] = e.target.files;
    setStates({ ...states, filesListValue: e.target.value });
    const newFiles: Array<GuiFileI> = [...guiFileList];
    for (const file in files) {
      if (!isNaN(Number(file))) {
        const b64 = await toBase64(files[file]);
        const hashcode = Md5.init(b64);
        if (
          guiFileList.filter((item) => item.hashcode === hashcode).length === 0
        ) {
          const toPush: GuiFileI = {
            content: b64,
            name: files[file].name,
            hashcode: hashcode,
          };
          newFiles.push(toPush);
        }
      }
    }
    setStates({ ...states, filesListValue: '' });
    setGuiFileList(newFiles);
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

  const removeGuiFile = (file: GuiFileI) => {
    setGuiFileList(
      guiFileList.filter((item) => item.hashcode !== file.hashcode)
    );
  };

  const removeFile = (item: GuiFileI) => {
    if (item.id) {
      deleteAttachment(item.id);
    } else {
      removeGuiFile(item);
    }
  };

  const printFiles = () => {
    return guiFileList.map((item) => (
      <Box key={item.hashcode}>
        <Tag
          size={'sm'}
          borderRadius="full"
          variant="solid"
          onClick={() => removeFile(item)}
          colorScheme={item.id ? 'blue' : 'green'}
        >
          <TagLabel>{item.name}</TagLabel>
          <TagCloseButton />
        </Tag>
      </Box>
    ));
  };

  const hasError = (field: string) => {
    return !!states.error.get(field);
  };

  const save = async (e: any) => {
    e.preventDefault();

    const toInsert = {
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
      estimated_time: e.target.elements.estimatedTime.value,
      files: guiFileList,
    };

    GenericService.create<ItemRequestI>('item', toInsert).then(
      (response: Result<ItemRequestI>) => {
        if (response.success) {
          if (response.result.id) {
            insertHistoryMessage(response.result.id, 'issue created');
          }
          navigate('/board/' + boardId);
        }
      }
    );
  };

  const goBack = () => {
    navigate('/board/' + boardId);
  };

  const calculatePublisher = (publisherId: number): UserResponseI => {
    const publisher = states.users.filter((item) => item.id === publisherId)[0];
    return publisher;
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      console.log('1 - baseTo64 - FILE', file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => {
        console.log(error);
        reject(error);
      };
    });
  };

  const update = async (e: any) => {
    e.preventDefault();

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
      description: e.target.elements.description.value,
      priority: Number(e.target.elements.itemPriority.value),
      order: states.order,
      estimated_time: e.target.elements.estimatedTime.value,
      files: await guiFileList,
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
        <form
          onSubmit={async (e) => {
            itemId ? update(e) : await save(e);
          }}
          style={{ width: '100%' }}
        >
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
                  <FormLabel>Publisher</FormLabel>
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

              <GridItem w="100%">
                <FormLabel>Estimated time</FormLabel>
                <Input
                  type="text"
                  value={states.estimatedTime}
                  name="estimatedTime"
                  onChange={handleInputChange}
                />
                <Errors fieldName={'estimatedTime'} />
              </GridItem>

              <GridItem w="100%">
                <FormLabel>Attachments</FormLabel>
                <input
                  id="filesList"
                  name="filesList"
                  type="file"
                  value={states.filesListValue}
                  multiple
                  accept="application/pdf, image/png, image/jpg"
                  onChange={async (e) => {
                    await handleFileEvent(e);
                  }}
                />
                <Errors fieldName={'filesList'} />
                {printFiles()}
              </GridItem>
            </Grid>

            <FormLabel>Description</FormLabel>
            <Textarea
              rows={10}
              name="description"
              value={states.description}
              placeholder=""
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
