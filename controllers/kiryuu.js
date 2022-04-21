const {default: Axios} = require('axios')
const cheerio = require('cheerio')  
const url = require('../helpers/urls')
const kiryuuUrl = url.kiryuuUrl

exports.home = async (req, res) => {
    try{
        const response = await Axios(kiryuuUrl);
        const $ = cheerio.load(response.data);
        const popularElement = $('.hotslid > .bixbox > .listupd')
        const newSeriesElement = $('#sidebar > .section > span > .serieslist > ul')
        const newReleaseElement = $('.postbody > .bixbox > .listupd')

        let home = {};
        let popular = [];
        let newSeries = [];
        let newRelease = [];

        home.wrapper_id = $('.wrapper > center > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
        home.wrapper_img = $('.wrapper > center > a > img').attr('src');

        popularElement.find('.bs').each((i, el) => {
            let id, title, img, rating, type, chapter;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            popular.push({id, title, img, type, rating});
        })

        newSeriesElement.find('li').each((i, el) => {
            let id, title, img;

            id = $(el).find('.imgseries > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            img = $(el).find('.imgseries > a > img').attr('src');
            title = $(el).find('.leftseries > h2 > a').text().trim();

            newSeries.push({id, title, img});
        })

        newReleaseElement.find('.utao').each((i, el) => {
            
            if(i > 8){
                let id = $(el).find('.uta > .luf > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
                let title = $(el).find('.uta > .luf > a > h4').text();
                let img = $(el).find('.uta > .imgu > a > img').attr('src');
                let chapter = $(el).find('.uta > .luf > ul > li:nth-child(1) > a').text().trim();
                let update_on = $(el).find('.uta > .luf > ul > li:nth-child(1) > span').text().trim();

                newRelease.push({id, title, img, chapter, update_on});
            }

        })

        home.new_release = newRelease;
        home.popular = popular;
        home.new_series = newSeries

        res.status(200).json({
            status: 'success',
            home
        })
    }catch(e){
        console.log(e.message);
    }
}

exports.detail = async (req, res) => {
    const id = req.params.id;
    const url = `${kiryuuUrl}manga/${id}`;

    try{
        const response = await Axios(url)
        const $ = cheerio.load(response.data)
        const episodeElement = $('#chapterlist > ul')
        const genreElement = $('.seriestugenre')

        let manga = {};
        let chapter = [];
        let genres = [];

        manga.banner = $('.bigcover > .bigbanner').attr('style').replace("background-image: url('", '').replace("');", '');
        manga.img = $('.terebody > .postbody > article > .seriestucon > .seriestucontent > .seriestucontl > .thumb > img').attr('src');
        manga.title =  $('.terebody > .postbody > article > .seriestucon > .seriestuheader > h1').text().replace('Bahasa Indonesia', '').trim();
        manga.status = $('.infotable > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim();
        manga.type = $('.infotable > tbody > tr:nth-child(2) > td:nth-child(2)').text().trim();
        manga.author = $('.infotable > tbody > tr:nth-child(4) > td:nth-child(2)').text().trim();
        manga.rating = $('.seriestucontl > .rating > .rating-prc > .num').text().trim();
        manga.synopsis = $('.terebody > .postbody > article > .seriestucon > .seriestucontent > .seriestucontentr > .seriestuhead > div > p').text()

        genreElement.find('a').each((i, el) => {
            let id = $(el).attr('href').replace(`${kiryuuUrl}genres/`, '');
            let title = $(el).text().trim();

            genres.push({id, title});
        })

        episodeElement.find('li').each((i, el) => {
            let id = $(el).find('.chbox > .eph-num > a').attr('href').replace(`${kiryuuUrl}`, '');
            let title = $(el).find('.chbox > .eph-num > a > .chapternum').text().trim();
            let upload_on = $(el).find('.chbox > .eph-num > a > .chapterdate').text().trim();

            chapter.push({id, title, upload_on});
        })

        manga.genres = genres;
        manga.chapters = chapter;
        res.status(200).json({
            status: 'success',
            manga
        })

    }catch(e){
        console.log(e.message);
    }

}

exports.new_update = async (req, res) => {
    const page = req.params.page;
    const url = `${kiryuuUrl}manga/?page=${page}&order=update`;

    try{
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        const element = $('.mrgn > .listupd');

        let data = [];

        element.find('.bs').each((i, el) => {
            let id, title, img, rating, type, chapter;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            data.push({id, title, img, type, rating});
        })

        res.status(200).json({
            status: 'success',
            data
        })

    }catch(e){
        console.log(e.message);
    }
}

exports.manga_list = async (req, res) => {
    const page = req.params.page;
    const url = `${kiryuuUrl}manga/?page=${page}&status=&type=manga&order=`;

    try{
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        const element = $('.mrgn > .listupd');

        let data = [];

        element.find('.bs').each((i, el) => {
            let id, title, img, rating, type, chapter;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            data.push({id, title, img, type, rating});
        })

        res.status(200).json({
            status: 'success',
            data
        })

    }catch(e){
        console.log(e.message);
    }
}

exports.manhwa_list = async (req, res) => {
    const page = req.params.page;
    const url = `${kiryuuUrl}manga/?page=${page}&status=&type=manhwa&order=`;

    try{
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        const element = $('.mrgn > .listupd');

        let data = [];

        element.find('.bs').each((i, el) => {
            let id, title, img, rating, type, chapter;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            data.push({id, title, img, type, rating});
        })

        res.status(200).json({
            status: 'success',
            data
        })

    }catch(e){
        console.log(e.message);
    }
}

exports.manhuwa_list = async (req, res) => {
    const page = req.params.page;
    const url = `${kiryuuUrl}manga/?page=${page}&status=&type=manhua&order=`;

    try{
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        const element = $('.mrgn > .listupd');

        let data = [];

        element.find('.bs').each((i, el) => {
            let id, title, img, rating, type, chapter;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            data.push({id, title, img, type, rating});
        })

        res.status(200).json({
            status: 'success',
            data
        })

    }catch(e){
        console.log(e.message);
    }
}

exports.chapter = async (req, res) => {
    const id = req.params.id;
    const url = `${kiryuuUrl}${id}`;
    console.log(url);

    try{
        const response = await Axios(url);
        const $ = cheerio.load(response.data);

        let chapter = {};

        chapter.title = $('.entry-title').text().replace('Bahasa Indonesia', '').trim();

        chapter.data = $('#readerarea').text().replace('<p>', '').replace('</p>', '')
            .replace(" ", '').replace("img", '')
            .replace(/src='|'><|'>|<|/gi, '').split('img ')

        res.status(200).json({
            status: 'success',
            chapter
        })
    }catch(e){
        console.log(e.message);
    }
}

exports.search = async (req, res) => {
    const q = req.params.q;
    const page = req.params.page;
    const url = `${kiryuuUrl}page/${page}/?s=${q}`;

    try {
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        
        const element = $('.postbody > .bixbox > .listupd');

        let data = [];

        element.find('.bs').each((i, el) => {
            let id, title, img, rating, type, chapter;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            data.push({id, title, img, type, rating});
        })

        res.status(200).json({
            status: 'success',
            data
        })


    }catch(e){
        console.log(e.message);
    }

}

exports.genre_list = async (req, res) => {
    const url = `${kiryuuUrl}manga`;

    try {
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        
        const element = $('.dropdown-menu.c4.genrez');

        let data = [];

        element.find('li').each((i, el) => {
            data.push({
                id: $(el).find('input').attr('value'),
                title: $(el).find('label').text().trim()
            });
        })

        res.status(200).json({
            status: 'success',
            data
        })


    }catch(e){
        console.log(e.message);
    }
}

exports.genre_detail = async (req, res) => {
    const id = req.params.id;
    const page = req.params.page;
    const url = `${kiryuuUrl}manga/?page=${page}&genre%5B%5D=${id}`;

    try {
        const response = await Axios(url);
        const $ = cheerio.load(response.data);
        
        const element = $('.mrgn > .listupd');

        let data = [];

        element.find('.bs').each((i, el) => {
            let id, title, img, rating, type;

            id = $(el).find('.bsx > a').attr('href').replace(`${kiryuuUrl}manga/`, '');
            title = $(el).find('.bsx > a > .bigor > .tt').text().trim();
            img = $(el).find('.bsx > a > .limit > img').attr('src').replace('-222x300', '')
                .replace('-211x300', '').replace('-210x300', '').replace('-210x300', '').replace('-209x300', '');
            type = $(el).find('.bsx > a > .limit > .type').attr('class').replace('type', '').trim();
            rating = $(el).find('.bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim();

            data.push({id, title, img, type, rating});
        })

        res.status(200).json({
            status: 'success',
            data
        })


    }catch(e){
        console.log(e.message);
    }
}