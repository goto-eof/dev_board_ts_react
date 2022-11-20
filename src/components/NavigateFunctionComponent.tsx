import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customInterceptor } from '../core/LoginInterceptor';

export function NavigateFunctionComponent() {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);

  {
    /* only run setup once */
  }
  if (!ran) {
    customInterceptor(navigate);
    setRan(true);
  }
  return <></>;
}
