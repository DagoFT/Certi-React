console.log("esto es un buscaminas");

let table = document.querySelector<HTMLTableElement>(".buscaminas");

if (table) {
    console.log(table.tagName);
}

let celda = document.querySelector<HTMLTableCellElement>("td");

if (celda) {
    console.log(celda.textContent);
} else {
    console.log("no existe");
}

let listaElementos = document.querySelectorAll<HTMLTableCellElement>("td");

for (const elemento of listaElementos) {

    elemento.addEventListener("click", function () {

        if (elemento.classList.contains("mina")) {
            console.log("mina");
            elemento.textContent = "💥";
        } else {
            console.log(elemento, elemento.textContent);
        }

        console.log("-");

    });

}