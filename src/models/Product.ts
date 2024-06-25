import { Model } from './Model';
import { ProductSize } from './ProductSize';

export class Product extends Model {

  contentKey = '';
  created = '';
  daySupply = '';
  dosageForms = '';
  grxItemId = '';
  id = '';
  icon = '';
  image = '';
  isActive = false;
  isDeleted = false;
  isFavorite = false;
  isSpotlight = false;
  medicalNecessity = '';
  medicationName = '';
  modified = '';
  ndc = '';
  packageId = '';
  packageName = '';
  preservativeStatus = '';
  price = '';
  productDirections: any | null = [
    {
      id: '',
      name: '',
      product: '',
    }
  ];
  productQuantities: any | null = [
    {
      daySupply: '',
      id: '',
      product: '',
      quantityVolume: '',
      value: '',
    }
  ];
  productRefills: any | null = [];
  shortName = '';
  sub_pkg_id = '';
  size = '';
  quantity = '';
  temp = '';

  name = '';
  className = 'Product';
  is_favourite = false;
  product_id = '';
  package_id = '';
  Child: Product[] = [];
  parent_id = '';
  medication_name = '';
  short_name = '';
  // ndc = '';
  package_name = '';
  Variations: ProductSize[] = [];
  sig_dosing_instruction = '';
  medical_necessity = '';

  get getImage() {
    return '';
  }
}
