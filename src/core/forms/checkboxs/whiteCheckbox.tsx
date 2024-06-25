import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";

import { Box } from "@mui/material";
import { Meta } from "../../../interfaces/meta";

export const WhiteCheckbox =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  return (
    <Box marginRight={1}>
      <label className="check-box-white">
        <input type="checkbox" />
        <span className="checkmark_product"></span>
      </label>
    </Box>
  );
};
