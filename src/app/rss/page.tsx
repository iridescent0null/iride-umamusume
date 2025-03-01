"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import Parser from "rss-parser";
import { getRoot, getRSSInfos } from "@/app/utils/webinfo";
import Image from "next/image";
import Link from "next/link";

// FIXME resolve CORS Error! (in browsers without CORS check, this page works, but...)

interface Article {
    contentSnippet: string;
    guid: string;
    img?: string;
    link: string;
}

const srcURLRegex = /(?<=(src=\"))[^><\s]*(?=\")/;

/** fix rss-parser results for next's Image */
const parseItem = (item: {[key: string]: any;} & Parser.Item) => {
    const srcInArray = item.content!.match(srcURLRegex);
    // Just extract image src in rss-parser results, and preserve the other values
    return {
        contentSnippet: item.contentSnippet,
        guid: item.guid,
        img: (srcInArray && srcInArray[0].length > 1)? srcInArray[0] : undefined,
        link: item.link
    } as Article;
};

const RSS = () => {
    const [umamusumeArticles,setUmamusumeArticles] = useState<Article[]>();
    const [keibaArticles,setKeibaArticles] = useState<Article[]>();
    const parser = new Parser();

    const searchParams = useSearchParams();

    useEffect(() => {
        const hydrate = () => { // TODO make the two handling parallel
            parser.parseURL(searchParams.get("mocked") === "true"
                ? `${getRoot()}/mock/rss.xml` //TODO deplpy the mock.xml or delete this line
                : getRSSInfos().find(rss => rss.name === "matomeRankings")!.URL
            )
            .then(rssf => {
                return rssf.items.map(parseItem);
            })
            .then(articles => {
                setUmamusumeArticles(articles);
            })
            .then(() => {
                return parser.parseURL(searchParams.get("mocked") === "true"
                ? `${getRoot()}/mock/rss.xml` //TODO deplpy the mock.xml or delete this line
                : getRSSInfos().find(rss => rss.name === "keibaJapan")!.URL
            )
            })
            .then(rssf => {
                return rssf.items.map(parseItem);
            })
            .then(articles => {
                setKeibaArticles(articles);
            })
            .catch(err => {
                console.error(err);
            })
        };
        hydrate();
    },[]);

    return <div className="rss-display dual"> {!(umamusumeArticles && keibaArticles)? <>loading...</> :
        <>
            <div className="rss-area" id="umamusume-rss">
                <div className="h-wrapper">
                    <h2>Umamusume</h2>
                </div>
                {umamusumeArticles.map(article => 
                    <div key={article.guid} className="uma-rss-article article">
                        <Link href={article.link} target="_blank">
                            <h3>{article.contentSnippet}</h3>
                            {!article.img?<>thumbnail missing</>:
                            <div className="rss-article-image-container">
                                <Image src={article.img} alt={article.contentSnippet}  fill style={{objectFit: "contain"}} sizes="(max-width: 200px) 100vw"/>
                            </div>
                        }
                        </Link>
                    </div>)
            }
            </div>
            <div className="rss-area" id="japankeiba-rss">
                <div className="h-wrapper">
                    <h2>Japan Keiba</h2>
                </div>
                {keibaArticles.map(article => 
                    <div key={article.guid} className="keiba-rss-article article">
                        <Link href={article.link} target="_blank">
                            <h3>{article.contentSnippet}</h3>
                            {!article.img?<>thumbnail missing</>:
                            <div className="rss-article-image-container">
                                <Image src={article.img} alt={article.contentSnippet}  fill style={{objectFit: "contain"}} sizes="(max-width: 200px) 100vw"/>
                            </div>
                        }
                        </Link>
                    </div>)
            }
            </div>
        </>
        }
    </div>;
}
export default RSS;


