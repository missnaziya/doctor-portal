import { Button, ButtonProps, styled } from "@mui/material";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: "#00ACBA",
  fontSize: 17,
  fontWeight: 600,
  backgroundColor: "transparent",
  border: "2px solid #00ACBA",
  borderRadius: "8px",
  boxShadow: "none",
  minWidth: 146,
  "&:hover": {
    backgroundColor: "#00ACBA",
    color: "#ffffff",
    boxShadow: 'none'
  },
  "&.MuiButton-root": {
    padding: 10,
  },
  "&.Mui-disabled": {
    color: "#d8d8d8",
    border: "2px solid #d8d8d8",
    backgroundColor: "#f2f2f2",
    boxShadow: "none",
    cursor: "default",
  }
}));

const SecondaryButton = (props: {onClick?: ()=>void , label?: string, disabled?: boolean | undefined}) => {
  return (
    <ColorButton onClick={props.onClick} className="primary-button" variant="contained" disabled={props.disabled} sx={{ width: "100%" }}>
      {props?.label}
    </ColorButton>
  );
};

export default SecondaryButton;
