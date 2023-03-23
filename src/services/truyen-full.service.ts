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
}