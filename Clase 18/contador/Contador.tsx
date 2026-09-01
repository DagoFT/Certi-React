import { useState } from 'react'

interface SaludoProps {
    nombre: string;
}

const Saludo = (props: SaludoProps) => {
    if (props.nombre === "Diego") {
        return <p>Hola {props.nombre}</p>
    }

    return <p>No eres Diego</p>
}

export default function Contador() {
    const [contador, setContador] = useState<number>(0)

    const contar = (): void => {
        setContador((contador: number): number => {
            return contador + 1
        })
    }

    const numeros = [10, 20, 30, 40, 50, 60]

    const dobles = numeros.map((item) => {
        return item * 2
    })

    const resultado = numeros.slice(3, 6)

    let arreglo = Array<number>(6)
    arreglo.fill(3)

    return (
        <>
            <button onClick={contar}>
                {contador}
            </button>

            <Saludo nombre="Diego" />

            <h2>Números</h2>
            <p>{numeros.join(", ")}</p>

            <h2>Dobles</h2>
            <p>{dobles.join(", ")}</p>

            <h2>Slice</h2>
            <p>{resultado.join(", ")}</p>

            <h2>Arreglo</h2>
            <p>{arreglo.join(", ")}</p>
        </>
    )
}