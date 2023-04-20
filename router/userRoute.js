const router = require('express').Router();
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')[1]
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
  }
})
const upload = multer({ storage: storage })

// const router = express.Router()
const { register, login, verification } = require('../controller/user')


router.post('/register', upload.single('file'), register)
router.post('/login', login);
router.post('/verify', verification)

module.exports = router;