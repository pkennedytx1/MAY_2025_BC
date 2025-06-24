window.onload = () => console.log('JS Loaded 😵‍💫')

const patricksFavAnimal = "salmon"

const animals = [{
    name: "bear",
    class: "mammal",
}, {
    name: "salmon",
    class: "fish",
}, {
    name: "raven",
    class: "bird",
}, {
    name: "copperhead",
    class: "reptile",
}, {
    name: "cat",
    class: "mammal"
}]

const isFavAnimal = (animal) => {
    if (animal.name === patricksFavAnimal) {
        return true
    } else {
        return false
    }
}

for (let i = 0; i < animals.length; i++) {
    if (isFavAnimal(animals[i])) {
        console.log(animals[i].name, " is my favorite animal!")
    }
    switch(animals[i].class) {
        case 'reptile':
            console.log(animals[i].name, "🐍");
            break;
        case "mammal":
            console.log(animals[i].name, "🐻")
            break;
        case "bird":
            console.log(animals[i].name, "🦩")
        default:
            console.log(animals[i].name, "no match found")
    }
}