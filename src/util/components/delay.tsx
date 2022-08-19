import {useEffect, useState} from "react";

export function Delay(data: {children?: JSX.Element, delayMS?: number}) {
  const [visible, setVisible] = useState(false);
  const delay = data.delayMS ?? 1000;

  useEffect(() => {
    let handle = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => {
      clearTimeout(handle);
    }
  }, [delay])

  return (
    <>
      {visible && data.children}
    </>
  );
}
