import { useState } from 'react'

const tableroInicial = Array(9).fill(null)

export default function TresEnRaya() {
    const [tablero, setTablero] = useState(tableroInicial)
    const [turno, setTurno] = useState('x')

    const marcarCelda = (indice) => {
        if (tablero[indice] !== null) return

        setTablero(tablero.map((celda, posicion) => {
            return posicion === indice ? turno : celda
        }))

        setTurno(turno === 'x' ? 'o' : 'x')
    }

    return (
        <table className="tablero">
            <tbody>
                {[0, 1, 2].map((fila) => {
                    return (
                        <tr key={fila}>
                            {tablero.slice(fila * 3, fila * 3 + 3).map((celda, columna) => (
                                <td key={columna}>
                                    <button onClick={() => marcarCelda(fila * 3 + columna)}>
                                        {celda}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}