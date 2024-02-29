import { Request, Response } from "express"
import { db } from "../context.js";
import { isNewPatient, isPatientUpdate } from "../validation/patient.js";
import { invalidBody, unknownServerError } from "./common.js";
import { Patient } from "../types.js";

export async function getOnePatient(req: Request, res: Response): Promise<void> {
    try {
        const result = await db.selectFrom('patients')
            .selectAll()
            .where('id_document', '=', (req as any).id)
            .executeTakeFirstOrThrow();

        res.status(200).send("Found patient " + result.fname + " with ID document " + result.id_document);
    } catch (err) {
        return unknownServerError(res, err);
    }
}

export async function searchPatientForm(_: Request, res: Response): Promise<void> {
    res.render('searchPatientForm');
}

export async function createPatientForm(_: Request, res: Response): Promise<void> {
    res.render('patientCreateForm');
}

export async function createPatient(req: Request, res: Response): Promise<void> {
    if (!isNewPatient(req.body)) return invalidBody(res);
    try {
        const result = await db.insertInto('patients')
            .values(req.body)
            .executeTakeFirstOrThrow();
        console.log(result);
        //res.status(201).send("Created patient " + req.body.fname + " with ID " + result.insertId);
        res.status(201).render('successTransaccion',{
            registerType : 'Paciente',
            action : 'creado'
        });
    } catch (err) {
        return unknownServerError(res, err);
    }
}

export async function updatePatientForm(req: Request, res: Response): Promise<void> {
    const id_document: string = (req as any).id;
    let result: Patient;
    try {
        result = await db.selectFrom("patients")
            .selectAll()
            .where("id_document", "=", id_document)
            .executeTakeFirstOrThrow();
    } catch (err) {
        return unknownServerError(res, err);
    }

    const birth_string = result.birth.getFullYear() + "-" 
                       + (result.birth.getMonth() + 1) + "-" 
                       + result.birth.getDate();

    res.render('updatePatientForm', {
        result : result,
        birth_string : birth_string
    });
}

export async function updatePatient(req: Request, res: Response): Promise<void> {
    if (!isPatientUpdate(req.body)) return invalidBody(res);
    try {
        const result = await db.updateTable('patients')
            .set({ ...req.body })
            .executeTakeFirstOrThrow();
console.log(result);
        res.status(200).render('successTransaccion');
    } catch (err) {
        return unknownServerError(res, err);
    }
}