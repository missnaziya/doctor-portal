import { AxiosHeaders } from "axios";

export interface AxiosHeadersInterface extends AxiosHeaders {
    Authorization: string
}