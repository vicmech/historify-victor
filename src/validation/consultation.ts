import { ConsultationUpdate, NewConsultation } from "../types.js";

export function isNewConsultation(obj: any): obj is NewConsultation & { 
    hour: string,
    patient_id_document: string,
    physician_registration: string
} {
    return typeof obj.consultation_date == "string"
        && typeof obj.consultation_desc == "string"
        && typeof obj.patient_id_document == "string"
        && typeof obj.physician_registration == "string";
}

export function isConsultationUpdate(obj: any): obj is ConsultationUpdate & { hour: string} {
    console.log(obj);
    return typeof obj.consultation_date == "string"
        && typeof obj.consultation_desc == "string"
        && typeof obj.patient_id == "string"
        && typeof obj.physician_id == "string";
}