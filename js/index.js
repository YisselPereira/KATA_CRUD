//inicializamos
const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();

// funcion para traer todos los datos
const getAll = async() =>{
    try{
        //consulta a la API para trer todos los videojuegos
        let res = await fetch("http://localhost:3000/videojuegos")
        json = await res.json();

        //verifica si tiene algun error
        if(!res.ok) throw{
            status: res.status, statusText: res.statusText
        };
        console.log(json);
        //recorre cada videojuego y lo agrega a la tabla
        json.forEach(el =>{
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".desarrollador").textContent = el.desarrollador;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.desarrollador = el.desarrollador;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });
        //agrega a el cuerpo de la tabla todas las filas de videojuegos
        $table.querySelector("tbody").appendChild($fragment);
    } catch(err){
        let message = err.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}
//se ejecuta cuando se carga el documento y obtiene todos los datos
d.addEventListener("DOMContentLoaded",getAll);

//se ejecuta cuando se hace el submit del formulario
d.addEventListener("submit", async e=>{
    if(e.target === $form){
        e.preventDefault();
        //si no tiene valor de id, lo crea con el POST
        if(!e.target.id.value){
            //Create-POST
            try{
                let options = {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json;charset=utf-8"
                    },
                    //en el body se pasa el videojuego en formato JSON
                    body:JSON.stringify({
                        nombre:e.target.nombre.value,
                        desarrollador:e.target.desarrollador.value
                    })
                },
                res = await fetch("http://localhost:3000/videojuegos", options)
                json = await res.json();
                

                if(!res.ok) throw{
                    status: res.status, statusText: res.statusText
                    
                };
                //al finalizar carga la pagina de nuevo
                location.reload();
            }catch(err){
                let message = err.statusText || "Ocurrio un error";
                $form.insertAdjacentHTML("afterend0",`<p><b>Error ${err.status}:${message}</b></p>`);
            }
        } else{
            //en caso de que exista el id, actualiza el videojuego con el PUT
            //Update-PUT
            try{
                let options = {
                    method: "PUT",
                    headers:{
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body:JSON.stringify({
                        nombre:e.target.nombre.value,
                        desarrollador:e.target.desarrollador.value
                    })
                },
                res = await fetch(`http://localhost:3000/videojuegos/${e.target.id.value}`, options),
                json = await res.json();

                if(!res.ok) throw{
                    status:res.status, statusText:res.statusText
                };
                location.reload();
            } catch(err){
                let message = err.statusText || "Ocurrio un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});
//se ejecuta cuando se hace click en el documento
//funcion async para poder usar el await del fecth
d.addEventListener("click", async e=>{
    if(e.target.matches(".edit")){
        $title.textContent = "Editar Videojuego";
        $form.nombre.value = e.target.dataset.name;
        $form.desarrollador.value = e.target.dataset.desarrollador;
        $form.id.value = e.target.dataset.id;
    }

    if(e.target.matches(".delete")){
        let isDelete = confirm(`Estas seguro de eliminar el id ${e.target.dataset.id}?`);

        if(isDelete){
            //Delete - DELETE
            try{
                let options = {
                    method: "DELETE",
                    headers:{
                        "Content-type": "application/json; charset=utf-8"
                    },
                },
                res = await fetch(`http://localhost:3000/videojuegos/${e.target.dataset.id}`, options),
                json = await res.json();

                if(!res.ok) throw{
                    status:res.status, statusText:res.statusText
                };
                location.reload();
            } catch(err){
                let message = err.statusText || "Ocurrio un error";
                alert(`Error ${err.status}: ${message}`);
            }
        }
    }
})