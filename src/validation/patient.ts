import { NewPatient, PatientUpdate } from "../types.js";
import { isOneOf } from "./common.js";

export function isNewPatient(obj: any): obj is NewPatient {
    return typeof obj.birth == "string"
        && typeof obj.id_document == "string"
        && typeof obj.fname == "string"
        && typeof obj.lname == "string"
        && isOneOf<string>(obj.gender, 'M', 'F', 'X')
        && typeof obj.patient_desc == "string"
        && isOneOf<string>(obj.area, "BAR", "PLC", "LEC")
        && typeof obj.phone == "string";
}

export function isPatientUpdate(obj: any): obj is PatientUpdate {
    return isNewPatient(obj);
}