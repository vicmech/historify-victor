import { Request, Response } from "express";
import { db } from "../context.js";
import { Consultation, Physician } from "../types.js";

export function unknownServerError(res: Response, err: unknown): void {
    res.status(500).send("Unknown server error: " + err);
}

export function invalidBody(res: Response): void {
    res.status(400).send("Invalid body");
}

export async function dashboard(req: Request, res: Response): Promise<void> {

    const userType : Number = Number(req.cookies.userType);

    //Render acorde al tipo de usuario
    switch(userType){
        //usuario admin
        case 0:{
            res.render('dashboardSuperuser', {
            });
            break;
        }

        //usuario doctor
        case 1:{
            console.log('gppla')
            res.render('dashboardDoctor', {
                consultations : await getConsultations(req.cookies.userId)
            });
            break;
        }

        //usuario secretaria
        case 2:{
            res.render('dashboardSecretary', {
                consultations : await getConsultations(req.body.doctorId)
            });
            break;
        }
    }
};

/*async function getPatientHistory() : Promise<string>{
    let history : Consultation;
    try {
        history = await db.selectFrom("consultations")
            .selectAll()
            .where("patient_id", "=", 1)
            .executeTakeFirstOrThrow();
            console.log(history);
            return(history.id.toString());
    } catch (err) {
        console.log(err);
    }
    return "Nothing";
    
}*/

async function getConsultations(userId : number) : Promise<Consultation[]>{
    let consultations : Consultation[];
    let physician : Physician;
    try{
        console.log(userId)
        physician = await db.selectFrom('physicians')
        .selectAll()
        .where("userId", "=", userId)
        .executeTakeFirstOrThrow();
        console.log(physician);
            try {
                consultations = await db.selectFrom("consultations")
                    .selectAll()
                    .where("physician_id", "=", physician.id)
                    .execute();
                console.log(consultations);
                return consultations;
            } catch (err) {
                console.log(err);
            }

        
    } catch(err){
        console.log(err);
    }
    return [];
}
