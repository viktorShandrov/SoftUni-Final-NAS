const fs = require("fs");
const archiver = require('archiver');
const zlib = require('zlib');
const path = require("path");
const async = require("async");
const {call} = require("express");
const {uploadFileToGC} = require("../managers/filesManager");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
exports.runTest=()=>{
    // gzipFile()
    // gunzip()
    // uploadFileToGC()

    // storage
    //     .bucket("theconfederacyfiles")
    //     .file("AI.txt")
    //     .getMetadata()
    //     .then((data) => {
    //         const metadata = data[0];
    //         console.log('Object metadata:', metadata);
    //     })

}
function gunzip(){
    const inputFilePath = './output.zip'; // Replace with the path to your compressed file
    const outputDirectory = './output1.gif'; // Replace with the path where you want to decompress the file

    // Create a read stream from the compressed file
    const input = fs.createReadStream(path.join(__dirname, inputFilePath));

    // Create an async queue to handle parallel processing
    const queue = async.queue((chunk, callback) => {
        const gunzip = zlib.createGunzip();
        const output = fs.createWriteStream(path.join(__dirname, outputDirectory), { flags: 'a' }); // Append to the output file

        // Pipe the chunk through the Gunzip stream and then to the output file
        output.write(chunk);

        // Close the output file and call the callback
        output.on('finish', () => {
            output.close();
            callback();
        });
    }, 4); // Number of parallel processes

    // Read and process the file in chunks
    let chunk;
    let buffer = Buffer.alloc(0);

    input.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);

        while (buffer.length >= 1024 * 1024) { // Adjust the chunk size as needed
            chunk = buffer.slice(0, 1024 * 1024);
            buffer = buffer.slice(1024 * 1024);

            queue.push(chunk);
        }
    });

    // Handle the end of the input stream
    input.on('end', () => {
        // Push the remaining data as the last chunk
        if (buffer.length > 0) {
            queue.push(buffer);
        }

        // When all tasks are completed, the processing is done
        queue.drain(() => {
            console.log('File decompressed successfully.');
        });
    });
}

function gzipFile(){
    const inputFilePath = 'standard.gif'; // Replace with your input file path
    const outputFilePath = 'output.zip'; // Replace with your output file path

// Create an output stream to write the compressed file
    const output = fs.createWriteStream(path.join(__dirname, outputFilePath));

// Create a new archiver instance
    const archive = archiver('zip', {
        zlib: { level: 9 }, // Compression level
    });

// Pipe the output stream to the archive
    archive.pipe(output);

// Read the content of the input file
    const fileContent = fs.readFileSync(path.join(__dirname, inputFilePath));

// Add the file content to the archive
    archive.append(fileContent, { name: 'file.gif' });

// Finalize the archive, which will write the compressed file
    archive.finalize();

    output.on('close', () => {
        console.log('File compressed and saved to output.zip.');
    });

}