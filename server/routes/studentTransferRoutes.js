const express = require('express');
const router = express.Router();
const studentTransferController = require('../controllers/studentTransferController');

router.post('/', studentTransferController.createStudentTransfer);
router.put('/:id', studentTransferController.updateStudentTransfer);
router.delete('/:id', studentTransferController.deleteStudentTransfer);
router.put('/active/:id', studentTransferController.ActiveStudentTransfer);
router.get('/', studentTransferController.getStudentTransfers);
router.get('/inactive', studentTransferController.getInactiveStudentTransfers);
router.get('/:id', studentTransferController.getStudentTransferById);

module.exports = router;