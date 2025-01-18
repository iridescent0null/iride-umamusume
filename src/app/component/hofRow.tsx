import { HoFUmaSummary } from "../api/hofuma/all/route";
import { decodeUmaParameterKey, decodeUmaPropertyKey, UmaParameterKey, UmaPropertyKey } from "../db/models";
import { historicIcon, prettyDate, renderStar, Star } from "./hof";
import Link from "next/link";

interface ThreeFactors {
    redKind: UmaPropertyKey,
    redStar: Star,
    blueKind: UmaParameterKey,
    blueStar: Star,
    greenStar: Star
}

interface HoFUmaInlineRowDivProperty {
    uma: HoFUmaSummary,
    fatherFactors?: ThreeFactors,
    motherFactors?: ThreeFactors 
}

const HoFUmaInlineRowDiv = (props: HoFUmaInlineRowDivProperty) => {
    const uma = props.uma;
    const fatherFactors = props.fatherFactors;
    const motherFactors = props.motherFactors;
    
    return <div key={uma._id.toString()} className="hof-row">
            <Link href={`/hof/${uma._id.toString()}`} target="_blank">
                {historicIcon(uma.historic)}
            </Link>
        <div className="date-column">{prettyDate(uma.created)}</div>
        <div className="factor blue-factor">{decodeUmaParameterKey(uma.blueKind )} {renderStar(uma.blueStar as Star)}</div>
        <div className="factor red-factor">{decodeUmaPropertyKey(uma.redKind )} {renderStar(uma.redStar as Star)}</div>
        <div className="factor green-factor">固有 {renderStar(uma.greenStar as Star)}</div>
        <div className="parents-tiny-factors-wrapper">
            {!fatherFactors? <></>:
                <div className="tiny-factor" key="father-factors">
                    <div className="factor blue-factor">{decodeUmaParameterKey(fatherFactors.blueKind )} {renderStar(fatherFactors.blueStar as Star)}</div>
                    <div className="factor red-factor">{decodeUmaPropertyKey(fatherFactors.redKind )} {renderStar(fatherFactors.redStar as Star)}</div>
                    <div className="factor green-factor">固有 {renderStar(fatherFactors.greenStar as Star)}</div> 
                </div>
            }
            {!motherFactors? <></>:
                <div className="tiny-factor" key="mother-factors">
                    <div className="factor blue-factor">{decodeUmaParameterKey(motherFactors.blueKind )} {renderStar(motherFactors.blueStar as Star)}</div>
                    <div className="factor red-factor">{decodeUmaPropertyKey(motherFactors.redKind )} {renderStar(motherFactors.redStar as Star)}</div>
                    <div className="factor green-factor">固有 {renderStar(motherFactors.greenStar as Star)}</div> 
                </div>
            }
        </div>
    </div>;
};

export default HoFUmaInlineRowDiv;
export type { ThreeFactors };