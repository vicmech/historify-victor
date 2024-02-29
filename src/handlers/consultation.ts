import { Request, Response } from "express"
import { db } from "../context.js";
import { isConsultationUpdate, isNewConsultation } from "../validation/consultation.js";
import { invalidBody, unknownServerError } from "./common.js";
import { Consultation } from "../types.js";

export async function searchConsultationForm(_: Request, res: Response): Promise<void> {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Historify - Control de historial clínico</title>
        <link rel="stylesheet" href="../globals.css" type="text/css" >
    </head>
    <script>
        function submitFunction() {
    
            let searchText = document.getElementById("id").value.trim();
            let form = document.getElementById("form");
      
            if (searchText.length > 0) {
                form.action = "/consultation/update/" + searchText;
                form.submit();
            } else {
                return false;
            }
        }
    </script>
    <body>
        <h2 class="pg--title">Actualizar Consulta</h2>
        <form class="form" id="form" action="" method="get" onsubmit="return submitFunction();">
        <div class="input--box">     
            <label class="form--label" for="id">ID de la Consulta</label><br>
            <input class="form--input" type="text" id="id"><br>
        </div>
            <input class="submit--btn" type="submit" value="Buscar">
        </form>
    </body>
    </html>
    `);
}

export async function createConsultationForm(_: Request, res: Response): Promise<void> {
    res.render('consultationCreateForm');
}

export async function createConsultation(req: Request, res: Response): Promise<void> {
    if (!isNewConsultation(req.body)) return invalidBody(res);
    try {
        const patient_id = (await db.selectFrom('patients')
            .select('id')
            .where("id_document", "=", req.body.patient_id_document)
            .executeTakeFirstOrThrow()).id;
            console.log('paciente');
        const physician_id = (await db.selectFrom('physicians')
            .select('id')
            .where("registration", "=", req.body.physician_registration)
            .executeTakeFirstOrThrow()).id;
            console.log('doctor');
        const values = {
            consultation_date: req.body.consultation_date + " " + req.body.hour + ":00",
            consultation_desc: req.body.consultation_desc,
            patient_id,
            physician_id,
            status : 'PENDING'
        };
        const result = await db.insertInto('consultations')
            .values(values)
            .executeTakeFirstOrThrow();
        console.log(result);
        res.status(201).render('successTransaccion',{
            registerType : 'Consulta',
            action : 'creada'
        }
        );
    } catch (err) {
        return unknownServerError(res, err);
    }
}

/*export async function getDoctorConsultations(req:Request, res : Response): Promise<void>{
    const Doctor_id: number = Number((req as any).body.id);
    let result : Consultation[]
    try {
        result = await db.selectFrom("consultations")
            .selectAll()
            .where("physician_id", "=", Doctor_id)
    } catch (err) {
        return unknownServerError(res, err);
    }

    res.render('consultationUpdate');
}*/

export async function getDoctorConsultations(_ : Request, res : Response) : Promise<void>{
    let consultations : Consultation[];
    try {
        consultations = await db.selectFrom("consultations")
            .selectAll()
            .where("physician_id", "=", 1)
            .execute();
            console.log(consultations);
    } catch (err) {
        console.log(err);
    }
    res.render('consultationUpdate');
}

export async function updateConsultationForm(req: Request, res: Response): Promise<void> {
    const id: number = Number((req as any).id);
    let result: Consultation;
    try {
        result = await db.selectFrom("consultations")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirstOrThrow();
            const consultation_date_string = (result.consultation_date.getFullYear() + "-"
                                           + String(result.consultation_date.getMonth() + 1).padStart(2,'0') + "-"
                                           + result.consultation_date.getDate().toString().padStart(2,'0'));
            const consultation_hour_string = (result.consultation_date.getHours() + ":"
                                           + result.consultation_date.getMinutes() + ":00").toString();
                    
            console.log(consultation_date_string);
            res.render('consultationUpdate', {
                consultation : result,
                consultation_date_string : consultation_date_string,
                consultation_hour_string: consultation_hour_string
            });
    } catch (err) {
        return unknownServerError(res, err);
    }

    console.log(result);
    
    /*res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Historify - Control de historial clínico</title>
        <link rel="stylesheet" href="../../globals.css" type="text/css">
    </head>
    <body>
        <h2 class="pg--title">Consulta</h2>
        <form class="form" action="" method="post">
            <input type="hidden" name="id" value="${result.id}" />
            <input type="hidden" name="patient_id" value="${result.patient_id}" />
            <input type="hidden" name="physician_id" value="${result.physician_id}" />
            <h3 class="form--title">Ingrese los datos de la consulta</h3>
            <div class="input--box">
                <label for="consultation_date" class="form--label">Fecha</label><br>
                <input type="date" name="consultation_date" class="form--input" id="consultation_date" value="${consultation_date_string}"><br>
            </div>
    
            <div class="input--box">
                <label for="hour" class="form--label">Hora</label><br>
                <input type="time" name="hour" class="form--input" id="hour" value="${consultation_hour_string}"><br>
            </div>
            
            <div class="input--box">
                <label for="consultation_desc" class="form--label">Descripción de la consulta</label><br>
                <input type="text" name="consultation_desc"  class="form--input" id="consultation_desc" value="${result.consultation_desc}"><br>
            </div>
    
            <div class="input--box">
                <label class="form--label">ID del paciente</label><br>
                <input type="text"  class="form--input" value="${result.patient_id}" disabled><br>
            </div>
            
            <div class="input--box">
                <label class="form--label">ID del doctor</label><br>
                <input type="text"  class="form--input" value="${result.physician_id}" disabled><br>
            </div>
            
            <div class="input--box">
                <label for="diagnosis" class="form--label">Diagnóstico</label><br>
                <textarea name="diagnosis" cols="30" rows="5"  class="form--input"></textarea><br>
            </div>
            
            <div class="input--box">
                <label for="observations" class="form--label">Observaciones</label><br>
                <textarea name="observations" rows="5" cols="30"  class="form--input"></textarea><br>
            </div>
    
            <hr/><br/>
            <input type="submit" value="Actualizar" formaction="/consultation/update/" class="submit--btn" />
        </form>
    </body>
    </html>
    `);*/
}

export async function updateConsultation(req: Request, res: Response): Promise<void> {
    if (!isConsultationUpdate(req.body)) return invalidBody(res);
    try {
        const values = {
            consultation_date: req.body.consultation_date + " " + req.body.hour,
            consultation_desc: req.body.consultation_desc,
            diagnosis: req.body.diagnosis,
            observations: req.body.observations,
            patient_id: req.body.patient_id,
            physician_id: req.body.physician_id
        };
        console.log(values);
        if(req.body.id){
            await db.updateTable('consultations')
                .set(values)
                .where('id', '=', req.body?.id)
                .executeTakeFirstOrThrow();
            res.status(201).render('successTransaccion',{
                registerType : 'Consulta',
                action : 'modificada'
            });
        }

    } catch (err) {
        return unknownServerError(res, err);
    }
}