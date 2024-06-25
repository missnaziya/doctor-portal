import { Medication } from './Medication';
import { PatientInterface } from '../interfaces/patient';

export class Block {
  patients: PatientInterface[] = [];
  prescriptions: Medication[] = [];
}

export class Order {
  billTo: {
    type: string;
    value: string;
  } = {
    type: '',
    value: ''
  };

  shipTo: {
    type: string;
    value: string;
  } = {
    type: '',
    value: ''
  };

  comment: string = '';
  credit_card: string = '';
  needByDate: string = '';
  selectPrescriber: string = '';
  selectedPrescriberName: string = '';
  npi: string = '';

  blocks: Block[] = [
    {
      patients: [],
      prescriptions: []
    }
  ];
}
