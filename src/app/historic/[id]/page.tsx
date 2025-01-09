import { Stranger } from "@/app/api/historic/[id]/route";
import RankDivision from "@/app/component/rank";
import { decodeRank, decodeUmaPropertyKey, Rank, UmaPropertyKey } from "@/app/db/models";
import { HistoricUma } from "@/app/db/type";
import { getRoot } from "@/app/utils/webinfo";
import Image from "next/image";

interface WrappedId {
    id: string
}

interface RequestContext {
    params: Promise<WrappedId>
} 

const ViewHistoric = (context: RequestContext) => {
    return context.params
    .then(params => {
        return fetch(`${getRoot()}/api/historic/${params.id}`)
        .then(res => res.json())
        .then((unCheckedHistoric: HistoricUma | Stranger) => {
            const isStranger = !Object.hasOwn(unCheckedHistoric,"property");
            if (isStranger) {
                const stranger = unCheckedHistoric as Stranger;
                return  <>
                    <div>NOT FOUND</div>
                    <div className="uma-icon-wrapper">
                        <Image className="uma-icon" src={`/uma/icons/${stranger.name_en}_icon.png`} fill={true} alt={"image"}/>
                    </div>
                </>;
            }
            const historic = unCheckedHistoric as HistoricUma;
            const keys = Object.keys(historic.property);

            return <>
                <div>{historic.name}</div>
                <div className="uma-icon-wrapper">
                    <Image className="uma-icon" src={`/uma/icons/${historic.name_en}_icon.png`} fill={true} alt={"image"}/>
                </div>
                <div className="uma-property">{keys.map(
                    key => {
                        return (key === "_id" || key === "__v")? <></>:
                        <div className={`row`} key={key}>{decodeUmaPropertyKey(key as UmaPropertyKey) + ": "} 
                            <RankDivision rank= {decodeRank(historic.property[key as UmaPropertyKey] as number)!}/>                    
                        </div>
                    }
                )}</div>
            </>;
        })
    })
    .catch (err => {
        console.error(err);
        return <>faild to load</>;
    })
};

export default ViewHistoric;