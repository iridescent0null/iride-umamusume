import { _getRoot } from "../../../secret/webRoot";

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
    return _getRoot();
}

function getRSSInfos() {
    return [...Object.entries(_rss)].map(entry=> {return {name: entry[0], URL: entry[1].URL}});
}

export { getRoot, getRSSInfos };