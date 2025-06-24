window.onload = () => {
    console.log('JS Has Loaded!')
}

// Datatypes
// typeof

const myName = [{ name: "Patrick" }, { name: "Oliver"}];
// console.log(myName[0].name)
// console.log(typeof myName) // What will this return? Object

function greetMyMom(name) {
    return "Howdy mom whose name is " + name;
}

// console.warn(typeof greetMyMom)

// ----- Scope -----
let aName = "Alice" // globally scoped let aName

function greet() {
    // let aName = "Bob"
    console.log(aName) // What will this log?
}
// greet()

function example() {
    var message = "hello"
    console.log(message)
}

// example()
// console.log(message)

// Weird hoisting behavior
if (true) {
    let x = 5
    const y = 10
}
// console.log(x)

// scope chain (lexical scope) 
let outer = "hi"

function inner() {
   console.log(outer); 
}

inner()

// ---