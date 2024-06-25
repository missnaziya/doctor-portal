import { Button, ButtonProps, styled } from "@mui/material";

import { MouseEventHandler } from "react";
import { purple } from "@mui/material/colors";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  fontSize: 17,
  fontWeight: 600,
  backgroundColor: "#00ACBA",
  border: "2px solid #00ACBA",
  borderRadius: "8px",
  boxShadow: "none",
  minWidth:160,
  "&:hover": {
    backgroundColor: "transparent",
    color: "#00ACBA",
    border: "2px solid #00ACBA",
    boxShadow: 'none'
  },
  "&.MuiButton-root": {
    padding: 10,
  },
}));

const PrimaryButton = (props:{
 label?:string
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
}) => {
  return (
    <ColorButton onClick={props.onClick} className="primary-button" variant="contained" sx={{ width: "100%" }}>
      {props?.label}
    </ColorButton>
  );
};

export default PrimaryButton;
