const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      const parsedData = parse(data);

      // Extract the file data from the request
      const fileData = parsedData.file;

      if (!fileData) {
        return res.status(400).json({ error: 'No file selected' });
      }

      // Decode the base64 file data
      const decodedData = Buffer.from(fileData, 'base64');

      // Save the file in the 'uploads' folder
      const fileName = 'uploaded_file.pdf'; // Set the desired filename
      const filePath = path.join(__dirname, 'uploads', fileName);

      fs.writeFile(filePath, decodedData, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error occurred during file upload' });
        }

        // Trigger the Python script here or call an external API endpoint with the file path
        // You can use 'child_process' to execute the Python script here if you have Python installed on Vercel

        return res.status(200).json({ message: 'File uploaded successfully' });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
};