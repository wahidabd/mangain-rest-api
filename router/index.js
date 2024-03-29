const express = require('express')
const router = express.Router()
const kiryuuController = require('../controllers/kiryuu')
const mangaidController = require('../controllers/mangaid')
const komikcastController = require('../controllers/komikcast')
const komikindoController = require('../controllers/komikindo')
const komikuController = require('../controllers/komiku')

router.get('/kiryuu-home', kiryuuController.home)
router.get('/kiryuu-new-update/:page', kiryuuController.new_update)
router.get('/kiryuu-manga-list/:page', kiryuuController.manga_list)
router.get('/kiryuu-manhwa-list/:page', kiryuuController.manhwa_list)
router.get('/kiryuu-manhua-list/:page', kiryuuController.manhuwa_list)
router.get('/kiryuu-detail/:id', kiryuuController.detail)
router.get('/kiryuu-chapter/:id', kiryuuController.chapter)
router.get('/kiryuu-search/:q/page/:page', kiryuuController.search)
router.get('/kiryuu-genres', kiryuuController.genre_list)
router.get('/kiryuu-genre/:id/page/:page', kiryuuController.genre_detail)


router.get('/home', komikindoController.home)
router.get('/komikindo-detail/:id', komikindoController.detail)
router.get('/komikindo-ch/:id', komikindoController.chapter)
router.get('/komikindo-genres', komikindoController.genres)
router.get('/komikindo-genre/:id/page/:page', komikindoController.genre_list)
router.get('/komikindo-daftar/:page', komikindoController.daftar_komik)
router.get('/komikindo-manhwa/:page', komikindoController.manhwa)
router.get('/komikindo-manhua/:page', komikindoController.manhua)
router.get('/komikindo-komik/:page', komikindoController.komik)
router.get('/komikindo-search/:s/page/:page', komikindoController.search)

router.get('/komiku-home', komikuController.home)

module.exports = router