import { Center, VStack, Heading, Button, Checkbox } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Result from '../core/ResultI';
import { UserResponseI } from '../core/UserResponseI';
import ResultI from '../core/ResultI';

export default function ShareDashboard() {
  const [states, setStates] = useState({
    users: new Array<UserResponseI>(),
    checkboxes: new Map<number, boolean>(),
  });

  let { boardId } = useParams();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    GenericService.getAll<Result<Array<UserResponseI>>>(
      'user/all-for-share'
    ).then((all_users: Result<Array<UserResponseI>>) => {
      if (all_users.success) {
        console.log(all_users);

        GenericService.getAll<Result<Array<number>>>(
          'board/board_is_shared_with/' + boardId
        ).then((shared_with) => {
          if (shared_with.success) {
            let checkboxes = new Map<number, boolean>();
            all_users.result.forEach((item) =>
              checkboxes.set(item.id, shared_with.result.indexOf(item.id) > -1)
            );
            setStates({
              ...states,
              users: all_users.result,
              checkboxes,
            });
          }
        });
      }
    });
  };

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const handleInputChange = (userId: number) => {
    console.log(userId);
    let newMap = new Map(states.checkboxes);
    newMap.set(userId, !states.checkboxes.get(userId) || false);
    console.log(newMap.get(userId));
    if (newMap.get(userId)) {
      GenericService.post<Result<boolean>>(
        'board/share/' + boardId + '/' + userId
      ).then((result: any) => {
        console.log(result);
        if (result.success) {
          console.log(result);
          setStates({ ...states, checkboxes: newMap });
        }
      });
    } else {
      GenericService.post<Result<boolean>>(
        'board/unshare/' + boardId + '/' + userId
      ).then((result: any) => {
        console.log(result);
        if (result.success) {
          console.log(result);
          setStates({ ...states, checkboxes: newMap });
        }
      });
    }
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Share dashboard</Heading>
        {states.users &&
          states.users.map((user) => {
            return (
              <Checkbox
                key={user.id}
                isChecked={states.checkboxes.get(user.id)}
                onChange={(e) => handleInputChange(user.id)}
              >
                {user.id} - {user.username}
              </Checkbox>
            );
          })}
      </VStack>
      <Button onClick={goToHome}>Home</Button>
    </Center>
  );
}
