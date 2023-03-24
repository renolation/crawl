import {Injectable} from "@nestjs/common";
import {truyenFullURL} from "../core/constants";
import {axiosParams, sleep} from "../core/helper";
import DomParser from 'dom-parser';
import jsdom from 'jsdom';
import {HttpService} from '@nestjs/axios';


 const { JSDOM } = jsdom;
import axios from "axios";
import * as cheerio from 'cheerio';
 const parser = new DomParser();

@Injectable()
export class TruyenFullService{
    constructor(
        private readonly httpService: HttpService

    ) {
    }

    async crawl1PageOfCategory(category: string, page: number){
        try {
            const res = await axios.get(`${truyenFullURL}the-loai/${category}/trang-${page}/`, axiosParams);
            await sleep(1500);


            const html = res.data;
            const $ = cheerio.load(html);

            //convert HTML collection to Array
            const nodeListArray  = Array.from($('.list.list-truyen.col-xs-12').eq(0).find('.row'));

            let storyList1Page = [];
            for (const node of nodeListArray) {
                const storyURL = $(node).find('.truyen-title').eq(0).find('a').eq(0).attr('href');
                console.log(storyURL);
                if(storyURL==null) continue;
                const story = await this.crawlStoryInfo(storyURL);

                storyList1Page.push(story)
            }

            console.log(`Đang tải thông tin thể loại ${category} ở trang ${page}`);

            return storyList1Page;
        } catch (err) {
            console.log(err);
        }
    }

    async crawlStoryInfo(storyUrl :string ){
        try {
            // const res = await https.get(`${storyUrl}`);
            // const axios = await this.httpService.get(`${storyUrl}`);
            // await sleep(500);
            // console.log(res);

            const response = await axios.get(`${storyUrl}`, axiosParams);
            const html = response.data;
            const $ = cheerio.load(html);

            const poster = $('.book').eq(0).find('img').eq(0).attr('src');
            const title = $('.title').eq(0).text().normalize();
            const author = $('.info').eq(0).find('div').eq(0).find('a').eq(0).text().normalize();
            const categories = Array.from($(".info").eq(0).find('div').eq(1).find('a'));
            const categoryList = categories.map(dom => {
                return $(dom).text().normalize();
            });
            const infoArray = Array.from($('.info').eq(0).find('div'));
            const status = $('.info').eq(0).find('div').eq(infoArray.length-1).find('span').eq(0).text().normalize();
            const description = $('.col-xs-12.col-sm-8.col-md-8.desc').eq(0)
                .find('div')
                .eq(3)
                .html()
                .replace(/<b>|<\/b>/g, '')
                .replace(/<i>|<\/i>/g, '')
                .replace(/&nbsp;/g, ' ')
                .normalize()
                .split('<br>');

            // const poster = dom.window.document
            //     .getElementsByClassName('book')[0]
            //     .getElementsByTagName('img')[0].src;

            // const title = dom.window.document
            //     .getElementsByClassName('title')[0].innerHTML.normalize();

            // const author1 = dom.window.document
            //     .getElementsByClassName('info')[0]
            //     .getElementsByTagName('div')[0]
            //     .getElementsByTagName('a')[0].innerHTML.normalize();




            // const domInfoArray = Array.from(dom.window.document
            //     .getElementsByClassName('info')[0]
            //     .getElementsByTagName('div'));


            // const status1 = dom.window.document
            //     .getElementsByClassName('info')[0]
            //     .getElementsByTagName('div')[domInfoArray.length - 1]
            //     .getElementsByTagName('span')[0].innerHTML.normalize();


            // const description1 = Array.from(dom.window.document
            //     .getElementsByClassName('col-xs-12 col-sm-8 col-md-8 desc')[0]
            //     .getElementsByTagName('div'))[3]
            //     // @ts-ignore
            //     .innerHTML
            //     .replace(/<b>|<\/b>/g, '')
            //     .replace(/<i>|<\/i>/g, '')
            //     .replace(/&nbsp;/g, ' ')
            //     .normalize()
            //     .split('<br>');


            return ({
                title: title,
                author: author,
                poster: poster,
                description: description,
                categoryList: categoryList,
                status: status,
            });
        } catch (err) {
            console.log();
        }
    }

    async getLastChapterIndexStory(title) {
        try {
            const response = await axios.get(`${truyenFullURL}${title}`, axiosParams);
            const html = response.data;
            const $ = cheerio.load(html);

            // const res = await https.get(`${truyenFullURL}${title}`);
            const ele = parser.parseFromString('res.text', 'text/html');
            const dom = new JSDOM(ele.rawHTML);

            // const domInfoArray = Array.from(dom.window.document
            //     .getElementsByClassName('info')[0]
            //     .getElementsByTagName('div'));
            // const status = dom.window.document
            //     .getElementsByClassName('info')[0]
            //     .getElementsByTagName('div')[domInfoArray.length - 1]
            //     .getElementsByTagName('span')[0].innerHTML.normalize();
            const infoArray = Array.from($('.info').eq(0).find('div'));
            const status = $('.info').eq(0).find('div').eq(infoArray.length-1).find('span').eq(0).text().normalize();



            if (status == 'Full') {
                // const domPaginationArray1 = Array.from(dom.window.document
                //     .getElementsByClassName('pagination pagination-sm')[0]
                //     .getElementsByTagName('li'));
                // const lastPageURL1 = domPaginationArray[domPaginationArray.length - 2]
                //     .getElementsByTagName('a')[0]
                //     .getAttribute('href');

                const domPaginationArray = Array.from($('.pagination.pagination-sm').eq(0)
                    .find('li')
                );
                const lastPageURL = $(domPaginationArray[domPaginationArray.length - 2]).find()
                    .find('a').attr('href');

                try {
                    const res2 = await axios.get(`${lastPageURL}`);
                    const html2 = res2.data;
                    const $$ = cheerio.load(html2);

                    // const domListChapterArray1 = Array.from(dom2.window.document
                    //     .getElementsByClassName('list-chapter')[0]
                    //     .getElementsByTagName('li'));
                    //
                    // const lastChapterIndex1 = domListChapterArray[domListChapterArray.length - 1]
                    //     .getElementsByTagName('a')[0]
                    //     .getAttribute('href')
                    //     .split('chuong-')[1]
                    //     .replace('/','');

                    const domListChapterArray = $$('.list-chapter').eq(0)
                        .find('li');
                    const lastChapterIndex = $$(domListChapterArray[domListChapterArray.length -1])
                        .find('a').eq(0)
                        .attr('href')
                        .split('chuong-')[1]
                        .replace('/','');


                    return lastChapterIndex;
                } catch (err) {
                    console.log(err)
                }
            }
            else if (status != 'Full'){
                // const domListChapterArray1 = Array.from(dom.window.document
                //     .getElementsByClassName('l-chapters')[0]
                //     .getElementsByTagName('li'));
                //
                // const lastChapterIndex1 = domListChapterArray[0]
                //     .getElementsByTagName('a')[0]
                //     .getAttribute('href')
                //     .split('chuong-')[1]
                //     .replace('/','');

                const domListChapterArray = Array.from($('.l-chapters').eq(0)
                    .find('li'));

                const lastChapterIndex = $(domListChapterArray[0]).find('a').eq(0)
                    .attr('href')
                    .split('chuong-')[1]
                    .replace('/','');

                return lastChapterIndex;
            }
        } catch (err) {
            console.log(err);
        }
    }

    async crawl1Chapter(title, index) {
        try {
            const response = await axios.get(`${truyenFullURL}${title}/chuong-${index}/`, axiosParams);
            const html = response.data;
            const $ = cheerio.load(html);
            // const header1 = dom.window.document.getElementsByClassName('chapter-title')[0].getAttribute("title")
            //     .split('- ')[1];

            const header = $('.chapter-title').eq(0).attr('title').split('- ')[1];

            //replace all <br> tags to '<<' to split the paragraph easier
            // const body1 = dom.window.document.getElementsByClassName('chapter-c')[0].innerHTML
            //     .replace(/<i>|<\/i>|<b>|<\/b>/g, '')
            //     .replace(/<br>&nbsp;<br>/g, '<<')
            //     .replace(/<br><br>/g, '<<')
            //     .split('<<');

            const body = $('.chapter-c').eq(0).text()
                .replace(/<i>|<\/i>|<b>|<\/b>/g, '')
                .replace(/<br>&nbsp;<br>/g, '<<')
                .replace(/<br><br>/g, '<<')
                .split('<<');


            console.log(`Đang tải ${title} chương ${index}...`);

            return ({
                header: header,
                body: body,
            });
        } catch (err) {
            if (err.status == 503) {
                console.log('Too many requests!');
            }
            else if (err.status == 404) {
                console.log(`Story ${title} not found!`);
            }
            else {
                console.log(err);
            }
        }
    }

    async crawlMultipleChapters(title, beginChap, endChap) {
        let chapterList = [];
        for (var i = beginChap; i <= endChap; i++) {
            let chapter = await this.crawl1Chapter(title, i);

            if (i % 3 == 0) {
                await sleep(3000);
            }

            if (chapter == null) {
                break;
            }
            else {
                chapterList.push(chapter);
            }
        }

        return chapterList;
    }

    async getLastPageIndexCategory(category) {
        let page = 1;
        try {
            const response = await axios.get(`${truyenFullURL}the-loai/${category}/trang-${page}/`, axiosParams);
            const html = response.data;
            const $ = cheerio.load(html);

            //list all nodes with <li> tag in HTML
            // const liTagsHTML1 = dom.window.document.getElementsByTagName('li');
            const liTagsHTML = $('.pagination.pagination-sm').find('li');
            //convert HTML collection to Array
            const liTagsArray = Array.from(liTagsHTML);
            //find the node[-4] of the list to check lastPageIndex
            // let lastPageIndex1 = liTagsArray[liTagsArray.length - 4].getElementsByTagName('a')[0]
            //     .getAttribute('title')
            //     .split('Trang ')[1]

            let lastPageIndex = $(liTagsArray[liTagsArray.length-2]).find('a')
                .attr('href')
                .split(`https://truyenfull.vn/the-loai/${category}/trang-`)[1]
                .split('/')[0];
            console.log(lastPageIndex);
            return Number(lastPageIndex);
        } catch (err) {
            console.log(err);
        }
    }

    async crawlAllPagesOfCategory(category) {
        let lastPageIndex = null;
        try {
            lastPageIndex = await this.getLastPageIndexCategory(category);
        } catch (err) {
            console.log(err);
        }

        let storyListAllPages = [];
        try {
            for (let i = 1; i <= lastPageIndex; i++) {
                let newPage = await this.crawl1PageOfCategory(category, i)
                if (i % 5 == 0) {
                    await sleep(500);
                }

                for (const story of newPage) {
                    storyListAllPages.push(story);
                }
            }
        } catch (err) {``
            console.log(err);
        }

        console.log(`==> Tổng cộng có ${storyListAllPages.length} truyện thuộc thể loại ${category}`);
        return storyListAllPages;
    }


    async crawlCategoryList() {
        let list = [];
        try {
            const response = await axios.get(`${truyenFullURL}`);
            const html = response.data;
            const $ = cheerio.load(html);

            // const domHTMLArray1 = Array.from(dom.window.document
            //     .getElementsByClassName('list list-truyen list-cat col-xs-12')[0]
            //     .getElementsByClassName('col-xs-6'))

            const  domHTMLArray = Array.from($('.list.list-truyen.list-cat.col-xs-12').eq(0).find('.col-xs-6'));

            // list = domHTMLArray.map((dom) => {
            //     return dom.getElementsByTagName('a')[0].innerHTML.normalize();
            // })
            list = domHTMLArray.map((dom) => {
                return $(dom).find('a').eq(0).text().normalize();
            })

            return list;
        } catch (err) {
            console.log(err);
        }
    }

    //region new

    async getUrlChapter1(title){
        const response = await axios.get(`${truyenFullURL}${title}`, axiosParams);
        const html = response.data;
        const $ = cheerio.load(html);

        let url = $('.list-chapter').eq(0)
            .find('li').eq(0)
            .find('a').eq(0)
            .attr('href');
        return url;
    }


    async crawl1ChapterNew(url) {
        try {
            const response = await axios.get(url, axiosParams);
            const html = response.data;
            const $ = cheerio.load(html);

            const header = $('.chapter-title').eq(0).attr('title').split('- ')[1];

            const body = $('.chapter-c').eq(0).text()
                .replace(/<i>|<\/i>|<b>|<\/b>/g, '')
                .replace(/<br>&nbsp;<br>/g, '<<')
                .replace(/<br><br>/g, '<<')
                .split('<<');
            let urlNextChapter = $('#next_chap').attr('href');
            console.log(`next chapter ${urlNextChapter}`);
            console.log(`Đang tải ${url}...`);

            return ({
                header: header,
                body: body,
                urlNextChapter: urlNextChapter,
            });
        } catch (err) {
            if (err.status == 503) {
                console.log('Too many requests!');
            }
            else if (err.status == 404) {
                console.log(`Story ${url} not found!`);
            }
            else {
                console.log(err);
            }
        }
    }

    //endregion

}