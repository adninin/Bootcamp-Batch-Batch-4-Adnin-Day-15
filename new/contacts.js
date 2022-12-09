//Require File System
const fs = require('fs')

//Require ejs
const { name } = require('ejs')

//Ask apakah sudah ada folder data atau belum
const dirPath = './data'

//Membuat file contact.json apabila file belum exist
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

//Ask apakah sudah ada folder data dan file contacts.json atau belum
const dataPath = './data/contacts.json'

//Membuat file contact.json apabila file belum exist
if(!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8') //Menggunakan kurung siku [] karena filenya berformat json
}

//Mengambil data dari json
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(file)
    return contacts
}

//Function find contact by name
const findContact = (nama) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

//Add new contacts to json
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

//Add new contact 
const addCont = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

//Function duplicate name
const duplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama === nama)
}

//Funct delete contact
const deleteCont = (nama) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama)
    saveContacts(filteredContacts)
}

//Func update data contact
const updateCont = (newcont) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== newcont.oldName)
    delete newcont.oldName
    filteredContacts.push(newcont)
    saveContacts(filteredContacts)
}

//Ekspor function
module.exports = { loadContact, findContact, addCont, duplikat, deleteCont, updateCont }