import { Button, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export const Modal = (props: { handleClose: () => void; handleCancelOrder: () => void }) => {
  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-titles" onClose={props.handleClose}>
        Cancel
      </BootstrapDialogTitle>
      <DialogContent>
        <Typography className="modal_heading">Are you sure you want to cancel this order?</Typography>
      </DialogContent>
      <DialogActions>
        <Button style={{ backgroundColor: '#528097', height: 45, fontWeight: 600, width: 150, color: '#fff', borderRadius: 8 }} onClick={props.handleClose}>
          Don't Cancel
        </Button>

        <Button style={{ backgroundColor: '#C72626', height: 45, fontWeight: 600, width: 143, color: '#fff', borderRadius: 8 }} onClick={props.handleCancelOrder}>
          Cancel Order
        </Button>
      </DialogActions>
    </>
  );
};
