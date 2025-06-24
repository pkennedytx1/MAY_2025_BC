// COLOR PICKER CODE GOES HERE
const colorPickerElement = document.getElementById("liveColorPicker");

colorPickerElement.addEventListener("input", () => {
    document.body.style.backgroundColor = colorPickerElement.value
})

console.log(document)