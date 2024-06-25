import { Product } from './Product';

export class Medication {
  size?: string = '';
  quantity?: string = '';
  quantityLabel?: string = '';
  // supply?: string = '';
  temperature?: string = '';
  refills?: string = '';
  choose_dosing_instruction?: string = '';
  choose_medical_necessity?: string = '';
  other_clinical_difference?: string = '';
  comments?: string = '';
  medication?: {} = '';
  price?: string = '';
  selectedMedication?: Product | null = new Product();
}
