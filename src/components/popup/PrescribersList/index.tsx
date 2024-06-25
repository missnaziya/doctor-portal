import React, { useEffect } from 'react';
import { User } from '../../../models/User';
import { profileActions } from '../../../store/Actions';
import { useAppDispatch } from '../../../store';
import { useAppSelector } from '../../../store';
import { Box, Grid, DialogTitle, IconButton, } from '@mui/material';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import PrimaryButton from '../../../core/buttons/primary-button';
import { FormBuilder, Validators } from 'react-reactive-form';
import { InputSelect } from '../../../core/forms/inputs/InputSelect';
import CloseIcon from '@mui/icons-material/Close';

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

export const SelectPrescriberForm = FormBuilder.group({
  prescriber: ['', [Validators.required]]
});

export const PrescribersList = (props: { prescribersList: User[]; handleClose: (prescriber: User | null) => void }) => {

  const user: User = useAppSelector(state => state.profileReducer.user);

  // form handler
  const SelectPrescriberFormHandler = async () => {
    SelectPrescriberForm.controls.prescriber.markAsTouched({ emitEvent: true, onlySelf: true });
    
    if (SelectPrescriberForm.invalid) {
      return;
    }

    if (SelectPrescriberForm?.value?.prescriber?.accountId === user?.activePrescriber?.accountId) {
      handleClose();
      return;
    }

    props.handleClose(SelectPrescriberForm.value.prescriber);
  };

  // close the dialog
  const handleClose = () => {
    props.handleClose(null);
  }

  // set the already set precriber
  useEffect(() => {
    const accountId: string = user?.activePrescriber?.accountId;
    let index: number = props?.prescribersList?.findIndex((prescriber: any) => prescriber?.accountId === accountId);
    if (index !== -1) {
      SelectPrescriberForm.patchValue({
        prescriber: props?.prescribersList[index]
      });
    }
  }, []);

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}></BootstrapDialogTitle>
      <Box style={{ margin: 'auto', width: '90%' }}>
        <Grid item xs={12} sm={12} md={12} lg={12} id="add_medication_form" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FieldGroup
            control={SelectPrescriberForm}
            render={({ get, invalid }) => (
              <FieldControl
                name="prescriber"
                render={InputSelect}
                meta={{
                  name: 'prescriber',
                  label: 'Select Prescriber',
                  placeholder: 'Choose Prescriber',
                  options: props?.prescribersList?.length > 0 ? (props?.prescribersList as User[]).map((item: User) => ({ label: `${item?.firstName} ${item?.lastName}` , value: item as any })) : []
                }}
              />
            )}
          />
          <Box style={{ width: '230px' }}>
            <PrimaryButton label={'Continue'} onClick={SelectPrescriberFormHandler}></PrimaryButton>
          </Box>
        </Grid>
      </Box>
    </>
  );
};
