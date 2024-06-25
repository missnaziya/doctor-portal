import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../interfaces/Color";
import InputMask from "react-input-mask";

export const InputTextCC=  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  let helperMessage = meta.helperText;
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
      else {
        let val = inputElem.value.replace(/\s/g, '').replace(/_/g, '');
        if (val.length !== 0) {
          if (val.charAt(0) === '3') {
            if (!checkLength15(val)) {
              helperMessage = "Card number should be of 15 digits long"
              return true;
            }  
          }
          else if (!checkLength16(val)) {
              helperMessage = "Card number should be of 16 digits long"
              return true;
          }          
          else {
            helperMessage = meta.helperText;
            return false;
          }
        }
      }
    }
    return false;
  };

  const isRequired = () => {
    if (typeof meta.required != 'undefined') {
      return meta.required
    }
    return true;
  }

  const checkLength15 = (val: string): boolean => {
    return (val.length === 15);
  }

  const checkLength16 = (val: string): boolean => {
    return (val.length === 16);
  }

  const onlyNumberKey = (evt: React.KeyboardEvent<HTMLDivElement>): boolean => {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) ) {
      evt.preventDefault();
      return false;
    }
    return true;
  }

  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <InputMask mask={inputElem.value.charAt(0) === '3' ? "9999 9999 9999 999" : "9999 9999 9999 9999"} {...inputElem}>
        <TextField type="tel" onKeyPress={(e)  => onlyNumberKey(e)} required={isRequired()} label={meta.label} fullWidth color={getColor()} helperText={getError() && helperMessage} error={getError()} />
      </InputMask>
    </FormControl>
  );
};
