// Install the modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

// Initialize server information
const app = express();
const port = 3000;

// Set up ejs, static directory, and body-parser
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Read file data
async function readContactsFile() {
    const data = await fs.readFile('./data/contacts.json', 'utf8');
    return JSON.parse(data);
}

// Write file data
async function writeContactsFile(contacts) {
    await fs.writeFile('./data/contacts.json', JSON.stringify(contacts));
}

// Go to Main page
app.get('/', async (req, res) => {
    try {
        const contacts = await readContactsFile();
        res.render('index', { contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


// Go to add page
app.get('/add', (req, res) => {
    res.render('add');
})

// Get new contact
app.post('/add', async (req, res) => {
    try {
        const newContact = req.body;
        const contacts = await readContactsFile();
        contacts.push(newContact);
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// Go to edit page
app.get('/edit/:index', async (req, res) => {
    try {
        const index = req.params.index;
        const contacts = await readContactsFile();
        const contact = contacts[index];
        res.render('edit', { index });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// Get updated contact
app.post('/edit/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const contacts = await readContactsFile();
        contacts[index] = req.body;
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// Go to view page
app.get('/view/:index', async (req, res) => {
    try{
        const index = req.params.index;
        const contacts = await readContactsFile();
        const contact = contacts[index];
        res.render('view', { contact });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// Delete a contact
app.get('/delete/:index', async (req, res) => {
    try {
        const index = req.params.index;
        const contacts = await readContactsFile();
        contacts.splice(index, 1);
        res.redirect('/');
        await writeContactsFile(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
