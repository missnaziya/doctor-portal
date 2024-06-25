import { Box } from "@mui/material";
const CheckBoxFilled = () => {
  return (
    <Box marginRight={1}>
      <label className="check-box-custom-remember">
        <input type="checkbox" />
        <span className="checkmark"></span>
      </label>
    </Box>
  );
};

export default CheckBoxFilled;
