const express = require('express')
const router = express.Router()
const {getBatch, createBatch, getSingleBatch, downloadStudent, deleteBatch}  = require("../controllers/batchCtrl")
const {authorize} = require('../middlewares/authMiddleware')


router.get("/",authorize, getBatch)
router.get("/:id",authorize, getSingleBatch)
router.get("/:id/download",authorize, downloadStudent)
router.get('/:id/delete', authorize, deleteBatch)

router.post("/", authorize, createBatch)


module.exports = router;