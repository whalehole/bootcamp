import { useEffect, useState } from 'react';

function Example() {
    const [array, setArray] = useState({a: "b", b: "c"});

    const handleClick = event => {
        console.log('clicked')
        console.log(array)
        // const array2 = array 
        // array2.a = "c"
        setArray({a: "c", ...array})
    }
    useEffect(()=>{
        console.log("rendered")
    }, [array])

    return (
        <h1 type="button" onClick={handleClick}>hey</h1>
    )
}

export default Example