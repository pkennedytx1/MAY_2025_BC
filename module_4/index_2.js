window.onload = () => {
    console.log("JS Loaded 😵‍💫")
}

const patricksFavAnimal = "salmon"

const animal = [
    {
        name: "bear",
        class: "mammal",
    },
    {
        name: "salmon",
        class: "fish",
    },
    {
        name: "raven",
        class: "bird",
    },
    {
        name: "copperhead",
        class: "reptile",
    },
    {
        name: "cat",
        class: "mammal",
    }
]

// const isFavAnimal = (animal) => {
//     if (animal.name === patricksFavAnimal) {
//         return true
//     } else {
//         return false
//     }
// }

for (let i = 0; i < animal.length; i++) {
    if (animal[i].name === patricksFavAnimal) {
        console.log(animal[i].name, " is my fav animal!")
    }
    switch(animal[i].class) {
        case "mammal":
            console.log("🐻")
            break;
        case "reptile":
            console.log("🐍")
            break;
        case "bird":
            console.log("🦩")
        default:
            console.log(animal[i].name, "has no emoji match")
    }
}