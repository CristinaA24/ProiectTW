window.onload=function(){
    x =100
    document.getElementById("filtrare").onclick=function(){
        var inpNume=document.getElementById("inp-nume").value;
        var produse=document.getElementsByClassName("produs");
        var cond1 = false;
        for(let produs of produse){
            produs.style.display="none";
            let nume=produs.getElementsByClassName;getElementsByClassName("val-nume")[0].innerHTML;
            if(nume.include(inpNume)){
                var cond1=true;
            }
            if(cond1){
                produs.style.display="block";
            }
        }
    };
}