import { Request, Response } from "express"
import { db } from "../context.js";
import { isNewPhysician, isPhysicianUpdate } from "../validation/physician.js";
import { invalidBody, unknownServerError } from "./common.js";
import { Physician } from "../types.js";

export async function searchPhysicianForm(_: Request, res: Response): Promise<void> {
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

        let searchText = document.getElementById("registration").value.trim();
        let form = document.getElementById("form");
  
        if(searchText.length > 0) {
            form.action = "/physician/update/" + searchText;
            form.submit();
        } else {
            return false;
        }
    }
</script>
<body>
    <h2>Actualizar Doctor</h2>
    <form id="form" action="" method="get" onsubmit="return submitFunction();">
        <label for="registration">Matrícula</label><br>
        <input type="text" id="registration"><br>
        <hr/><br/>
        <input type="submit" value="Buscar">
    </form>
</body>
</html>
    `);
}

export async function createPhysicianForm(_: Request, res: Response): Promise<void> {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <h2>Doctor</h2>
    <form action="" method="post">
        <p>Ingrese los datos del doctor:</p>
        <label for="registration">Matrícula</label><br>
        <input type="text" name="registration" id="registration"><br>
        <label for="gender">Género</label><br>
        <select name="gender" id="gender">
            <option value="M">Hombre</option>
            <option value="F">Mujer</option>
            <option value="X">Otro</option>
        </select><br>
        <label for="birth">Fecha de nacimiento</label><br>
        <input type="date" name="birth" id="birth"><br>
        <label for="fname">Nombre</label><br>
        <input type="text" name="fname" id="fname"><br>
        <label for="lname">Apellido</label><br>
        <input type="text" name="lname" id="lname"><br>
        <label for="specialty">Especialidad</label><br>
        <input type="text" name="specialty" id="specialty"><br>
        <hr/><br/>
        <input type="submit" value="Enviar">
    </form>
</body>
</html>
    `);
}

export async function createPhysician(req: Request, res: Response): Promise<void> {
    if (!isNewPhysician(req.body)) return invalidBody(res);
    try {
        const result = await db.insertInto('physicians')
            .values(req.body)
            .executeTakeFirstOrThrow();
        
        res.status(201).send("Created physician " + req.body.fname + " with ID " + result.insertId);
    } catch (err) {
        return unknownServerError(res, err);
    }
}

export async function updatePhysicianForm(req: Request, res: Response): Promise<void> {
    const registration: string = (req as any).id;
    let result: Physician;
    try {
        result = await db.selectFrom('physicians')
            .selectAll()
            .where("registration", "=", registration)
            .executeTakeFirstOrThrow();
    } catch (err) {
        return unknownServerError(res, err);
    }
    const birth_string = result.birth.getFullYear() + "-" + (result.birth.getMonth() + 1) + "-" + result.birth.getDate();
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <h2>Doctor</h2>
    <form action="" method="post">
        <input type="hidden" name="id" value="${result.id}" />
        <p>Ingrese los datos del doctor:</p>
        <label for="registration">Matrícula</label><br>
        <input type="text" name="registration" id="registration" value="${result.registration}"><br>
        <label for="gender">Género</label><br>
        <select name="gender" id="gender">
            <option value="M" ${result.gender === "M" ? "selected" : ""}>Hombre</option>
            <option value="F" ${result.gender === "F" ? "selected" : ""}>Mujer</option>
            <option value="X" ${result.gender === "X" ? "selected" : ""}>Otro</option>
        </select><br>
        <label for="birth">Fecha de nacimiento</label><br>
        <input type="date" name="birth" id="birth" value="${birth_string}"><br>
        <label for="fname">Nombre</label><br>
        <input type="text" name="fname" id="fname" value="${result.fname}"><br>
        <label for="lname">Apellido</label><br>
        <input type="text" name="lname" id="lname" value="${result.lname}"><br>
        <label for="specialty">Especialidad</label><br>
        <input type="text" name="specialty" id="specialty" value="${result.specialty}"><br>
        <hr/><br/>
        <input type="submit" value="Actualizar" formaction="/physician/update" />
    </form>
</body>
</html>
    `);
}

export async function updatePhysician(req: Request, res: Response): Promise<void> {
    if (!isPhysicianUpdate(req.body)) return invalidBody(res);
    try {
        const result = await db.updateTable('physicians')
            .set({ ...req.body })
            .executeTakeFirstOrThrow();

        res.status(200).send("Updated physician " + req.body.fname + ", changed " + result.numChangedRows + " rows.");
    } catch (err) {
        return unknownServerError(res, err);
    }
}