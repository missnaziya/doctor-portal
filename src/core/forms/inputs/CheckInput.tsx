import { FormArray, FormControl, FormGroup } from "react-reactive-form";

import { Box } from "@mui/material";

export const CheckInput = (control: FormArray | FormControl | FormGroup) => {
  const { handler} = control;
  const inputElem = handler("checkbox", "");
  return (
    <Box marginRight={1}>
      <label className="check-input">
        <input {...inputElem}/>
        <span className="checkmark"></span>
      </label>
    </Box>
  );
};
