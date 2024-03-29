const {default: Axios} = require('axios')
const cheerio = require('cheerio')  
const url = require('../helpers/urls')
const komikindoUrl = url.komikindoUrl

exports.home = async (req, res) => {
    try {
        const response = await Axios(komikindoUrl)
        const $ = cheerio.load(response.data)
        const popularDayElement = $('.postbody > .whites > .widget-body > .content > .post-show.mangapopuler > .listupd.customslider > .odadingslider')
        const newElement = $('.post-show.chapterbaru > .listupd.latestupdate-v2 > .animepost')
        const popularElement = $('.serieslist.pop > ul > li')

        const home = {}
        let popularDay = []
        let newManga = []
        let popular = []

        popularElement.each((i, el) => {
            let id = $(el).find('.imgseries > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title =  $(el).find('.leftseries > h4 > a').text()
            let cover =  $(el).find('.imgseries > a > img').attr('src')//.replace('i2.wp.com/', '').replace('?resize=59,83', '')
            let love = $(el).find('.leftseries > .loveviews').text()
            let num = $(el).find('.leftseries > div').text()

            if(cover != null){
                cover =  $(el).find('.imgseries > a > img').attr('src').replace('i2.wp.com/', '').replace('?resize=59,83', '')
            } else {
                cover = ""
            }

            popular.push({id, title, cover, love, num})
        })

        popularDayElement.find('.animepost').each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src')//.replace('i2.wp.com/', '').replace('?resize=146,208', '')
            let type = $(el).find('.animposx > a > .limit > .typeflag').attr('class').replace('typeflag ', '')
            let update_on = $(el).find('.animposx > .bigor > .adds > .lsch > .datech').text()
            
            if(cover != null){
                cover = $(el).find('.animposx > a > .limit > img').attr('src').replace('i2.wp.com/', '').replace('?resize=146,208', '')
            } else {
                cover = ""
            }

            popularDay.push({id, title, cover, type, update_on})
        })

        newElement.each((i, el) => {
            let id = $(el).find('.animposx > .animepostxx-top > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > .animepostxx-top > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > .animepostxx-top > a > .limietles > img').attr('src')//.replace('i2.wp.com/', '').replace('?resize=60,60', '')
            let status = $(el).find('.animposx > .animepostxx-bottom > .info-skroep > .flex-skroep.nginfo-skroep.status-skroep').text().replace('\n ', '').replace(' ', '')
            let type = $(el).find('.animposx > .animepostxx-top > .animepostxx-top-bottom > a > .info-skroep > div:nth-child(2)').text().replace('\n ', '').replace(' ', '')
            let rating = $(el).find('.animposx > .animepostxx-top > .animepostxx-top-bottom > a > .info-skroep > div:nth-child(1)').text().replace('\n ', '').replace(' ', '')
            let views = $(el).find('.animposx > .animepostxx-top > .animepostxx-top-bottom > a > .info-skroep > div:nth-child(3)').text().replace('\n ', '').replace(' ', '')
            let color = $(el).find('.animposx > .animepostxx-top > .animepostxx-top-bottom > a > .info-skroep > div:nth-child(4)').text().replace('\n ', '').replace('\n', '')

            if(cover != null){
                cover = $(el).find('.animposx > .animepostxx-top > a > .limietles > img').attr('src').replace('i2.wp.com/', '').replace('?resize=60,60', '')
            } else {
                cover = ""
            }

            newManga.push({id, title, cover, status, type, rating, views, color})
        })

        home.popular = popular
        home.new_manga = newManga
        home.popular_day = popularDay
        res.status(200).json({
            status: 'success',
            home
        })
    }catch(e){
        // res.json(e)
        console.log(e.message);
    }
}

exports.detail = async (req, res) => {
    const id = req.params.id
    const url = `${komikindoUrl}komik/${id}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const epsElement = $('.eps_lst > .listeps > #chapter_list')
        const genreElement = $('.genre-info')

        const manga = {}
        let genres = []
        let eps = []

        manga.title = $('.entry-title').text().replace('Komik ', '');
        manga.banner = $('.bigcover.thumbtocov > img').attr('src')
        manga.cover = $('.infoanime > .thumb > img').attr('src').replace('i2.wp.com/', '')
        manga.status = $('.infoanime > .infox > .spe > span:nth-child(2)').text().replace('Status: ', '').replace('Berjalan', 'Ongoing').replace('Tamat', 'Completed')
        manga.author = $('.infoanime > .infox > .spe > span:nth-child(3)').text().replace('Pengarang: ', '')
        manga.ilustrator = $('.infoanime > .infox > .spe > span:nth-child(4)').text().replace('Ilustrator: ', '')
        manga.grafis = $('.infoanime > .infox > .spe > span:nth-child(5)').text().replace('Grafis: ', '')
        manga.type = $('.infoanime > .infox > .spe > span:nth-child(6)').text().replace('Jenis Komik: ', '')
        manga.rating = $('.infoanime > .thumb > .rt > .ratingmanga > .rtg > .clearfix.archiveanime-rating > i').text()
        manga.vote = $('.infoanime > .thumb > .rt > .ratingmanga > .rtg > .clearfix.archiveanime-rating > .archiveanime-rating-content > .votescount').text()
        manga.synopsis = $('.tabsarea > #sinopsis > .whites > .desc > .entry-content.entry-content-single > p').text()

        if(manga.type !== "Manga" || manga.type !== "Manhwa" || manga.type !== "Manhua"){
            manga.type = $('.infoanime > .infox > .spe > span:nth-child(7)').text().replace('Jenis Komik: ', '')
        }

        genreElement.find('a').each((i, el) => {
            let title = $(el).text()
            let id = $(el).attr('href').replace('/genres/', '')
            genres.push({id, title})
        })

        epsElement.find('ul > li').each((i, el) => {
            let id = $(el).find('.lchx > a').attr('href').replace(`${komikindoUrl}`, '')
            let title = $(el).find('.lchx > a').text()
            let upload_on = $(el).find('.dt > a').text()
            eps.push({id, title, upload_on})
        })

        manga.genres = genres
        manga.eps = eps
        res.status(200).json({
            status: 'success',
            manga
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.chapter = async (req, res) => {
    const id = req.params.id
    const url = `${komikindoUrl}${id}`

    try{
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const chElemet = $('.chapter-content > #Baca_Komik > .imgch')

        const chapter = {}
        let data = [];

        chapter.title = $('.entry-title').text().replace('Komik ', '');
        chapter.prev = $('.navig > .nextprev > a:nth-child(1)').attr('href').replace(`${komikindoUrl}`, '')
        chapter.next = $('.navig > .nextprev > a:nth-child(4)').attr('href')

        if(chapter.prev.search('komik/') !== -1){
            chapter.prev = null
        }

        
        if(chapter.next == null) {

            chapter.next = $('.navig > .nextprev > a:nth-child(3)').attr('href').replace(`${komikindoUrl}`, '')
            let check = $('.navig > .nextprev > a:nth-child(3)').attr('target')
            console.log(check)

            if(check == "_blank" || chapter.next == null){
                chapter.next = null
            }else{
                chapter.next = $('.navig > .nextprev > a:nth-child(3)').attr('href').replace(`${komikindoUrl}`, '')
            }
        }else{
            chapter.next = $('.navig > .nextprev > a:nth-child(4)').attr('href').replace(`${komikindoUrl}`, '')
        }

        chElemet.find('#chimg-auh > img').each((i, el) => {
            let img = $(el).attr('src')
            let num = i
            data.push({num, img})
        })

        chapter.data = data;
        res.status(200).json({
            status: 'success',
            chapter
        })

    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.genres = async (req, res) => {
    try {
        const response = await Axios(`${komikindoUrl}daftar-komik`)
        const $ = cheerio.load(response.data)
        const element = $('.quickfilter > .filters > div:nth-child(1) > ul > li')

        let genres = []

        element.each((i, el) => {
            let id = $(el).find('input').attr('value')
            let title = $(el).find('label').text()

            genres.push({id, title})
        })

        res.status(200).json({
            status: 'success',
            genres
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.genre_list = async (req, res) => {
    const id = req.params.id
    const page = req.params.page
    const url = `${komikindoUrl}daftar-komik/page/${page}/?genre%5B0%5D=${id}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const element = $('.film-list > .animepost')

        const data = []

        element.each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src').replace('i2.wp.com/', '').replace('?resize=146,208', '')
            let type = $(el).find('.animposx > a > .limit > span').attr('class').replace('typeflag ', '')
            let rating = $(el).find('.animposx > .bigors > .adds > .rating > i').text()

            data.push({id, title, cover, type, rating})

        })

        res.status(200).json({
            status: 'success',
            data
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.daftar_komik = async (req, res) => {
    const page = req.params.page
    const url = `${komikindoUrl}daftar-komik/page/${page}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const element = $('.film-list > .animepost')

        const data = []

        element.each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src')
            let type = $(el).find('.animposx > a > .limit > span').attr('class').replace('typeflag ', '')
            let rating = $(el).find('.animposx > .bigors > .adds > .rating > i').text()

            if(cover != null){
                cover = $(el).find('.animposx > a > .limit > img').attr('src').replace('i2.wp.com/', '').replace('?resize=146,208', '')
            } else {
                cover = ""
            }

            data.push({id, title, cover, type, rating})

        })

        res.status(200).json({
            status: 'success',
            data
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.manhwa = async (req, res) => {
    const page = req.params.page
    const url = `${komikindoUrl}manhwa/page/${page}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const element = $('.film-list > .animepost')

        const data = []

        element.each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src')
            let type = $(el).find('.animposx > a > .limit > span').attr('class').replace('typeflag ', '')
            let rating = $(el).find('.animposx > a > .bigors > .adds > .rating > i').text()

            if(cover != null){
                cover = $(el).find('.animposx > a > .limit > img').attr('src').replace('i2.wp.com/', '').replace('?resize=146,201', '')
            } else {
                cover = ""
            }

            data.push({id, title, cover, type, rating})

        })

        res.status(200).json({
            status: 'success',
            data
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.manhua = async (req, res) => {
    const page = req.params.page
    const url = `${komikindoUrl}manhua/page/${page}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const element = $('.film-list > .animepost')

        const data = []

        element.each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src')
            let type = $(el).find('.animposx > a > .limit > span').attr('class').replace('typeflag ', '')
            let rating = $(el).find('.animposx > a > .bigors > .adds > .rating > i').text()

            if(cover != null){
                cover = $(el).find('.animposx > a > .limit > img').attr('src').replace('i2.wp.com/', '').replace('?resize=146,201', '')
            } else {
                cover = ""
            }

            data.push({id, title, cover, type, rating})

        })

        res.status(200).json({
            status: 'success',
            data
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.komik = async (req, res) => {
    const page = req.params.page
    const url = page === "1" ? `${komikindoUrl}komik-terbaru` :  `${komikindoUrl}komik-terbaru/page/${page}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const element = $('.film-list > .listupd > .animepost')

        const data = []

        element.each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src')
            let type = $(el).find('.animposx > a > .limit > span').attr('class').replace('typeflag ', '')
            let update_on = $(el).find('.animposx > .bigor > .adds > .lsch > .datech').text()

            if(cover != null){
                cover.replace('i2.wp.com/', '').replace('?resize=146,208', '')
            } else {
                cover = ""
            }

            data.push({id, title, cover, type, update_on    })

        })

        res.status(200).json({
            status: 'success',
            data
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}

exports.search = async (req, res) => {
    const s = req.params.s
    const page = req.params.page
    const url = `${komikindoUrl}page/${page}/?s=${s}`

    try {
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const element = $('.film-list > .animepost')

        const data = []

        element.each((i, el) => {
            let id = $(el).find('.animposx > a').attr('href').replace(`${komikindoUrl}komik/`, '')
            let title = $(el).find('.animposx > a').attr('title').replace('Komik ', '')
            let cover = $(el).find('.animposx > a > .limit > img').attr('src').replace('i2.wp.com/', '').replace('?resize=146,208', '')
            let type = $(el).find('.animposx > a > .limit > span').attr('class').replace('typeflag ', '')
            let rating = $(el).find('.animposx > .bigors > .adds > .rating > i').text()

            if(type === 'hot'){
                type = $(el).find('.animposx > a > .limit > .typeflag').attr('class').replace('typeflag ', '')
            }

            data.push({id, title, cover, type, rating})

        })

        res.status(200).json({
            status: 'success',
            data
        })
    }catch(e){
        res.json(e)
        console.log(e.message);
    }
}