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

        let searchText = document.getElementById("id_document").value.trim();
        let form = document.getElementById("form");
  
        if(searchText.length > 0) {
            form.action = "/patient/update/" + searchText;
            form.submit();
        } else {
            return false;
        }
    }
</script>
<body>
    <h2>Actualizar Paciente</h2>
    <form id="form" action="" method="get" onsubmit="return submitFunction();">
        <label for="id_document">Cédula</label><br>
        <input type="text" id="id_document"><br>
        <hr/><br/>
        <input type="submit" value="Buscar">
    </form>
</body>
</html>
    `);
}

export async function createPatientForm(_: Request, res: Response): Promise<void> {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <h2>Paciente</h2>
    <form action="" method="post">
        <h3>Ingrese los datos del paciente</h3>
        <label for="id_document">Cédula</label><br>
        <input type="text" name="id_document" id="id_document"><br>
        <label for="gender">Género</label><br>
        <select name="gender" id="gender">
            <option value="M">Hombre</option>
            <option value="F">Mujer</option>
            <option value="X">Otro</option>
        </select><br>
        <label for="birth">Fecha de nacimiento</label><br>
        <input type="date" name="birth" id="birth"><br>
        <label for="fname">Nombres</label><br>
        <input type="text" name="fname" id="fname"><br>
        <label for="lname">Apellidos</label><br>
        <input type="text" name="lname" id="lname"><br>
        <label for="phone">Teléfono</label><br>
        <input type="tel" name="phone" id="phone"><br>
        <label for="area">Localidad</label><br>
        <select name="area" id="area">
        <option value="BAR">Barcelona</option>
        <option value="PLC">Puerto La Cruz</option>
        <option value="LEC">Lechería</option>
        </select><br>
        <label for="patient_desc">Descripción</label><br>
        <input type="text" name="patient_desc" id="patient_desc"><br>
        <hr/><br/>
        <input type="submit" value="Enviar">
    </form>
</body>
</html>
    `);
}

export async function createPatient(req: Request, res: Response): Promise<void> {
    if (!isNewPatient(req.body)) return invalidBody(res);
    try {
        const result = await db.insertInto('patients')
            .values(req.body)
            .executeTakeFirstOrThrow();
        
        res.status(201).send("Created patient " + req.body.fname + " with ID " + result.insertId);
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
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <h2>Paciente</h2>
    <form action="" method="post">
        <input type="hidden" name="id" value="${result.id}" />
        <h3>Ingrese los datos del paciente</h3>
        <label for="id_document">Cédula</label><br>
        <input type="text" name="id_document" id="id_document" value="${result.id_document}"><br>
        <label for="gender">Género</label><br>
        <select name="gender" id="gender">
            <option value="M" ${result.gender === "M" ? "selected" : ""}>Hombre</option>
            <option value="F" ${result.gender === "F" ? "selected" : ""}>Mujer</option>
            <option value="X" ${result.gender === "X" ? "selected" : ""}>Otro</option>
        </select><br>
        <label for="birth">Fecha de nacimiento</label><br>
        <input type="date" name="birth" id="birth" value="${birth_string}"><br>
        <label for="fname">Nombres</label><br>
        <input type="text" name="fname" id="fname" value="${result.fname}"><br>
        <label for="lname">Apellidos</label><br>
        <input type="text" name="lname" id="lname" value="${result.lname}"><br>
        <label for="phone">Teléfono</label><br>
        <input type="tel" name="phone" id="phone" value="${result.phone}"><br>
        <label for="area">Localidad</label><br>
        <select name="area" id="area">
            <option value="BAR" ${result.area === "BAR" ? "selected" : ""}>Barcelona</option>
            <option value="PLC" ${result.area === "PLC" ? "selected" : ""}>Puerto La Cruz</option>
            <option value="LEC" ${result.area === "LEC" ? "selected" : ""}>Lechería</option>
        </select><br>
        <label for="patient_desc">Descripción</label><br>
        <input type="text" name="patient_desc" id="patient_desc" value="${result.patient_desc}"><br>
        <hr/><br/>
        <input type="submit" value="Actualizar" formaction="/patient/update/" />
    </form>
</body>
</html>
    `);
}

export async function updatePatient(req: Request, res: Response): Promise<void> {
    if (!isPatientUpdate(req.body)) return invalidBody(res);
    try {
        const result = await db.updateTable('patients')
            .set({ ...req.body })
            .executeTakeFirstOrThrow();
        
        res.status(200).send("Updated patient " + req.body.fname + ", changed " + result.numUpdatedRows + " rows.");
    } catch (err) {
        return unknownServerError(res, err);
    }
}