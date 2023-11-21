const fs = require("fs");
const wordpressService = require("../lib/WordpressService");
beforeEach(() => {
    const newsFile = JSON.parse(fs.readFileSync('tests/integration/testData/news.json',{encoding:'utf8', flag:'r'}))
    jest.spyOn(wordpressService.prototype, 'getNews').mockResolvedValue(newsFile);
})

afterEach(() => {
    jest.restoreAllMocks()
})
