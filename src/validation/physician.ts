import { NewPhysician, PatientUpdate } from "../types.js";
import { isOneOf } from "./common.js";

export function isNewPhysician(obj: any): obj is NewPhysician {
    return typeof obj.birth == "string"
        && typeof obj.registration == "string"
        && typeof obj.fname == "string"
        && typeof obj.lname == "string"
        && isOneOf<string>(obj.gender, 'M', 'F', 'X')
        && typeof obj.specialty == "string";
}

export function isPhysicianUpdate(obj: any): obj is PatientUpdate {
    return isNewPhysician(obj);
}