"use client"
import { useEffect, useState } from "react"
import { getRoot } from "@/app/utils/webinfo";
import Image from "next/image";
import Link from "next/link";

interface Article {
    contentSnippet: string;
    guid: string;
    img?: string;
    link: string;
}

const RSS = () => {
    const [umamusumeArticles,setUmamusumeArticles] = useState<Article[]>();
    const [keibaArticles,setKeibaArticles] = useState<Article[]>();
    useEffect(() => {
        const hydrate = () => { // TODO make the two handling parallel
            fetch(`${getRoot()}api/external/rss/matomeRankings`)
            .then(res => res.json())
            .then(json => json.result)
            .then((articles: Article[]) => {
                setUmamusumeArticles(articles);
            })
            .then(() => {
                return fetch(`${getRoot()}api/external/rss/keibaJapan`);
            })
            .then(res => res.json())
            .then(json => json.result)
            .then((articles: Article[]) => {
                setKeibaArticles(articles);
            })
            .catch(err => {
                console.error(err);
            })
        };
        hydrate();
    },[]);

    const renderArticle = (article: Article) => {
        return <div key={article.guid} className="keiba-rss-article article">
            <Link href={article.link} target="_blank">
                <h3>{article.contentSnippet}</h3>
                {!article.img?<>thumbnail missing</>:
                    <div className="rss-article-image-container">
                        <Image src={article.img} alt={article.contentSnippet} fill style={{objectFit: "contain"}} sizes="(max-width: 200px) 100vw"/>
                    </div>
                }
            </Link>
        </div>
    };

    return <div className="rss-display dual"> {!(umamusumeArticles && keibaArticles)? <>loading...</> :
        <>
            <div className="rss-area" id="umamusume-rss">
                <div className="h-wrapper">
                    <h2>Umamusume</h2>
                </div>
                <>{umamusumeArticles.map(renderArticle)}</>
            </div>
            <div className="rss-area" id="japankeiba-rss">
                <div className="h-wrapper">
                    <h2>Japan Keiba</h2>
                </div>
                <>{keibaArticles.map(renderArticle)}</>
            </div>
        </>
        }
    </div>;
}
export default RSS;


