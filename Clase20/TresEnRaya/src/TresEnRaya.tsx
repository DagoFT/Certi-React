import { useState } from 'react'

type Marca = 'x' | 'o'
type Celda = Marca | null
type Tablero = Celda[]

const tableroInicial: Tablero = Array<Celda>(9).fill(null)

export default function TresEnRaya() {
    const [tablero, setTablero] = useState<Tablero>(tableroInicial)
    const [turno, setTurno] = useState<Marca>('x')

    const marcarCelda = (indice: number): void => {
        if (tablero[indice] !== null) return

        setTablero(tablero.map((celda, posicion) => {
            return posicion === indice ? turno : celda
        }))

        setTurno(turno === 'x' ? 'o' : 'x')
    }

    return (
        <section>
            <h1>Tres en Raya</h1>
        </section>
    )
}