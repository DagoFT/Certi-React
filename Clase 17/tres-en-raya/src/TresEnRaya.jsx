import { useState } from "react";

export default function TresEnRaya() {
    const [tablero, setTablero] = useState(Array(9).fill(""));
    const [turno, setTurno] = useState("X");
    const [ganador, setGanador] = useState(null);

    const combinaciones = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const comprobarGanador = (tableroActual) => {
        for (const combinacion of combinaciones) {
            const [a, b, c] = combinacion;

            if (
                tableroActual[a] &&
                tableroActual[a] === tableroActual[b] &&
                tableroActual[a] === tableroActual[c]
            ) {
                return tableroActual[a];
            }
        }

        if (!tableroActual.includes("")) {
            return "Empate";
        }

        return null;
    };

    const movimientoIA = (tableroActual) => {
        const disponibles = tableroActual
            .map((casilla, index) => casilla === "" ? index : null)
            .filter((index) => index !== null);

        for (const posicion of disponibles) {
            const prueba = [...tableroActual];
            prueba[posicion] = "O";

            if (comprobarGanador(prueba) === "O") {
                return posicion;
            }
        }

        for (const posicion of disponibles) {
            const prueba = [...tableroActual];
            prueba[posicion] = "X";

            if (comprobarGanador(prueba) === "X") {
                return posicion;
            }
        }

        return disponibles[Math.floor(Math.random() * disponibles.length)];
    };

    const jugar = (index) => {
        if (tablero[index] !== "" || ganador || turno !== "X") {
            return;
        }

        const nuevoTablero = [...tablero];
        nuevoTablero[index] = "X";

        const resultado = comprobarGanador(nuevoTablero);

        if (resultado) {
            setTablero(nuevoTablero);
            setGanador(resultado);
            return;
        }

        setTablero(nuevoTablero);
        setTurno("O");

        setTimeout(() => {
            const posicionIA = movimientoIA(nuevoTablero);

            const tableroIA = [...nuevoTablero];
            tableroIA[posicionIA] = "O";

            const resultadoIA = comprobarGanador(tableroIA);

            setTablero(tableroIA);

            if (resultadoIA) {
                setGanador(resultadoIA);
                return;
            }

            setTurno("X");
        }, 100);
    };

    const reiniciar = () => {
        setTablero(Array(9).fill(""));
        setTurno("X");
        setGanador(null);
    };

    return (
        <section className="tres-en-raya">
            <h1>Tres en Raya</h1>

            {ganador && (
                <h2>
                    {ganador === "Empate"
                        ? "¡Empate!"
                        : `¡Ganó ${ganador}!`}
                </h2>
            )}

            <table className="tablero">
                <tbody>
                    <tr>
                        <td>
                            <button onClick={() => jugar(0)}>
                                {tablero[0]}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => jugar(1)}>
                                {tablero[1]}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => jugar(2)}>
                                {tablero[2]}
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <button onClick={() => jugar(3)}>
                                {tablero[3]}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => jugar(4)}>
                                {tablero[4]}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => jugar(5)}>
                                {tablero[5]}
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <button onClick={() => jugar(6)}>
                                {tablero[6]}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => jugar(7)}>
                                {tablero[7]}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => jugar(8)}>
                                {tablero[8]}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <button className="reiniciar" onClick={reiniciar}>
                Reiniciar
            </button>
        </section>
    );
}