
const express = require("express")
//biblioteca para agregar id
const uuid = require("uuid")
const app = express()
app.use(express.json())

const puerta = 3004//variable para cambiar de puerta


const usuarios = []

//middleware es un interceptor del requerimiento,tiene el poder para parar el proceso o alterar datos
const mymiddleware = (request, response, next) => {


    const { id } = request.params // busca el id
    const listado = usuarios.findIndex(user => user.id === id)//busqueda del id exacto en la lista

    //if reponde en caso de que el usuario no sea encontrado
    if (listado < 0) {
        return response.status(404).json({ error: "usuario no encontrado!" })

    }
   
    request.usuarioid = id
    request.buscausuarios = listado

    next()

}

//RUTA PARA BUSCAR USUARIOS
app.get("/users", (request, response) => {

    return response.json(usuarios)

})

//RUTA PARA ENVIAR USUARIO
app.post("/users", (request, response) => {
    
    const { name, age, email } = request.body//entra los daros del usuario.
    //const id = request.usuarioid
    const user = { id: uuid.v4(), name, age, email, }//crea el id del usuario y guarda todo los datos en user.

    usuarios.push(user)// sube los datos del users para "usuarios"

    return response.status(201).json(user)
  
})

//RUTA PARA EDITAR USUARIOS
app.put("/users/:id", mymiddleware,(request, response) => {

    const { name, age, email } = request.body //busca los datos
    const listado = request.buscausuarios
    const usuario = (id, name, age, email) //guarda los datos enla variable

    usuarios[listado] = usuario //toma el numero del listado y la coloca en el usuario

    return response.json(usuario)

})

//RUTA PARA BORRAR USUARIOS
app.delete("/users/:id", mymiddleware,(request, response) => {
   
    const listado = request.buscausuarios
    usuarios.splice(listado, 1)

    return response.status(204).json({error: "usuario borrado!"} )
})


app.listen(puerta, () => {
    console.log(`servidor iniciado, puerta ${puerta}`)// para agregar un codigo html al texto usar `` invertidas.
})