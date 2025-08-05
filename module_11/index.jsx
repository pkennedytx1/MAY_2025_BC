const hello = "howdy"
const greeting = <h1>{hello}</h1>


const myComp1 = () => {
    {/* This is a comment */}
    return (
        <>
            <div>

            </div>
            <div>
                {() => "Hello"}
            </div>
        </>
    )
}