export default function Ejemplollaves(){
    const mensaje:String = "HolaUPB"
    const sumar=(a:number, b:number):number => {
        return a+b
    }
    const suma = sumar(3,4) 
    return(
        <section>
            <h1>{mensaje}</h1>
            <p> 3+4={suma}</p>
        </section>
    )
}