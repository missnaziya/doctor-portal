import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../interfaces/Color";
import InputMask from "react-input-mask";

export const InputExpiryDate=  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
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
        if (inputElem.value !== '__/__') {
          if (!isValidDate()) {
            helperMessage = "Invalid expiry date";
            return true;
          }
          else {
            helperMessage = meta.helperText;
          }
        }
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

  const isValidDate = () : boolean => {
    const [month, year] = inputElem.value.split('/');
    const today = new Date();
    if (month !== '__' && year !== '__') {
      const expiryDate = new Date(parseInt(`20${year}`), parseInt(month), 0);
      if (parseInt(month) > 12) {
        return false;
      }
      if (expiryDate < today) {
        return false;
      }
      else {
        helperMessage = meta.helperText;
        return true;
      }
    }
    else {
      return true;
    }
  }

  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <InputMask mask={"99/99"} {...inputElem}>
        <TextField type="tel" onKeyUp={(e) => { onlyNumberKey(e) }} required={isRequired()} label={meta.label} fullWidth color={getColor()} helperText={getError() && helperMessage} error={getError()}  />
      </InputMask>
    </FormControl>
  );
};