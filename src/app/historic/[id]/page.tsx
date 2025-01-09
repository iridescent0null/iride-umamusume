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
        .then((historic: HistoricUma | undefined) => {
            // FIXME in not found situation, these checks don't work (the Image will be reached and complain the wrong path)
            if ((historic === void 0)) {
                return  <>NOT FOUND</>;
            }
            const keys = (historic && historic.property)? Object.keys(historic.property):[];
            if (keys.length = 0) {
                return  <>NOT FOUND</>;
            }
            return <>
                <div>{historic.name}</div>
                <div className="uma-icon-wrapper">
                    <Image className="uma-icon" src={`/uma/icons/${historic.name_en}_icon.png`} fill={true} alt={"image"}/>
                </div>
                <div className="uma-property">{Object.keys(historic.property).map(
                    key => {
                        return (key === "_id" || key === "__v")? <></>:
                        <div className={`row`} key={key}>{decodeUmaPropertyKey(key as UmaPropertyKey) +": "} 
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