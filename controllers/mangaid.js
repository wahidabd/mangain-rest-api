const {default: Axios} = require('axios')
const cheerio = require('cheerio')  
const url = require('../helpers/urls')
const mangaidUrl = url.mangaidUrl

exports.home = async (req, res) => {
    try {
        const response = await Axios(mangaidUrl)
        const $ = cheerio.load(response.data)
        const hotElement = $('.row > .col-sm-12 > .row > .col-sm-12 > .row.content');

        const home = {}
        let hotMangat = []

        hotElement.find('.col-sm-3').each((i, el) => {
            let title = $(el).find('.media.manga-item > .media-body > h3 > a').text()
            hotMangat.push({title})
        })

        home.hotMangat = hotMangat

        res.status(200).json({
            status: 'success',
            home
        })
    }catch(e){
        return e.message;
        console.log(e.message)
    }
}