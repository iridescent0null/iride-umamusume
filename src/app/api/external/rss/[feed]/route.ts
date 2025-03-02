import { getRSSInfos } from "@/app/utils/webinfo";
import { NextResponse } from "next/server";
import Parser from "rss-parser";

interface Article {
    contentSnippet: string;
    guid: string;
    img?: string;
    link: string;
}

const srcURLRegex = /(?<=(src=\"))[^><\s]*(?=\")/;

const parseItem = (item: {[key: string]: any} & Parser.Item) => {
    const srcInArray = item.content!.match(srcURLRegex);
    // Just extract image src in rss-parser results, preserving the other values
    return {
        contentSnippet: item.contentSnippet,
        guid: item.guid,
        img: (srcInArray && srcInArray[0].length > 1)? srcInArray[0] : undefined,
        link: item.link
    } as Article;
};

export async function GET(ignored: unknown, context: {params: Promise<{feed?: string}>}) {
    try {
        const params = await context.params;

        if (!params || !params.feed) {
            return NextResponse.json({message: "wrong parameter"}, {status: 403});
        }

        const feed =  getRSSInfos().find(rss => rss.name === params.feed);
        if (!feed) {
            return NextResponse.json({message: "no such feed"}, {status: 404});
        }
        const parser = new Parser();
        const result = await parser.parseURL(feed.URL)
        .then(rssf => {
            return rssf.items.map(parseItem);
        })
        return NextResponse.json({result: result});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "failed"}, {status: 500});
    }
}