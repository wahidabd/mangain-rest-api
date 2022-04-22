const {default: Axios} = require('axios')
const cheerio = require('cheerio')  
const url = require('../helpers/urls')
const komikcastUrl = url.komikcastUrl

exports.home = async (req, res) => {
    try {
        const response = await Axios(komikcastUrl)
        const $ = cheerio.load(response.data)
        const hotElement = $('.bixbox.hothome > .listupd.komikinfo > div > .swipper-wrapper')

        const home = {}
        let hotManga = []

        hotElement.find('div').each((i, el) => {
            let title = $(el).find('.title').text()
            
            hotManga.push({title})
        })

        home.hotManga = hotManga

        res.status(200).json({
            status: 'success',
            home
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}