import { Request, Response } from "express";

export function unknownServerError(res: Response, err: unknown): void {
    res.status(500).send("Unknown server error: " + err);
}

export function invalidBody(res: Response): void {
    res.status(400).send("Invalid body");
}

export function welcome(_: Request, res: Response): void {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historify - Control de historial clínico</title>
</head>
<body>
    <header>
        <h1>Control de historial clínico</h1>
        <nav>
            <ul>
                <li><a href="/consultation/create">Crear consulta</a></li>
                <li><a href="/consultation/update">Actualizar consulta</a></li>
                <li><a href="/patient/create">Registrar paciente</a></li>
                <li><a href="/patient/update">Actualizar paciente</a></li>
                <li><a href="/physician/create">Registrar doctor</a></li>
                <li><a href="/physician/update">Actualizar doctor</a></li>
            </ul>
        </nav>
    </header>
</body>
</html>
    `);
}