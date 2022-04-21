const express = require('express')
const router = express.Router()
const kiryuuController = require('../controllers/kiryuu')

router.get('/home', kiryuuController.home)

router.get('/kiryuu-new-update/:page', kiryuuController.new_update)
router.get('/kiryuu-manga-list/:page', kiryuuController.manga_list)
router.get('/kiryuu-manhwa-list/:page', kiryuuController.manhwa_list)
router.get('/kiryuu-manhua-list/:page', kiryuuController.manhuwa_list)
router.get('/kiryuu-detail/:id', kiryuuController.detail)
router.get('/kiryuu-chapter/:id', kiryuuController.chapter)
router.get('/kiryuu-search/:q/page/:page', kiryuuController.search)
router.get('/kiryuu-genres', kiryuuController.genre_list)
router.get('/kiryuu-genre/:id/page/:page', kiryuuController.genre_detail)

module.exports = router