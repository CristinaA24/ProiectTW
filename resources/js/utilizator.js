//const AccesBD=require('./accesbd.js');

/**
 * Clasa pentru reprezentarea unui utilizator.
 */
class Utilizator{
    /**
     * Tipul implicit de conexiune pentru utilizatori.
     * @type {string}
     * @static
     */
    static tipConexiune="local";

    /**
     * Mesaj de eroare intern pentru manipularea erorilor.
     * @type {string}
     * @private
     */
    #eroare;

    /**
     * Constructor pentru crearea unui obiect Utilizator.
     *
     * @param {Object} parametri - Parametrii pentru inițializarea obiectului.
     * @param {number} parametri.id - ID-ul utilizatorului.
     * @param {string} parametri.username - Numele de utilizator.
     * @param {string} parametri.nume - Numele utilizatorului.
     * @param {string} parametri.prenume - Prenumele utilizatorului.
     * @param {string} parametri.email - Adresa de email a utilizatorului.
     * @param {string} parametri.rol - Rolul utilizatorului.
     * @param {string} [parametri.culoare_chat="black"] - Culoarea utilizată în chat (opțional).
     * @param {string} parametri.poza - Numele fișierului pentru poza de profil.
     * @param {Date} parametri.data_nastere - Data nașterii utilizatorului.
     */

    constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza, data_nastere}={}) {
        this.id=id;
        try{
            if(this.checkUsername(username))
        this.username = username;
        }catch(e){this.#eroare = e.message}
        this.nume = nume;
        this.prenume = prenume;
        this.email = email;
        this.rol=rol; //TO DO clasa Rol
        this.culoare_chat=culoare_chat;
        this.poza=poza;
        this.data_nastere;


        this.#eroare="";
    }

    /**
     * Verifică dacă un nume respectă formatul dorit.
     *
     * @param {string} nume - Numele de verificat.
     * @returns {boolean} `true` dacă numele este valid, altfel `false`.
     */
    checkName(nume){
        return nume!="" && nume.match(new RexExp("ˆ[A-Z][a-z]+$"));
    }

    /**
     * Verifică dacă un username respectă formatul dorit.
     *
     * @param {string} username - Username-ul de verificat.
     * @returns {boolean} `true` dacă username-ul este valid, altfel `false`.
     */
    checkName(username){
        return username!="" && username.match(new RexExp("[A-Za-z0-9]+"));
    }
    /**
     * Setează numele utilizatorului cu validarea corespunzătoare.
     *
     * @param {string} nume - Noul nume de setat.
     * @throws {Error} Aruncă o excepție dacă numele este invalid.
     */

    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("nume gresit")
        }
    }



/*
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:obGlobal.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:obGlobal.emailServer,
            to:email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   */ 
}

// Exporta clasa Utilizator pentru a putea fi utilizată în alte module.
module.exports={Utilizator:Utilizator}
