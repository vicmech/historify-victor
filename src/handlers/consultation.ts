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
</head>
<script>
    function submitFunction() {

        let searchText = document.getElementById("id").value.trim();
        let form = document.getElementById("form");
  
        if(searchText.length > 0) {
            form.action = "/consultation/update/" + searchText;
            form.submit();
        } else {
            return false;
        }
    }
</script>
<body>
    <h2>Actualizar Consulta</h2>
    <form id="form" action="" method="get" onsubmit="return submitFunction();">
        <label for="id">ID de la Consulta</label><br>
        <input type="text" id="id"><br>
        <hr/><br/>
        <input type="submit" value="Buscar">
    </form>
</body>
</html>
    `);
}

export async function createConsultationForm(_: Request, res: Response): Promise<void> {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <h2>Consulta</h2>
    <form action="" method="post">
        <h3>Ingrese los datos de la consulta</h3>
        <label for="consultation_date">Fecha</label><br>
        <input type="date" name="consultation_date" id="consultation_date"><br>
        <label for="hour">Hora</label><br>
        <input type="time" name="hour" id="hour"/><br>
        <label for="consultation_desc">Descripción de la consulta</label><br>
        <input type="text" name="consultation_desc" id="consultation_desc"><br>
        <label for="patient_id_document">Cédula del paciente</label><br>
        <input type="text" name="patient_id_document" id="patient_id_document"><br>
        <label for="physician_registration">Matrícula del doctor</label><br>
        <input type="text" name="physician_registration" id="physician_registration"><br>
        <hr/><br/>
        <input type="submit" value="Enviar">
    </form>
</body>
</html>
    `);
}

export async function createConsultation(req: Request, res: Response): Promise<void> {
    if (!isNewConsultation(req.body)) return invalidBody(res);
    try {
        const patient_id = (await db.selectFrom('patients')
            .select('id')
            .where("id_document", "=", req.body.patient_id_document)
            .executeTakeFirstOrThrow()).id;
        const physician_id = (await db.selectFrom('physicians')
            .select('id')
            .where("registration", "=", req.body.physician_registration)
            .executeTakeFirstOrThrow()).id;
        const values = {
            consultation_date: req.body.consultation_date + " " + req.body.hour + ":00",
            consultation_desc: req.body.consultation_desc,
            patient_id,
            physician_id
        };
        const result = await db.insertInto('consultations')
            .values(values)
            .executeTakeFirstOrThrow();
        
        res.status(201).send("Created consultation with ID " + result.insertId);
    } catch (err) {
        return unknownServerError(res, err);
    }
}

export async function updateConsultationForm(req: Request, res: Response): Promise<void> {
    const id: number = Number((req as any).id);
    let result: Consultation;
    try {
        result = await db.selectFrom("consultations")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirstOrThrow();
    } catch (err) {
        return unknownServerError(res, err);
    }
    const consultation_date_string = result.consultation_date.getFullYear() + "-"
                                   + (result.consultation_date.getMonth() + 1) + "-"
                                   + result.consultation_date.getDate();
    const consultation_hour_string = result.consultation_date.getHours() + ":"
                                   + result.consultation_date.getMinutes() + ":00";
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <h2>Consulta</h2>
    <form action="" method="post">
        <input type="hidden" name="id" value="${result.id}" />
        <input type="hidden" name="patient_id" value="${result.patient_id}" />
        <input type="hidden" name="physician_id" value="${result.physician_id}" />
        <h3>Ingrese los datos de la consulta</h3>
        <label for="consultation_date">Fecha</label><br>
        <input type="date" name="consultation_date" id="consultation_date" value="${consultation_date_string}"><br>
        <label for="hour">Hora</label><br>
        <input type="time" name="hour" id="hour" value="${consultation_hour_string}"><br>
        <label for="consultation_desc">Descripción de la consulta</label><br>
        <input type="text" name="consultation_desc" id="consultation_desc" value="${result.consultation_desc}"><br>
        <label>ID del paciente</label><br>
        <input type="text" value="${result.patient_id}" disabled><br>
        <label>ID del doctor</label><br>
        <input type="text" value="${result.physician_id}" disabled><br>
        <label for="diagnosis">Diagnóstico</label><br>
        <textarea name="diagnosis" cols="30" rows="5"></textarea><br>
        <label for="observations">Observaciones</label><br>
        <textarea name="observations" rows="5" cols="30"></textarea><br>
        <hr/><br/>
        <input type="submit" value="Actualizar" formaction="/consultation/update/" />
    </form>
</body>
</html>
    `);
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
        const result = await db.updateTable('consultations')
            .set(values)
            .executeTakeFirstOrThrow();

        res.status(200).send("Updated consultation " + req.body.id + ", changed " + result.numUpdatedRows + " rows.");
    } catch (err) {
        return unknownServerError(res, err);
    }
}