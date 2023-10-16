const fs = require("fs");
const zlib = require('zlib');
const path = require("path");
const async = require("async");

exports.runTest=()=>{
    // gzipFile()
    const inputFilePath = './output.gz'; // Replace with your input file path
    const outputFilePath1 = './BATALIONA(2222).pptx'; // Replace with your output file path
    const outputFilePath2 = './BATALIONA(33333).pptx'; // Replace with your output file path

    const input = fs.createReadStream(path.join(__dirname, inputFilePath),{highWaterMark:1*1024*1024});
    const output = fs.createWriteStream(path.join(__dirname, outputFilePath1));
    const output2 = fs.createWriteStream(path.join(__dirname, outputFilePath2));



    const queue = async.queue((chunk, callback) => {
        // chunk = '1f8b080000000000000a' + chunk
        zlib.gunzip(chunk, (err, decompressedChunk) => {
            if (err) {
                console.error('Error decompressing chunk:', err);
                callback();
            } else {
                // Append the decompressed chunk to the output file
                output.write(decompressedChunk, () => {
                    callback();
                });
            }
        });
    }, 4);



    input.on("data",(chunk)=>{
        queue.push(chunk)

    })

    input.pipe(zlib.createGzip()).pipe(output2);

// Pipe the input stream through the decompressor and then to the output stream


//     input.pipe(decompressor).pipe(output);
    output.on('finish', () => {
        console.log('queue complete.');
        console.log(new Date().getTime())
    });
    output2.on('finish', () => {

        console.log('raw complete.');
        console.log(new Date().getTime())
    });
}

function gzipFile(){
    const inputFilePath = './BATALIONA.pptx'; // Replace with your input file path
    const outputFilePath = './output.gz'; // Replace with your output file path

// Create a readable stream from the input file
    const input = fs.createReadStream(path.join(__dirname, inputFilePath));

// Create a writable stream to the output file, gzipping the data
    const output = fs.createWriteStream(path.join(__dirname, outputFilePath));

// Pipe the input through the gzip stream to the output
    input.pipe(zlib.createGzip()).pipe(output);

// Handle the completion of the gzip process
    output.on('finish', () => {
        console.log('File successfully gzipped.');
    });
}