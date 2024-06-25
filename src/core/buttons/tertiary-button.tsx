import { Button, ButtonProps, styled } from "@mui/material";

import { MouseEventHandler } from "react";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: "#032439",
  fontSize: 17,
  fontWeight: 600,
  backgroundColor: "transparent",
  border: "1px solid #032439",
  borderRadius: "8px",
  boxShadow: "none",
  minWidth: "150px",

  "&:hover": {
    backgroundColor: "#032439",
    color: "#ffffff",
    boxShadow: 'none'
  },
  "&.MuiButton-root": {
    padding: 10,
  },
}));

const TertiaryButton = (props: {
  label?:string
  onClick?:MouseEventHandler<HTMLButtonElement> | undefined 
}) => {
  return (
    <ColorButton onClick={props.onClick} className="primary-button" variant="contained" sx={{ width: "100%" }}>
      {props?.label}
    </ColorButton>
  );
};

export default TertiaryButton;
