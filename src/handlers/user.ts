import { Request, Response } from "express"
import { db } from "../context.js";
import { isNewUser } from "../validation/user.js";
import { invalidBody, unknownServerError } from "./common.js";

/*export async function searchUserForm(_: Request, res: Response): Promise<void> {
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
    
            let searchText = document.getElementById("username").value.trim();
            let form = document.getElementById("form");
      
            if(searchText.length > 0) {
                form.action = "/User/update/" + searchText;
                form.submit();
            } else {
                return false;
            }
        }
    </script>
    <body>
        <h2 class="pg--title">Actualizar Usuario</h2>
        <form class="form" id="form" action="" method="get" onsubmit="return submitFunction();">
        <div class="input--box">     
            <label class="form--label" for="username">Nombre de usuario</label>
            <input class="form--input" type="text" id="username">
        </div>
            <input class="submit--btn" type="submit" value="Buscar">
        </form>
    </body>
    </html>
    `);
}*/

export async function createUserForm(_: Request, res: Response): Promise<void> {
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
        <h2 class="pg--title">Usuario</h2>
        <form class="form" action="" method="post">
            <p class="form--title">Ingrese los datos del usuario:</p>
            <div class="input--box">
                <label class="form--label" for="username">Nombre de usuario</label>
                <input class="form--input" type="text" name="username" id="username">
            </div>
            <div class="input--box">
                <label class="form--label" for="password">Contraseña</label>
                <input class="form--input" type="password" name="passw" id="passw">
            </div>
            <input class="submit--btn" type="submit" value="Enviar">
        </form>
    </body>
    </html>
    `);
}

export async function createUser(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    if (!isNewUser(req.body)) return invalidBody(res);
    try {
        const result = await db.insertInto('users')
            .values({ ...req.body, userType: 1 })
            .executeTakeFirstOrThrow();
        
        res.status(201).send("Created User " + req.body.username + " with ID " + result.insertId);
    } catch (err) {
        return unknownServerError(res, err);
    }
}