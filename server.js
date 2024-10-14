// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3000;


// const budget =require('./budget.json');
// app.use(cors());
// app.use(express.json()); // Middleware to parse JSON requests
// app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests

// const mongoose = require('mongoose')

// const budgetModel = require('./models/budget_schema')

// let url = 'mongodb://127.0.0.1:27017/budgetdatabase';


// app.get('/hello', (req, res) => {
//     res.send('Hello World! I am Gaurav');
// });


// app.use('/', express.static('public'));


// app.get('/budget', (req, res) => {
//     mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(() => {
//             console.log("Connected to database")
//             // Fetch
//             budgetModel.find({})
//                 .then((data) => {
//                     res.send(data);
//                     mongoose.connection.close();
//                 })
//                 .catch((connectionError) => {
//                     console.log(connectionError);
//                 })
//         })
//         .catch((connectionError) => {
//             console.log(connectionError);
//         })
// });

// app.post("/addBudgetData", (req, res) => {

//     mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(() => {
//             // Insert
//             let newData = new budgetModel(req.body);
//             budgetModel.insertMany(newData)
//             .then((data)=>{

//                 res.send("Data Entered Successfully")
//                 mongoose.connection.close();
//             })
//             .catch((connectionError)=>{
//                 res.send(connectionError.message)
//             })
//         })
//         .catch((connectionError) => {
//             res.send(connectionError);
//         })
// })

// app.listen(port, () => {
//     console.log(`API served at http://localhost:${port}`)
// });





const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  // Mongoose import should be at the top
const budgetModel = require('./models/budget_schema');  // Budget schema model

const app = express();
const port = 3000;

// MongoDB URL
let url = 'mongodb://127.0.0.1:27017/budgetdatabase';

// Middleware to parse JSON and URL-encoded requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB only once when the server starts
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Route for testing
app.get('/hello', (req, res) => {
    res.send('Hello World! I am Gaurav');
});

// Serve static files (optional)
app.use('/', express.static('public'));

// Get budget data from MongoDB
app.get('/budget', (req, res) => {
    budgetModel.find({})
        .then((data) => {
            res.status(200).json(data);  // Send data with 200 OK status
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).json({ message: 'Error fetching budget data' });
        });
});

// Add new budget data
app.post('/addBudgetData', (req, res) => {
    const { title, budget, color } = req.body;

    // Ensure all fields are provided
    if (!title || !budget || !color) {
        return res.status(400).json({ message: 'All fields (title, budget, color) are required' });
    }

    // Create a new document using the schema model
    const newData = new budgetModel({
        title,
        budget,
        color
    });

    // Insert the new budget entry into the database
    newData.save()
        .then((data) => {
            res.status(201).json({ message: 'Data added successfully', data });
        })
        .catch((error) => {
            console.error('Error adding data:', error);
            res.status(500).json({ message: 'Error adding budget data' });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
