import {Injectable} from "@nestjs/common";
import {truyenFullURL} from "../core/constants";
import {sleep} from "../core/helper";
import DomParser from 'dom-parser';
import jsdom from 'jsdom';
import {HttpService} from '@nestjs/axios';


 const { JSDOM } = jsdom;
import axios from "axios";
 const parser = new DomParser();

@Injectable()
export class TruyenFullService{
    constructor(
        private readonly httpService: HttpService

    ) {
    }

    async crawl1PageOfCategory(category: string, page: number){
        try {
            const res = await axios.get(`${truyenFullURL}the-loai/${category}/trang-${page}/`);
            await sleep(1500);
            const ele = parser.parseFromString(res.data, 'text/html');
            const dom = new JSDOM(ele.rawHTML);

            const nodeListHTML = dom.window.document.getElementsByClassName('list list-truyen col-xs-12')[0]
                .getElementsByClassName('row');

            //convert HTML collection to Array
            const nodeListArray : Array<String> = Array.from(nodeListHTML);

            let storyList1Page = [];
            for (const node of nodeListArray) {
                // const latestChap = node.getElementsByClassName('col-xs-2 text-info')[0].getElementsByTagName('a')[0].innerHTML
                //   .split('</span>')[2]
                // @ts-ignore
                const storyURL = node.getElementsByClassName('truyen-title')[0]
                    .getElementsByTagName('a')[0]
                    .getAttribute('href');
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

            const response = await axios.get(`${storyUrl}`);
            const html = response.data;

            const ele = parser.parseFromString(html, 'text/html');
            const dom = new JSDOM(ele.rawHTML);

            const poster = dom.window.document
                .getElementsByClassName('book')[0]
                .getElementsByTagName('img')[0].src;
            const title = dom.window.document
                .getElementsByClassName('title')[0].innerHTML.normalize();
            const author = dom.window.document
                .getElementsByClassName('info')[0]
                .getElementsByTagName('div')[0]
                .getElementsByTagName('a')[0].innerHTML.normalize();

            const domHTMLArray = Array.from(dom.window.document
                .getElementsByClassName('info')[0]
                .getElementsByTagName('div')[1].getElementsByTagName('a'));
            const categoryList = domHTMLArray.map(dom => {
                // @ts-ignore
                return dom.innerHTML.normalize();
            })

            const domInfoArray = Array.from(dom.window.document
                .getElementsByClassName('info')[0]
                .getElementsByTagName('div'));
            const status = dom.window.document
                .getElementsByClassName('info')[0]
                .getElementsByTagName('div')[domInfoArray.length - 1]
                .getElementsByTagName('span')[0].innerHTML.normalize();


            const description = Array.from(dom.window.document
                .getElementsByClassName('col-xs-12 col-sm-8 col-md-8 desc')[0]
                .getElementsByTagName('div'))[3]
                // @ts-ignore
                .innerHTML
                .replace(/<b>|<\/b>/g, '')
                .replace(/<i>|<\/i>/g, '')
                .replace(/&nbsp;/g, ' ')
                .normalize()
                .split('<br>');

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