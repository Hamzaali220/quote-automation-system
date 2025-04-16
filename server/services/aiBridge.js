const { spawn } = require('child_process');
const path = require('path');
const pythonRoot = process.env.PYTHON_ROOT || 'C:\\Users\\ProBook_640.G8\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';

const predictPrice = (inputData) => {
    
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '..', '..', 'ai', 'predict_price.py');
        const inputJSON = JSON.stringify(inputData);
        const python = spawn(pythonRoot, [scriptPath, inputJSON]);

        // console.log('Input data for prediction: hereeeeeee', python);
        let result = '';
        let error = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
            // console.log('Result data for prediction: hereeeeeee', result);
        });
        python.stderr.on('data', (data) => {
            error += data.toString();
        });
        python.on('close', (code) => {
            if (code !== 0 || error) {
                reject(new Error(`Python Error: ${error}`));
            } else {
                const price = result.includes('Predicted Price:') ? parseFloat(result.split('Predicted Price:')[1].trim()) : null;
                
                console.log('Predicted price***:', price);  
                resolve(price);
            }
        });
    });
};
const trainModel = () => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '..', '..', 'ai', 'train_model.py');
        const python = spawn(pythonRoot, [scriptPath]);

        let result = '';
        let error = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });
        python.stderr.on('data', (data) => {
            error += data.toString();
        });
        python.on('close', (code) => {
            if (code !== 0 || error) {
                reject(new Error(`Python Error: ${error}`));
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { predictPrice, trainModel };
