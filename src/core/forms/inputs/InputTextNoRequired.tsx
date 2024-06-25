import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../../interfaces/Color";
import { Meta } from "../../../interfaces/meta";

export const InputTextNoRequired =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  const inputElem = handler();
  inputElem.value = meta.value ?? '';
  
  const getColor = () => {
    if (touched) {
      if (hasError("required")) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getError = () => {
    if (touched) {
      if (hasError("required")) {
        return true;
      }
      return false;
    }

    return false;
  };

  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <TextField label={meta.label} fullWidth color={getColor()} helperText={getError() && meta.helperText} error={getError()} {...inputElem} />
    </FormControl>
  );
};
