// Hacer un menu de productos, que elija un producto, muestre su precio, y que el usuario decida en cuantas cuotas quiera pagarlo



const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.querySelector("#contenedor-productos")


function crearUnBoton(nombre, texto, funcionQueEjecuta) {
    nombre = document.createElement("button");
    nombre.innerText = texto;
    nombre.classList.add("botonesOpciones");
    const botonProducto = document.getElementById("opciones");
    botonProducto.appendChild(nombre);
    nombre.addEventListener("click", funcionQueEjecuta);
}

crearUnBoton("buttonVerProductos", "Products", mostrarProductosPorCategoria);

crearUnBoton("buttonElectronics", "Electronics", () => mostrarProductosPorCategoria("si", "electronics"))

crearUnBoton("buttonPantalon", "Jewelery", () => mostrarProductosPorCategoria("si", "jewelery"))

crearUnBoton("buttonRemera", "Men's Clothing", () => mostrarProductosPorCategoria("si", "men's clothing"))

crearUnBoton("buttonRemera", "Women's Clothing", () => mostrarProductosPorCategoria("si", "women's clothing"))

crearUnBoton("buttonVerCarrito", "Ver carrito", verCarrito);


function limpiarHTLM() {
    const limpiar = document.getElementById("contenedor-productos");
    limpiar.innerHTML = "";
}

function agregarProductoAlCarrito (producto) {
    const buttonAgregar = document.createElement("button");
    buttonAgregar.innerText = "Add to Cart";
    
    const contenedorBoton = document.querySelector("#producto-" + producto.id);
    contenedorBoton.appendChild(buttonAgregar);
    
    buttonAgregar.addEventListener("click", () => {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito))
        Toastify({
            text: "Added to Cart",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
    })    
}

function mostrarProductosPorCategoria(activarComparativa, categoriaEspecifica) {
    limpiarHTLM();

    fetch('https://fakestoreapi.com/products')
        .then((res) => res.json())
        .then((data) => {

            let productosAMostrar = data;

            if (activarComparativa == "si"){
                productosAMostrar = data.filter(producto => producto.category === categoriaEspecifica);
            }

            productosAMostrar.forEach((producto) => {
                const div = document.createElement("div")
                div.innerHTML = `
            <img src="${producto.image}">
            <h2>${producto.title}</h2>
            <h3>${producto.category}</h3>
            <p>Precio: $${producto.price}</p>
            <div id="producto-${producto.id}">
            </div>
            `;

                contenedor.appendChild(div);
                agregarProductoAlCarrito(producto);

            });
        })

}


function verCarrito() {
    let total = 0
    limpiarHTLM()
    carrito.forEach(p => {
        const div = document.createElement("div");

        div.innerHTML = `
        <img src="${p.image}">
        <h2>${p.title}</h2>
        <h3>${p.category}</h3>
        <p>Precio: $${p.price}</p>
        <div id="producto-${p.id}">
        </div>
        `
        contenedor.appendChild(div);

        total += p.price;

    })

    const mostrarTotal = document.createElement("div");

    if (carrito.length === 0) {
        mostrarTotal.innerHTML = `
        <h2>No hay productos en el carrito</h2>
        `
        contenedor.appendChild(mostrarTotal);
    } else {
        mostrarTotal.innerHTML = `
        <h2>Total...........................$${total}</h2>
        `
        contenedor.appendChild(mostrarTotal);

        const mostarTotalEnCuotas = document.createElement("div");

        contenedor.appendChild(mostarTotalEnCuotas);

        botonSacarEnCuotas("button3Cuotas", "PAGAR EN 3 CUOTAS", total, mostarTotalEnCuotas, 3);

        botonSacarEnCuotas("button6Cuotas", "PAGAR EN 6 CUOTAS", total, mostarTotalEnCuotas, 6);
    
        botonSacarEnCuotas("button9Cuotas", "PAGAR EN 9 CUOTAS", total, mostarTotalEnCuotas, 9);
    
        botonSacarEnCuotas("button12Cuotas", "PAGAR EN 12 CUOTAS", total, mostarTotalEnCuotas, 12);

        const buttonLimpiarCarrito = botonesParaElCarrito("buttonLimpiarCarrito", "Limpiar Carrito");

        buttonLimpiarCarrito.addEventListener("click", () => {
            carrito.splice(0);
            localStorage.setItem("carrito", JSON.stringify(carrito))
            verCarrito()
        })
    }

}


function botonSacarEnCuotas(nombreBoton, texto, total, mostarTotalEnCuotas, cuotas) {
    const boton = botonesParaElCarrito(nombreBoton, texto)
    let precioAPagar = total;
    total = Math.round(total / cuotas);
    boton.addEventListener("click", () => {
        mostarTotalEnCuotas.innerHTML = `
        <h2>Si quiere pagar $${precioAPagar} en ${cuotas} cuotas, cada cuota va a tener un valor de: $${total}</h2>
        `
    })
}

function botonesParaElCarrito(nombreButton, texto) {
    nombreButton = document.createElement("button");
    nombreButton.innerText = texto;

    const contenedorBoton1 = document.querySelector("#contenedor-productos");
    contenedorBoton1.appendChild(nombreButton);

    return nombreButton
}

//Css

//nav
const botonesPresionados = Array.from(document.querySelectorAll(".botonesOpciones"));
let botonActivo = null;

botonesPresionados.forEach((botonPresionado)=>{
    botonPresionado.addEventListener("click", ()=>{
        //quito la clase activo para que deje de resaltar el boton
        if (botonActivo){
            botonActivo.classList.remove("active");
        }   

        botonPresionado.classList.toggle("active");

        //actualizo la variable botonActivo para verificar 
        botonActivo = botonPresionado;
    })
})
