const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
}); 

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";


    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cardRealTime");
        
        card.innerHTML =
         `
                
                <p><b>Id:</b> ${item.id} </p>
                <p><b>Titulo:</b> ${item.title} </p>
                <p><b>Descripcion:</b> ${item.description} </p>
                <p><b>Precio: $</b> ${item.price} </p>
                <p><b>Codigo: </b> ${item.code} </p>
                <p><b>Stock: </b>${item.stock} </p>
                <p><b>Categoria: </b>${item.category}</p>
                
                <button> Eliminar Producto </button>
        `;
        contenedorProductos.appendChild(card);

       
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,    
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    
    socket.emit("agregarProducto", producto);
};


