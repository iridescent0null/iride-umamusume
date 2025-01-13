import Link from "next/link";
import { decodeRank } from "../db/models";
import { HistoricUma } from "../db/type";
import Rank from "./rank";
import Image from "next/image";

interface HistoricProps {
    uma: HistoricUma
}

const HistoricRowDividion = (props: HistoricProps) => {
    const uma = props.uma;
    return (
        <div className="uma-row" key={uma._id.toString()}>
            <Link href={`/historic/${uma._id.toString()}`} target="_blank">
                <span className="uma-column uma-long-column">{uma.name}</span>
            </Link>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.turf)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.dirt)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.sprint)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.mile)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.intermediate)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.long)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.lead)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.front)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.holdup)!}/></span>
            <span className="uma-column"><Rank rank={decodeRank(uma.property.late)!}/></span>
            <span className={"uma-column icon-wrapper" + (uma.plain_id?" gold-lined":"")}>
                <Image className="uma-icon" src={`/uma/icons/${uma.name_en}_icon.png`} fill={true} alt={""}/>
            </span>
        </div>
    );
}

export default HistoricRowDividion;
export type { HistoricProps };