import { decodeUmaParameterKey, decodeUmaPropertyKey } from "../db/models";
import HistoricIconDivision from "./historicIcon";
import { renderStar, Star } from "./hof";
import { ThreeFactors } from "./hofRow";

interface ParentFactorWithIconRowDivProperty {
    parent: ThreeFactors
}

const ParentFactorsWithIconRowDiv = (props: ParentFactorWithIconRowDivProperty) => {
    return <div className="tiny-factor" key="mother-factors">
        <div className="factor blue-factor">{decodeUmaParameterKey(props.parent.blueKind)} {renderStar(props.parent.blueStar as Star)}</div>
        <div className="factor red-factor">{decodeUmaPropertyKey(props.parent.redKind)} {renderStar(props.parent.redStar as Star)}</div>
        <div className="factor green-factor">固有 {renderStar(props.parent.greenStar as Star)}</div> 
        {props.parent.name_en? <HistoricIconDivision name_en={props.parent.name_en} tiny={true}/> :<></>}
    </div>;
};

export default ParentFactorsWithIconRowDiv;