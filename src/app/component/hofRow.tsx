import { HoFUmaSummary } from "../api/hofuma/all/route";
import { decodeUmaParameterKey, decodeUmaPropertyKey } from "../db/models";
import { historicIcon, prettyDate, renderStar, Star } from "./hof";
import Link from "next/link";


interface HoFUmaInlineRowDivProperty {
    uma: HoFUmaSummary
}

//TODO render parents factor
const HoFUmaInlineRowDiv = (props: HoFUmaInlineRowDivProperty) => {
    const uma = props.uma;
    return <div key={uma._id.toString()} className="hof-row">
            <Link href={`/hof/${uma._id.toString()}`} target="_blank">
                {historicIcon(uma.historic)}
            </Link>
        <div>{prettyDate(uma.created)}</div>
        <div className="factor blue-factor">{decodeUmaParameterKey(uma.blueKind )} {renderStar(uma.blueStar as Star)}</div>
        <div className="factor red-factor">{decodeUmaPropertyKey(uma.redKind )} {renderStar(uma.redStar as Star)}</div>
        <div className="factor green-factor">固有 {renderStar(uma.greenStar as Star)}</div>
    </div>;
};

export default HoFUmaInlineRowDiv;