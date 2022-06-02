const {default: Axios} = require('axios')
const cheerio = require('cheerio')  
const url = require('../helpers/urls')
const komikuUrl = url.komikuUrl

exports.home = async(req, res) => {
    try{
        const response = await Axios(komikuUrl)
        const $ = cheerio.load(response.data)
        const trendingElement = $('#Trending > .perapih > .ls123')

        const home = {}
        let dataTrending = []

        trendingElement.find('.ls23').each((i, el) => {
            let id = $(el).find('.ls23v > a').attr('href');
            let title = $(el).find('.ls23j > a > h4').text()

            dataTrending.push({id, title})
        })

        home.trending = dataTrending

        res.status(200).json({
            status: 'Success',
            data: home
        })

    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}