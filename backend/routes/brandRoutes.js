const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authMiddleware } = require('../middleware/auth');

// All brand routes require authentication
router.use(authMiddleware);

router.get('/', brandController.getUserBrands);
router.post('/', brandController.createBrand);
router.get('/:id', brandController.getBrandById);
router.patch('/:id/direction', brandController.updateBrandDirection);
router.patch('/:id/palette', brandController.updateBrandPalette);
router.post('/:id/generate', brandController.generateBrandAssets);
router.get('/:id/consistency', brandController.getConsistencyReport);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
