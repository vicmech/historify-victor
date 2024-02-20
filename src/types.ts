import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export interface Database {
    specialties:   SpecialtyTable
    physicians:    PhysicianTable
    patients:      PatientTable
    consultations: ConsultationTable
    users:         UserTable
}

export interface SpecialtyTable {
    id: Generated<number>
    title: string
}

export type Specialty       = Selectable<SpecialtyTable>
export type NewSpecialty    = Insertable<SpecialtyTable>
export type SpecialtyUpdate = Updateable<SpecialtyTable>

export interface PhysicianTable {
    id: Generated<number>
    fname: string
    lname: string
    gender: 'M' | 'F' | 'X'
    birth: ColumnType<Date, string, string>
    registration: string
    specialty: string
}

export type Physician       = Selectable<PhysicianTable>
export type NewPhysician    = Insertable<PhysicianTable>
export type PhysicianUpdate = Updateable<PhysicianTable>

export interface PatientTable {
    id: Generated<number>
    id_document: string
    fname: string
    lname: string
    gender: 'M' | 'F' | 'X'
    patient_desc: string
    birth: ColumnType<Date, string, string>
    area: 'BAR' | 'PLC' | 'LEC'
    phone: string
}

export type Patient       = Selectable<PatientTable>
export type NewPatient    = Insertable<PatientTable>
export type PatientUpdate = Updateable<PatientTable>

export interface ConsultationTable {
    id: Generated<number>
    consultation_date: ColumnType<Date, string, string>
    consultation_desc: string
    diagnosis: string | null
    observations: string | null
    register_date: Generated<ColumnType<Date, string, string>>

    patient_id: number
    physician_id: number
}

export type Consultation       = Selectable<ConsultationTable>
export type NewConsultation    = Insertable<ConsultationTable>
export type ConsultationUpdate = Updateable<ConsultationTable>

export interface UserTable {
    id: Generated<number>
    username: string
    passw: string
    is_root: boolean
}

export type User       = Selectable<UserTable>
export type NewUser    = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>