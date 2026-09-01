import { useState } from 'react'
import type { KeyboardEvent } from 'react'

type Celda = 'cabeza' | 'cuerpo' | 'comida' | null

const tableroInicial: Celda[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

const serpienteInicial = [
    [3, 2],
    [3, 1],
    [3, 0],
]

export default function SerpientePorTurnos() {
    const [serpiente, setSerpiente] = useState(serpienteInicial)
    const [comida, setComida] = useState([6, 6])
    const [juegoTerminado, setJuegoTerminado] = useState(false)

    const mover = (event: KeyboardEvent<HTMLDivElement>) => {
        if (juegoTerminado) return

        let fila = serpiente[0][0]
        let columna = serpiente[0][1]

        if (event.key === 'ArrowUp') {
            fila--
        }

        if (event.key === 'ArrowDown') {
            fila++
        }

        if (event.key === 'ArrowLeft') {
            columna--
        }

        if (event.key === 'ArrowRight') {
            columna++
        }

        const nuevaCabeza = [fila, columna]

        const fueraDelTablero =
            fila < 0 ||
            fila >= 8 ||
            columna < 0 ||
            columna >= 8

        const chocoConElCuerpo = serpiente.some(([filaSerpiente, columnaSerpiente]) => {
            return filaSerpiente === fila && columnaSerpiente === columna
        })

        if (fueraDelTablero || chocoConElCuerpo) {
            setJuegoTerminado(true)
            return
        }

        const comio = fila === comida[0] && columna === comida[1]

        const nuevaSerpiente = [
            nuevaCabeza,
            ...serpiente,
        ]

        if (!comio) {
            nuevaSerpiente.pop()
        }

        setSerpiente(nuevaSerpiente)

        if (comio) {
            let nuevaFila = Math.floor(Math.random() * 8)
            let nuevaColumna = Math.floor(Math.random() * 8)

            while (
                nuevaSerpiente.some(([filaSerpiente, columnaSerpiente]) => {
                    return filaSerpiente === nuevaFila &&
                        columnaSerpiente === nuevaColumna
                })
            ) {
                nuevaFila = Math.floor(Math.random() * 8)
                nuevaColumna = Math.floor(Math.random() * 8)
            }

            setComida([nuevaFila, nuevaColumna])
        }
    }

    const tablero = tableroInicial.map((fila, filaIndex) => {
        return fila.map((celda, columnaIndex) => {
            if (
                serpiente[0][0] === filaIndex &&
                serpiente[0][1] === columnaIndex
            ) {
                return 'cabeza'
            }

            if (
                serpiente.some(([filaSerpiente, columnaSerpiente]) => {
                    return filaSerpiente === filaIndex &&
                        columnaSerpiente === columnaIndex
                })
            ) {
                return 'cuerpo'
            }

            if (
                comida[0] === filaIndex &&
                comida[1] === columnaIndex
            ) {
                return 'comida'
            }

            return celda
        })
    })

    return (
        <div
            className={`juego ${juegoTerminado ? 'terminado' : ''}`}
            tabIndex={0}
            onKeyDown={mover}
        >
            <table className="tablero">
                <tbody>
                    {tablero.map((fila, filaIndex) => {
                        return (
                            <tr key={filaIndex}>
                                {fila.map((celda, columnaIndex) => {
                                    return (
                                        <td
                                            key={columnaIndex}
                                            className={celda ?? ''}
                                        >
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {juegoTerminado && (
                <h2>¡Juego terminado!</h2>
            )}
        </div>
    )
}