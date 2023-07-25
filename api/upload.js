const { PDFDocument, rgb } = require("pdf-lib");
const pdfTextExtract = require("pdf-text-extract");
const ical = require("ical-generator");

module.exports = async (req, res) => {
    try {
        const pdfFile = req.files?.pdfFile;
        if (!pdfFile || !pdfFile.mimetype.includes("pdf")) {
            return res.status(400).json({ error: "Invalid PDF file." });
        }

        // PDF processing and text extraction
        const pdfBuffer = pdfFile.data;
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const text = await pdfTextExtract.extract(pdfBuffer);

        // Data extraction (customize based on your PDF structure)
        const eventDetails = {
            title: "Sample Event",
            description: text.join("\n"),
            start: new Date(),
            end: new Date(),
            location: "Sample Location",
        };

        // iCal file generation
        const cal = ical({ domain: "your-domain.com" });
        cal.createEvent(eventDetails);

        const iCalContent = cal.toString();
        const iCalBuffer = Buffer.from(iCalContent);

        // Respond with the link to download iCal file (upload to cloud storage first in real-world scenario)
        res.status(200).json({ link: "data:text/calendar;charset=utf-8," + encodeURIComponent(iCalContent) });
    } catch (error) {
        console.error("Error during PDF processing:", error);
        res.status(500).json({ error: "An error occurred during PDF processing." });
    }
};