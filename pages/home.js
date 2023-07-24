const fileInput = document.getElementById("file-input");
const fileLabel = document.getElementById("file-label");
const fileNameDisplay = document.getElementById("file-name");

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        const fileName = file.name;
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
    } else {
        fileNameDisplay.textContent = "";
    }
});

fileLabel.addEventListener("click", () => {
    fileInput.click();
});