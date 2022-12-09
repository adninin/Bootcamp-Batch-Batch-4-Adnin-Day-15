//Require morgan
//const morgan = require('morgan')

//Require express
const express = require('express')

//Require ejs layout
const expressLayouts = require('express-ejs-layouts')

//Require function dari folder new, file contact.js
const { loadContact, findContact, addCont, duplikat, deleteCont, updateCont } = require('./new/contacts')

//Require express validator
const { body, validationResult, check } = require('express-validator')
const res = require('express/lib/response')
const req = require('express/lib/request')

const app = express()
const port = 3000

//Setup view engine ejs
app.set('view engine', 'ejs')

//Setup express layout ejs (third-party middleware)
app.use(expressLayouts)

//Setup express ejs (built-in middleware)
app.use(express.static('public'));

//Middleware
app.use(express.urlencoded({
  extended: true
}))

//Setup morgan ejs
//app.use(morgan('dev'))

//Menggunakan middleware
// app.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()
// })

//Menghubungkan ke index.ejs (tampilan awal)
app.get('/', (req, res) => {
  res.render('index', //render ke file index
  //value yang dikirim ke index.ejs
  { nama: 'Anin', 
  title: 'Home Page',
  layout: 'layout/lay',
  o : '1'//untuk mengaktifkan navbar ketika di klik
}) 
})

//Menghubungkan ke about.ejs
app.get('/about', (req, res) => {
  res.render('about', //render ke file about
   //value yang dikirim ke about.ejs
 { title: 'About Page',
   layout: 'layout/lay',
   y : 'l'//untuk mengaktifkan navbar ketika di klik
  })
   //next()
})

//Menghubungkan ke contact.ejs
app.get('/contact', (req, res) => {
  //Membuat variable contact
  const contacts = loadContact()
//Menampilkan file contact.ejs ke browser
res.render('contact', {//render ke file contact
   //value yang dikirim ke contact.ejs
  title:'Contact Page',
  layout: 'layout/lay',
  contacts,
  x : '1'//untuk mengaktifkan navbar ketika di klik
   })
})

//Add new contact page
app.get('/contact/add', (req, res) => {
  res.render('addcontact', { //render ke file add contact
    //value yang dikirim ke addcontact.ejs
  title: 'Add new contact page',
  layout: 'layout/lay',
   })
})

//Data add contact
app.post('/contact', 
[
  body('nama').custom((value, { req }) => {
    const duplicate = duplikat(value) //Membuat variable duplikat nama
    if (value !== req.body.oldName && duplicate) { //Menimpa nama lama dan mengecek nama yg dimasukkan duplikat atau tidak
      throw new Error('Nama sudah terdaftar!')//Tulisan yg akan muncul apabila nama yang dimasukkan duplikat
    }
    return true
  }),
  check('email', 'Email tidak valid!').isEmail(), //Validator email dan tulisan yang akan muncul apabila format yang dimasukkan salah
  check('mobile', 'No tidak valid!').isMobilePhone('id-ID') //Validator mobilephone dan tulisan yang akan muncul apabila format yang dimasukkan salah
],

  (req, res) => {
    //error function
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
   res.render('addcontact', { //render ke file add contact
    //value yang dikirim ke addcontact.ejs
    title: 'Add new contact page',
    layout: 'layout/lay',
    errors: errors.array(),
   })
  } else {
    //Jika berhasil
  addCont(req.body)
  res.redirect('/contact') //kembali ke halaman contact
}})

//Delete data contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama)
  //error yg akan muncul apabila data yg dimasukkan salah
  if (!contact) {
    req.status(404)
    res.send('Error : Page Not Found!')
    //jika berhasil
  } else {
    deleteCont(req.params.nama)
    res.redirect('/contact') //kembali ke halaman contact
  }
})

//Edit data contact
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama)
  res.render('editcont', { //render ke file edit contact
    //value yang dikirim ke editcont.ejs
    title: 'Edit Contact Page',
    layout: 'layout/lay',
    contact,
  })
})

//Update data contact
app.post('/contact/update', 
[
  body('nama').custom((value, { req }) => {
    const duplicate = duplikat(value) //Membuat variable duplikat nama
    if (value !== req.body.oldName && duplicate) { //Menimpa nama lama dan mengecek nama yg dimasukkan duplikat atau tidak
      throw new Error('Nama sudah terdaftar!')//Tulisan yg akan muncul apabila nama yang dimasukkan duplikat
    }
    return true
  }),
  check('email', 'Email tidak valid!').isEmail(), //Validator email dan tulisan yang akan muncul apabila format yang dimasukkan salah
  check('mobile', 'Nomor tidak valid!').isMobilePhone('id-ID') //Validator mobilephone dan tulisan yang akan muncul apabila format yang dimasukkan salah
],

(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('editcont', {//render ke file edit contact
      //value yang dikirim ke addcontact.ejs
      title: 'Edit Contact Page',
      layout: 'layout/lay',
      errors: errors.array(),
      contact: req.body
  })
} else { //jika berhasil
  updateCont(req.body)
  res.redirect('/contact')//kembali ke halaman contact
}
})

//Menghubungkan ke contact.ejs
app.get('/contact/:nama', (req, res) => {
  //Variable find contact
  const contact = findContact(req.params.nama)
//Menampilkan file detail.ejs ke browser
res.render('detail', {
   //value yang dikirim ke contact.ejs
  title:'Detail Contact Page',
  layout: 'layout/lay',
  contact,
  nama: req.params.nama,
   })
})

//app.get('/product/:id', (req, res) => {
 // res.send(`product id : ${req.params.id} <br> category id : ${req.query.category}`)
//})

//Error
app.use('/', (req, res) => {
  res.status(404)
  res.send('Error : Page not found!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

