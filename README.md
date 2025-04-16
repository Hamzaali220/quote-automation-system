Quote Automation System — AI-Powered Quoting Platform

Environment Setup

1. Clone the Repository

2. Configure .env
Create a .env file in the root of server folder:

PORT=5000
MONGO_URI=mongodb+srv://username:password@qouteprediction.xka35my.mongodb.net/quotePrediction?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_key
SESSION_SECRET=qwerty5544332211
PYTHON_ROOT=Python root folder in your system
BASE_URL=http://localhost:5000

3. Install Node.js Dependencies
cd server
npm install

4. Install Python Dependencies
pip install -r ai/requirements.txt

5. Train the AI Model (Optional CLI)
To train the pricing model on manually prepared CSV:
python ai/train_model.py


6. Admin Panel
Access at:
http://localhost:5000/admin

Credentials:
Email:    admin@odensai.com  
Password: admin@123

7. Upload PDFs of historical quotes
Goto train model module and Upload PDFs of historical quotes.

8. Train Model
Click on train model button and wait for trainig process complition.

Here you go to use AI-Powered Quoting Platform just click on Generate new quote fill up required fields for new quote and you will see the pdf file for newly created quotation.