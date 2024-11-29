const express = require('express');
const multer = require('multer');
const Person = require('../controllers/Person');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/uploadFile', upload.single('file'), Person.uploadFile);
router.post('/extract', upload.single('file'), Person.savePerson);
router.get('/sortList', Person.sortList);

module.exports = router;