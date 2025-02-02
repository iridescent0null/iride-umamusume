import { Types } from "mongoose";
import { HoFUmaSummary } from "../api/hofuma/all/route";
import { decodeUmaParameterKey, decodeUmaPropertyKey, UmaParameterKey, UmaPropertyKey } from "../db/models";
import { historicIcon, prettyDate, renderStar, Star } from "./hof";
import Link from "next/link";
import { getRoot } from "../utils/webinfo";
import ParentFactorsWithIconRowDiv from "./parentFactors";
import HistoricIconDivision from "./historicIcon";

interface ThreeFactors {
    redKind: UmaPropertyKey,
    redStar: Star,
    blueKind: UmaParameterKey,
    blueStar: Star,
    greenStar: Star,
    historic?: Types.ObjectId,
    name_en: string
}

interface HoFUmaInlineRowDivProperty {
    uma: HoFUmaSummary,
    fatherFactors?: ThreeFactors,
    motherFactors?: ThreeFactors,
    name_en?: string
}

const fromId = (umaId: Types.ObjectId | string) => {
        return fetch(`${getRoot()}api/hofuma/${umaId}`)
        .then(res => res.json())
        .then(json => {
            return json;
    })
}

const convertToRank = (point: number)  => {
    return point < 19600? "SS": // in actuality there are many ranks less SS of course
        point < 20000? "UG0": // In the game, it is shown as UG, not UG0
        point < 20400? "UG1":
        point < 20800? "UG2":
        point < 21200? "UG3":
        point < 21600? "UG4":
        point < 22100? "UG5":
        point < 22500? "UG6":
        point < 23000? "UG7":
        point < 23400? "UG8":
        point < 23900? "UG9":
        point < 24300? "UF0":
        point < 24800? "UF1":
        point < 25300? "UF2":
        point < 25800? "UF3":
        point < 26300? "UF4":
        point < 26800? "UF5":
        point < 27300? "UF6":
        point < 27800? "UF7":
        point < 28300? "UF8":
        point < 28800? "UF9":
        point < 29400? "UE0":
        point < 29900? "UE1":
        point < 30400? "UE2":
        point < 31000? "UE3":
        point < 31500? "UE4":
        point < 32100? "UE5":
        point < 32700? "UE6":
        point < 33200? "UE7":
        point < 33800? "UE8":
        point < 34400? "UE9":     
        point < 35000? "UD0":
        point < 35600? "UD1":
        point < 36200? "UD2":
        point < 36800? "UD3":
        point < 37500? "UD4":
        point < 38100? "UD5":
        point < 38700? "UD6":
        point < 39400? "UD7":
        point < 40000? "UD8":
        point < 40700? "UD9":
        point < 41300? "UC0":
        point < 42000? "UC1":
        point < 42700? "UC2":
        point < 43400? "UC3":
        point < 44000? "UC4":
        point < 44700? "UC5":
        point < 45400? "UC6":
        point < 46200? "UC7":
        point < 46900? "UC8":
        point < 47600? "UC9":
        "UB";
}

const HoFUmaInlineRowDiv = (props: HoFUmaInlineRowDivProperty) => {
    const uma = props.uma;
    const fatherFactors = props.fatherFactors;
    const motherFactors = props.motherFactors;
    const name_en = props.name_en;
   
    return <div key={uma._id.toString()} className="hof-row">
        <Link href={`/hof/${uma._id.toString()}`} target="_blank">
            {name_en? <HistoricIconDivision name_en={name_en}/>:
            <></>}
        </Link>
        <div className="second-column">
            <div className="date-column">{prettyDate(uma.created)}</div>
            <div className="point-rank">{convertToRank(uma.point)}</div>
        </div>
        <div className="factor blue-factor">{decodeUmaParameterKey(uma.blueKind)} {renderStar(uma.blueStar as Star)}</div>
        <div className="factor red-factor">{decodeUmaPropertyKey(uma.redKind)} {renderStar(uma.redStar as Star)}</div>
        <div className="factor green-factor">固有 {renderStar(uma.greenStar as Star)}</div>
        <div className="parents-tiny-factors-wrapper">
            {!fatherFactors? <></>:
                <ParentFactorsWithIconRowDiv parent={fatherFactors}/>        
            }
            {!motherFactors? <></>:
                <ParentFactorsWithIconRowDiv parent={motherFactors}/>
            }
        </div>
    </div>;
};

export default HoFUmaInlineRowDiv;
export type { ThreeFactors, HoFUmaInlineRowDivProperty };
export { fromId, convertToRank };