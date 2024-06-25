import { Box } from "@mui/material";
export const CustomCheckBoxWhite = () => {
  return (
    <Box marginRight={1}>
      <label className="check-box-custom-remember-white">
        <input type="checkbox" />
        <span className="checkmark_white"></span>
      </label>
    </Box>
  );
};
