const _info = {
    schem: "http",
    pureDomain: "localhost", // change it in the public server
    port: 8080
}

const _rss = {
    matomeRankings: {
        URL: "https://w-jp.com/umamusume/feed"
    },
    keibaJapan: {
        URL: "https://www.keiba.jp/rss/news.xml" // TODO change the source (the feed's update has not been done since 2020...)
    }
}

/** return the scheme and FQDN, with tail slash (e.g., https://example.co.jp/) */
function getRoot() {
    return `${_info.schem}://${_info.pureDomain}${_info.port?":"+_info.port:""}/`;
}

function getRSSInfos() {
    return [...Object.entries(_rss)].map(entry=> {return {name: entry[0], URL: entry[1].URL}});
}

export { getRoot, getRSSInfos };