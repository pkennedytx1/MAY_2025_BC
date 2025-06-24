window.onload = () => {
    console.log("JS Has Loaded!")
}

// ---------- Variables ----------
var name = "Patrick";     // old-school, function-scoped
let age = 30;           // block-scoped, reassignable
const birthYear = 1994; // block-scoped, NOT reassignable

// Datatypes
// Primitives Data Types
// typeof

// Arrays, Objects, and Functions


// ---------- Scope ----------

// What do you think this will log?
// let name = "Alice";

// function greet() {
//   let name = "Bob";
//   console.log(name);
// }
// greet();

// What will log here?
// function example() {
//     var message = "hello"; // hoisting
//     console.log(message);
//   }
// console.log(message);

// What about here?
// if (true) {
//     let x = 5;
//     const y = 10;
//   }
// console.log(x);

// What is the scope chain? Execution context defined and call stack defined
// let outer = "hi";

// function inner() {
//   console.log(outer); // ✅ can access outer
// }

// ----- Pass by reference vs pass by value -----

// What will console log at each point?
// let num = 1
// num += 1
// console.log('outside', num)
// const func1 = () => {
//     num += 1
//     console.log('inside', num)
// }
// func1()
// console.log('outside2', num)


// What about here?
// let person1 = { name: "Patrick", age: 30 };
// let person2 = person1;

// person2.age = 31;

// console.log(person1.age); // What is this?