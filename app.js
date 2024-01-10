import ProductManager from './productManager.js';

const path = './files/productos.json'

let products = [
    {
        title: 'Escuadra',
        description: 'Escuadra de plástico',
        price: 123.45,
        thumbnail: './images/escuadra.jpg',
        code: 'abc123',
        stock: 5
    },
    {
        title: 'Calculadora',
        description: 'Calculadora científica',
        price: 234.56,
        thumbnail: 'images/calculadora.jpg',
        code: 'abc234',
        stock: 2
    },
    {
        title: 'Globo Terráqueo',
        description: 'Globo terráqueo grande',
        price: 345.67,
        thumbnail: 'images/globo.jpg',
        code: 'abc345',
        stock: 8
    }
]

const updatedProduct = {
    title: 'Calculadora',
    description: 'Calculadora básica',
    price: 234.56,
    thumbnail: 'images/calculadora.jpg',
    code: 'abc234',
    stock: 10
}

const manager = new ProductManager(path)

function guardar (product){
    manager.addProduct(product).then(result => console.log(result.payload || result.error))
}

function obtenerPorId (id){
    manager.getProductById(id).then(result => console.log(result.payload || result.error))
}

function obtenerTodos (){
    manager.getProducts().then(result => console.table(result.payload || result.error))
}

function borrarPorId (id){
    manager.deleteById(id).then(result => console.log(result.payload || result.error))
}

function actualizar (id, product){
    manager.updateById(id, product).then(result => console.log(result.payload || result.error))
}

function borrarTodos(){
    manager.deleteAll().then(result => console.log(result.payload || result.error))
}

setTimeout(guardar, 50, {...products[0]})
setTimeout(guardar, 100, {...products[1]})
setTimeout(guardar, 150, {...products[2]})

setTimeout(obtenerPorId, 200, 2)
setTimeout(obtenerTodos, 250)

setTimeout(borrarPorId, 300, 3)
setTimeout(obtenerTodos, 350)
setTimeout(guardar, 400, {...products[1]})
setTimeout(actualizar, 450, 2, {...updatedProduct})

setTimeout(obtenerTodos, 550)

setTimeout(borrarTodos, 600)