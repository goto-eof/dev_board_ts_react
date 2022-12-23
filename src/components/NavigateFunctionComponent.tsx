import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customInterceptor } from '../interceptor/LoginInterceptor';
interface NavigateFunctionComponentProps {
  toggleChangedLocalStorage: (updatedLocalStorage: boolean) => void;
}
export function NavigateFunctionComponent({
  toggleChangedLocalStorage,
}: NavigateFunctionComponentProps) {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);

  if (!ran) {
    customInterceptor(navigate, toggleChangedLocalStorage);
    setRan(true);
  }
  return <></>;
}
