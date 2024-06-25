import { FormBuilder, Validators } from "react-reactive-form";

import { Dispatch } from "react";

import { useNavigate } from "react-router-dom";
import {prescriptionActions } from "../../store/Actions";

export const PrescriptionOrderingForm = FormBuilder.group({
  medication: ['', [Validators.required]],
  size: ['', [Validators.required]],
  quantity: ['', [Validators.required]],
  supply: ['', [Validators.required]],
  refills: ['', [Validators.required]],
  choose_dosing_instruction: ['', [Validators.required]],
  choose_medical_necessity: ["", [Validators.required]],
  comments: ["", [Validators.required]],
});

export const PrescriptionOrderingFormHandler = async (props:{
  handleClose: () => void
}, dispatch: Dispatch<any>) => {
  const router = useNavigate();
  PrescriptionOrderingForm.controls.medication.markAsTouched({ emitEvent: true, onlySelf: true })
  PrescriptionOrderingForm.controls.quantity.markAsTouched({ emitEvent: true, onlySelf: true })
  PrescriptionOrderingForm.controls.supply.markAsTouched({ emitEvent: true, onlySelf: true })
  PrescriptionOrderingForm.controls.refills.markAsTouched({ emitEvent: true, onlySelf: true })
  PrescriptionOrderingForm.controls.choose_dosing_instruction.markAsTouched({ emitEvent: true, onlySelf: true })
  PrescriptionOrderingForm.controls.choose_medical_necessity.markAsTouched({ emitEvent: true, onlySelf: true })
  PrescriptionOrderingForm.controls.comments.markAsTouched({ emitEvent: true, onlySelf: true })
 
  if (PrescriptionOrderingForm.invalid) {
    return;
  }

  let data = {
    medication: PrescriptionOrderingForm.value.medication,
    quantity: PrescriptionOrderingForm.value.quantity,
    supply: PrescriptionOrderingForm.value.supply,
    refills: PrescriptionOrderingForm.value.refills,
    choose_dosing_instruction: PrescriptionOrderingForm.value.choose_dosing_instruction,
    choose_medical_necessity: PrescriptionOrderingForm.value.choose_medical_necessity,
    comments: PrescriptionOrderingForm.value.comments,
  };

  dispatch(prescriptionActions.setPrescribeOrder({data:data}));
  PrescriptionOrderingForm.reset();
  props.handleClose();
  router("/home/prescribe-now", );
};
