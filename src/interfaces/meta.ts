export interface Meta {
    id: string;
    value?: string;
    label?: string;
    helperText?: string;
    name?: string;
    required?: boolean,
    onChange?: (newValue: unknown) => void,
    options?: { label: string; option?: string; value?: string }[],
    placeholder?: string,
    defaultValue?: string
}