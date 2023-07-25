document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const pdfFile = document.getElementById("pdfFile").files[0];
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);

    const response = await fetch("/api/uploadPDF", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.innerHTML = `<a href="${data.link}" download>Download iCal File</a>`;
    } else {
        alert("An error occurred during PDF processing.");
    }
});