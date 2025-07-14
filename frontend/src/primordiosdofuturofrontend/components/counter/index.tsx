import React, { useEffect, useRef, useState } from 'react'

interface ICounter {
    number: number;

}



const Counter = ({number} : ICounter) => {
      const texto = useRef("Uma string vazia");

    const [number2, setNumber2] = useState(number);


    const addOne = () => {
        setNumber2(number2 + 1);
        console.log(number2);
    }


    const updateText = () => {
        texto.current = "Uma outra string";
        console.log(texto);
    }


    useEffect(() => {
        console.log("Atualizou!");

    }, [texto]);




    
  return (
    <div>
        <button onClick={addOne}>+1</button>
        <button onClick={updateText}>Update</button>
        <p>{number2}</p>
        <p>{texto.current}</p>
    </div>
  )
}

export default Counter