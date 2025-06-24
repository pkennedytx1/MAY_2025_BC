// // Module ES6 (End of OH)
// import { howdy } from './other.js'

// console.log(howdy)

window.onload = () => {
    console.log("JS File Loaded 💸")
}

// Add two movies, then remove the last and log it.
const movies = ["Interstellar", "Inception", "The Matrix", "Arrival", "The Prestige"];

movies.push("Barbie");
movies.push("Mrs Doubtfire")
movies.pop()

// grab the last index of my array
const lastIndex = movies.length-1
// console.log(movies[lastIndex], movies)

// Add to the start, remove the first movie, and print the updated array.
movies.unshift("Tron")
movies.shift()

// console.log(movies)

// Remove the 2nd movie. Insert a new movie at position 2.

movies.splice(1, 1, "Once Upon a Time in Hollywood")

// console.log(movies)

// Exercise: Create a new array with the first 3 movies using .slice().

const removedMovies = movies.slice(0, 3)

// console.log(movies)

// Exercise: Check if "The Matrix" is in your array. Print index of "Inception".

const findMatrixIndex = () => {
    if (movies.includes("The Matrix")) {
       return movies.indexOf("The Matrix")
    }
    return "Matrix was not found. 😢"
}

// console.log(findMatrixIndex())

// Exercise: Print "One of my favorite movies is: <movie>" for each item.
// movies.forEach((element) => console.log(`One of my favorite movies is: ${element}`))

// Exercise: Create a new array of uppercase movie names.
const uppercaseMovies = movies.map((movie) => movie.toUpperCase());
// console.log(uppercaseMovies, movies)

// Exercise: Create a new array of movie titles longer than 8 characters.
const moviesGreaterThan8Chars = movies.filter((movie) => movie.length > 8)
// console.log(moviesGreaterThan8Chars, movies)

// named function
// function howdy(greeting) {
//     return greeting
// }

// console.log(howdy("Gutantagen"))