import { StyledComponent } from "@emotion/styled";
import {LinearProgress} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {LinearProgressProps} from "@mui/material/LinearProgress";

// Create a thick linear progress bar that has rounded corners
export const BigLinearProgress = styled(LinearProgress)(({}) => ({
  height: 10,
  borderRaidus: 5,
}));

// Create a hybrid progress bar that will be determinate when value is < 100
// when value == 100 it will switch to an indeterminate bar after switchDelay milliseconds
// switchDelay default: 1000ms
// variant default: normal
export function HybridLinear(data: {value: number, variant?: 'normal' | 'big', switchDelay?: number, linearProps?: LinearProgressProps}) {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (data.value === 100) {
      timeout = setTimeout(() => {
        setFinished(true);
      }, data.switchDelay ?? 1000);
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [data.value]);

  let Comp: StyledComponent<LinearProgressProps & any, {}, {}> | ((props: LinearProgressProps) => JSX.Element);
  if (data.variant === 'big') {
    Comp = BigLinearProgress;
  } else {
    Comp = LinearProgress;
  }

  return (
    <>
      {finished === false && <Comp {...data.linearProps} variant="determinate" value={data.value} />}
      {finished === true && <Comp {...data.linearProps} variant="indeterminate" />}
    </>
  )
}