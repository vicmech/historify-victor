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
        <link rel="stylesheet" href="../globals.css" type="text/css">
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
        <h2 class="pg--title">Actualizar Doctor</h2>
        <form class="form" id="form" action="" method="get" onsubmit="return submitFunction();">
        <div class="input--box">     
            <label class="form--label" for="registration">Matrícula</label>
            <input class="form--input" type="text" id="registration">
        </div>
            <input class="submit--btn" type="submit" value="Buscar">
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
        <link rel="stylesheet" href="../globals.css" type="text/css">
    </head>
    <body>
        <h2 class="pg--title">Doctor</h2>
        <form class="form" action="" method="post">
            <p class="form--title">Ingrese los datos del doctor:</p>
            <div class="input--box">
                <label class="form--label" for="registration">Matrícula</label>
                <input class="form--input" type="text" name="registration" id="registration">
            </div>
            <div class="input--box">
                <label class="form--label" for="gender">Género</label>
                <select name="gender" id="gender" class="form--input">
                    <option value="M">Hombre</option>
                    <option value="F">Mujer</option>
                    <option value="X">Otro</option>
                </select>
            </div>
            <div class="input--box">
                <label class="form--label" for="birth">Fecha de nacimiento</label>
                <input class="form--input" type="date" name="birth" id="birth">
            </div>
            <div class="input--box">
                <label class="form--label" for="fname">Nombre</label>
                <input class="form--input" type="text" name="fname" id="fname">
            </div>
            <div class="input--box">
                <label class="form--label" for="lname">Apellido</label>
                <input class="form--input" type="text" name="lname" id="lname">
            </div>
            <div class="input--box">
                <label class="form--label" for="specialty">Especialidad</label>
            <input class="form--input" type="text" name="specialty" id="specialty">
            </div>
            <input class="submit--btn" type="submit" value="Enviar">
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
        <link rel="stylesheet" href="../../globals.css" type="text/css">
    </head>
    <body>
        <h2 class="pg--title">Doctor</h2>
        <form class="form" action="" method="post">
            <input type="hidden" name="id" value="${result.id}" />
            <p class="form--title">Ingrese los datos del doctor:</p>
    
            <div class="input--box">
                <label for="registration" class="form--label">Matrícula</label>
                <input type="text" name="registration" class="form--input" id="registration" value="${result.registration}">
            </div>
            
            <div class="input--box">
                <label for="gender" class="form--label">Género</label>
            <select name="gender" class="form--input" id="gender">
                <option value="M" ${result.gender === "M" ? "selected" : ""}>Hombre</option>
                <option value="F" ${result.gender === "F" ? "selected" : ""}>Mujer</option>
                <option value="X" ${result.gender === "X" ? "selected" : ""}>Otro</option>
            </select>
            </div>
            
            <div class="input--box">
                <label for="birth" class="form--label">Fecha de nacimiento</label>
                <input type="date" name="birth" class="form--input" id="birth" value="${birth_string}">
            </div>
            
            <div class="input--box">
                <label for="fname" class="form--label">Nombre</label>
            <input type="text" name="fname" class="form--input" id="fname" value="${result.fname}">
            </div>
            
            <div class="input--box">
                <label for="lname" class="form--label">Apellido</label>
                <input type="text" name="lname" class="form--input" id="lname" value="${result.lname}">
            </div>
    
            <div class="input--box">
                <label for="specialty" class="form--label">Especialidad</label>
                <input type="text" name="specialty" class="form--input" id="specialty" value="${result.specialty}">
            </div>
    
            <hr/><br/>
            <input type="submit" value="Actualizar" formaction="/physician/update" class="submit--btn" />
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