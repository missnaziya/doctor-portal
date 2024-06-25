import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../../interfaces/Color";
import InputMask from "react-input-mask";

export const InputPhone=  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  const inputElem = handler();
  
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

    if (typeof meta.required != 'undefined' && meta.required === false) {
      return false;
    }

    if (touched) {
      if (hasError("required")) {
        return true;
      }
      return false;
    }

    return false;
  };

  const isRequired = () => {
    if (typeof meta.required != 'undefined') {
      return meta.required
    }
    return true;
  }

  const onlyNumberKey = (evt: React.KeyboardEvent<HTMLDivElement>): boolean => {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      evt.preventDefault();
      return false;
    }
    return true;
  }

  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <InputMask mask={"(999) 999-9999"} {...inputElem}>
        <TextField type="tel" onKeyPress={(e)  => onlyNumberKey(e)} required={isRequired()} label={meta.label} fullWidth color={getColor()} helperText={getError() && meta.helperText} error={getError()}  />
      </InputMask>
    </FormControl>
  );
};
