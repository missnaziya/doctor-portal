export interface CategoryInterface {
    package_id: string;
    Child: CategoryInterface[];
    name: string;
    parent_id: string;
}