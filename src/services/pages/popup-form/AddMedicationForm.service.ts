import { FormBuilder, Validators } from 'react-reactive-form';

import { Dispatch } from 'react';
import { dashboardActions } from '../../../store/Actions';
import { useNavigate } from 'react-router-dom';

export const AddMedicationForm = FormBuilder.group({
  eye: ['', [Validators.required]],
  medication: ['', [Validators.required]],
  size: [''],
  quantity: ['', [Validators.required]],
  quantityLabel: [''],
  // supply: ['', [Validators.required]],
  temperature: [''],
  refills: ['', [Validators.required]],
  choose_dosing_instruction: ['', [Validators.required]],
  choose_medical_necessity: ['', [Validators.required]],
  other_clinical_difference: [''],
  comments: ['', []],
  price: ['', []]
});

export const AddMedicationHandler = async (
  props: {
    handleClose: () => void;
  },
  dispatch: Dispatch<any>
) => {
  const router = useNavigate();
  AddMedicationForm.controls.medication.markAsTouched({ emitEvent: true, onlySelf: true });
  AddMedicationForm.controls.quantity.markAsTouched({ emitEvent: true, onlySelf: true });
  AddMedicationForm.controls.supply.markAsTouched({ emitEvent: true, onlySelf: true });
  AddMedicationForm.controls.refills.markAsTouched({ emitEvent: true, onlySelf: true });
  AddMedicationForm.controls.choose_dosing_instruction.markAsTouched({ emitEvent: true, onlySelf: true });
  AddMedicationForm.controls.choose_medical_necessity.markAsTouched({ emitEvent: true, onlySelf: true });
  AddMedicationForm.controls.other_clinical_difference.markAsTouched({ emitEvent: true, onlySelf: true });

  if (AddMedicationForm.invalid) {
    return;
  }

  let data = {
    medication: AddMedicationForm.value.medication,
    quantity: AddMedicationForm.value.quantity,
    supply: AddMedicationForm.value.supply,
    refills: AddMedicationForm.value.refills,
    choose_dosing_instruction: AddMedicationForm.value.choose_dosing_instruction,
    choose_medical_necessity: AddMedicationForm.value.choose_medical_necessity,
    other_clinical_difference: AddMedicationForm.value.other_clinical_difference,
    comments: AddMedicationForm.value.comments
  };

  dispatch(dashboardActions.setMedicationData({ data: data }));
  AddMedicationForm.reset();
  props.handleClose();
  router('/home/prescribe-now');
};
