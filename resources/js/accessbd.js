
const {Client}=require("pg");

/**
 * Clasă pentru gestionarea accesului la baza de date.
 */
class AccessBd{
    static #instanta=null;
    static #initializat=false;

    constructor(){
        if(AccessBd.#instanta){
            throw new Error("deja a fost instantiat");
        }
        else if(!AccessBd.#initializat){
            throw new Error("trebuie apelat doar din getInstance; fara sa fi aruncat vreo eroare");
        }
        
    }
    /**
     * Inițializează conexiunea locală la baza de date.
     */
    initLocal(){
        this.client=new Client({database:"proiect",
            user:"cristina",
            password:"parola",
            host:"localhost",
            port:5432});
        this.client.connect();
    }

    /**
     * Returnează instanța de conexiune la baza de date.
     *
     * @returns {Client} Instanța de conexiune la baza de date.
     * @throws {Error} Aruncă o excepție dacă clasa nu a fost încă instanțiată.
     */
    getClient(){
        if(!AccessBd.#instanta){
            throw new Error("nu a fost instantiata clasa");
        }
        return this.client;
    }


    /**
     * Obține o instanță singleton a clasei `AccessBd`.
     *
     * @param {Object} options - Opțiuni pentru inițializarea clasei.
     * @param {string} [options.init="local"] - Tipul de inițializare (opțional).
     * @returns {AccessBd} Instanța singleton a clasei `AccessBd`.
     */
   static getInstance({init="local"}={}){
        console.log(this);//this-ul e cls, nu instanta pt ca metoda statica
        if(!this.#instanta){
            this.#initializat=true;
            this.#instanta=new AccessBd();
            try{
            switch(init){
                case "local":this.#instanta.initLocal();
            }
        }
        catch(e){
            console.error("eroare la initializarea bazei de date")
        }
        }
        return this.#instanta;
    }

    /**
     * Execută o interogare de tip SELECT asupra bazei de date.
     *
     * @param {Object} options - Opțiuni pentru interogare.
     * @param {string} [options.tabel=""] - Numele tabelului.
     * @param {string[]} [options.campuri=[]] - Lista de câmpuri pentru SELECT.
     * @param {string[]} [options.conditiiAnd=[]] - Condiții AND pentru clauza WHERE.
     * @param {function} callback - Funcția de callback pentru rezultate.
     */
    select({tabel="", campuri=[], conditiiAnd=[]} = {}, callback){
        let conditieWhere ="";
        if(conditiiAnd.length>0)
        conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback);
    }

    /**
     * Inserează date în baza de date.
     *
     * @param {Object} options - Opțiuni pentru inserție.
     * @param {string} [options.tabel=""] - Numele tabelului.
     * @param {string[]} [options.campuri=[]] - Lista de câmpuri pentru INSERT.
     * @param {string[]} [options.valori=[]] - Lista de valori pentru câmpuri.
     * @param {function} callback - Funcția de callback pentru rezultate.
     * @throws {Error} Aruncă o excepție dacă numărul de câmpuri difere de numărul de valori.
     */
    insert({tabel="",campuri=[],valori=[]} = {}, callback){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        
        let comanda=`insert into ${tabel}(${campuri.join(",")}) values ( ${valori.join(",")})`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    /**
     * Actualizează date în baza de date.
     *
     * @param {Object} options - Opțiuni pentru actualizare.
     * @param {string} [options.tabel=""] - Numele tabelului.
     * @param {string[]} [options.campuri=[]] - Lista de câmpuri pentru UPDATE.
     * @param {string[]} [options.valori=[]] - Lista de valori pentru câmpuri.
     * @param {string[]} [options.conditiiAnd=[]] - Condiții AND pentru clauza WHERE.
     * @param {function} callback - Funcția de callback pentru rezultate.
     * @throws {Error} Aruncă o excepție dacă numărul de câmpuri difere de numărul de valori.
     */

    update({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}='${valori[i]}'`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    /**
     * Șterge date din baza de date.
     *
     * @param {Object} options - Opțiuni pentru ștergere.
     * @param {string} [options.tabel=""] - Numele tabelului.
     * @param {string[]} [options.conditiiAnd=[]] - Condiții AND pentru clauza WHERE.
     * @param {function} callback - Funcția de callback pentru rezultate.
     */
    
    delete({tabel="",conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

}

    module.exports=AccessBd;