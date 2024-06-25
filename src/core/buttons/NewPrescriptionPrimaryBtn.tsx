import { Button, ButtonProps, styled } from "@mui/material";

import { purple } from "@mui/material/colors";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
//   color: theme.palette.getContrastText(purple[500]),
  fontSize: 16,
  fontWeight: 600,
  backgroundColor: "#00ACBA",
  border: "2px solid #00ACBA",
  borderRadius: "24px",
  color: "#FFFFFF",
  boxShadow: "none",
  minWidth:200,
  height:48,
  "&:hover": {
    backgroundColor: "#00ACBA",
    color: "#FFFFFF",
    border: "2px solid #00ACBA",
    boxShadow: 'none'
  },
  "&.MuiButton-root": {
    padding: 10,
  },
}));

const NewPrescriptionPrimaryBtn = (props: {
  onClick?: () => void,
  label?: string
}) => {
  return (
    <ColorButton onClick={props.onClick} className="primary-button" variant="contained" sx={{ width: "100%" }}>
      {props?.label}
    </ColorButton>
  );
};

export default NewPrescriptionPrimaryBtn;
