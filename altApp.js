// Imports the packages
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bp = require('body-parser');
const contacts = require('./data/contacts.json');

// Sets up ejs, static directories, and body-parser
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));
app.use(express.static('./views'));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

// Main Page
app.get('/', (req, res) => {
    const contacts = require('./data/contacts.json');
    res.status(200).render('./index', { contacts: contacts });
})

// Go to Add Page
app.get('/add', (req, res) => {
    res.status(200).render('./add');
})

// Add a new contact
app.post('/add', (req, res) => {
    const newContact = req.body;
    contacts.push(newContact);
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));

    res.redirect('/');
})

// Go to edit page
app.get('/edit/:index', (req, res) => {
    let index = req.params.index;
    const contact = contacts[index];
    res.render('edit', { index });
})


// Edit the contact
app.post('/edit/:index', (req, res) => {
    let index = parseInt(req.params.index);
    contacts[index] = req.body;
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
    res.redirect('/');
})

// Delete a contact
app.get('/delete/:index', (req, res) => {
    const index = req.params.index;
    contacts.splice(index, 1);
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
    res.redirect('/');
})

// Go to a page with more information on the contacts
app.get('/view/:index', (req, res) => {
    let index = req.params.index;
    const contact = contacts[index];
    res.render('view', { contact })
})

// Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})