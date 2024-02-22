import Express from "express"
import { createPatient, createPatientForm, 
         searchPatientForm, 
         updatePatient, updatePatientForm } from "./src/handlers/patient.js"
import { createPhysician, createPhysicianForm, 
         searchPhysicianForm, 
         updatePhysician, updatePhysicianForm } from "./src/handlers/physician.js"
import { createConsultation, createConsultationForm, 
         searchConsultationForm, 
         updateConsultation, updateConsultationForm } from "./src/handlers/consultation.js"
import { dashboard } from "./src/handlers/common.js"
import express from "express"
import { logOut, logUser, loginForm } from "./src/handlers/login.js"
import { createUser, createUserForm } from "./src/handlers/user.js"
import cookieParser from "cookie-parser";
import { superuser } from "./src/handlers/superuser.js"

function main(): void {
    const app = Express();
    const port = 3000;

    // MIDDLEWARE
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.param('id', (req, _1, next, id: string) => { (req as any).id = id; next(); });

    // INDEX
    app.get('/dashboard', dashboard);
    app.get('/dashboard/logout', logOut);  // redirect: limpia la cookie de auth

    app.get('/superuser', superuser);
    app.get('/superuser/logout', logOut);

    // LOGIN
    app.get('/',    loginForm);  // html: formulario de inicio de sesión
    app.get('/:id', loginForm);  // html: formulario de inicio de sesión (reintento)
    app.post('/',    logUser);   // validación de usuario y redirección (dashboard o de vuelta a login)
    
    // CONSULTATION
    // app.get('/consultation/:id', getOneConsultation);      // futuro: html: vista de 1 consulta
    // app.get('/consultation',     getAllConsultations);     // futuro: html: vista de lista de consultas

    app.get('/consultation/create',  createConsultationForm); // html: formulario de registro de consulta
    app.post('/consultation/create', createConsultation);     // acción de registro

    app.get('/consultation/update/', searchConsultationForm);
    app.get('/consultation/update/:id', updateConsultationForm);  // html: formulario de actualización de consulta
    app.post('/consultation/update/',   updateConsultation);      // acción de actualización

    // PHYSICIAN
    // app.get('/physician/:id', getOnePhysician);            // futuro: html: vista de 1 doctor
    // app.get('/physician',     getAllPhysicians);           // futuro: html: vista de lista de doctores

    app.get('/physician/create/',  createPhysicianForm);       // html: formulario de registro de doctor
    app.post('/physician/create/', createPhysician)            // acción de registro de doctor

    app.get('/physician/update/',   searchPhysicianForm);
    app.get('/physician/update/:id', updatePhysicianForm);    // html: formulario de actualización de consulta
    app.post('/physician/update/',   updatePhysician);        // acción de actualización

    // PATIENT
    // app.get('/patient/:id', getOnePatient);                // futuro: html: vista de 1 paciente
    // app.get('/patient',     getAllPatients);               // futuro: html: vista de lista de pacientes

    app.get('/patient/create',  createPatientForm);           // html: formulario de registro de paciente
    app.post('/patient/create', createPatient);               // acción de registro de paciente

    app.get('/patient/update/',    searchPatientForm);
    app.get('/patient/update/:id', updatePatientForm);        // html: formulario de actualización de paciente
    app.post('/patient/update/',   updatePatient);            // acción de actualización de paciente

    // USER
    app.get('/user/create',  createUserForm);                 // html: formulatio de registro de usuario
    app.post('/user/create', createUser);                     // acción de registro de usuario

    app.listen(port, () => { console.log("Server started and listening to " + port); });
}

main()