
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const axiosParams = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
};