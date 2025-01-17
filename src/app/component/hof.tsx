import { MaterializedHoFUma } from "../api/hofuma/[id]/route";
import { decodeUmaParameterKey, decodeUmaPropertyKey, UmaParameterKey } from "../db/models";
import { Factor, HistoricUma, HoFUma, Race, Skill, WhiteFactorWithoutUma } from "../db/type";
import { getRoot } from "../utils/webinfo";
import Image from "next/image";
import ParameterTableDiv from "./parameter";

interface HoFUmaProps {
    uma: MaterializedHoFUma,
    whiteFactors: WhiteFactorWithoutUma[],
    races?: Race[],
    skills?: Skill[],
    scenarios?: Factor[]
}

type Star = 1 | 2 | 3; // currently 4 and 5 stars are out of the range

const singleStar = <span className="single-star star">★☆☆</span>
const doubleStar = <span className="double-star star">★★☆</span>
const tripleStar = <span className="triple-star star">★★★</span>

const renderStar = (stars: Star) => {
    return (stars === 1)? singleStar
    : (stars === 2)? doubleStar
    : (stars === 3)? tripleStar
    : <></> // should be unreachable
}

const prettyDate = (date: string) => {
    return new Date(date).toLocaleDateString("ja-JP");
};

const HoFRowDivision = (props: HoFUmaProps) => {
    const uma = props.uma;
    const whiteFactors = props.whiteFactors;
    const races = props.races;
    const skills = props.skills;
    const scenarios = props.scenarios;

    const extractName = (factor: WhiteFactorWithoutUma) => {
        let name: string;
        if (factor.race && races) {
            name = races.find(race => race._id === factor.race)?.name || "";
        } else if (factor.scenario && scenarios) {
            name = scenarios.find(scenario => scenario._id === factor.scenario)?.name || "";
        } else if (factor.skill && skills) {
            name = skills.find(skill => skill._id === factor.skill)?.name || "";
        } else {
            return "";
        }
        return name?.substring(0,14) || "";
        // return ((factor.race && races)?
        //                 races.find(race => race._id === factor.race)?.name
        //                 :(factor.scenario && scenarios)?
        //                                 scenarios.find(scenario => scenario._id === factor.scenario)?.name
        //                                 :(factor.skill && skills)?
        //                                         skills.find(skill => skill._id === factor.skill)?.name
        //                                         : ""
        // )?.substring(0,14) || "";
    }

    return fetch(`${getRoot()}/api/historic/${uma.historic}`)
    .then(res => res.json())
    .then((historic: HistoricUma) => {
        return (
            <div className="hof" key={uma._id.toString()}>
                <div className="hof-head">
                    <span className="uma-icon-wrapper">
                        <Image className="uma-icon" src={`/uma/icons/${historic.name_en}_icon.png`} fill={true} alt={""}/>
                    </span>
                    <div className="hof-content-wrapper">
                    <div className="title">{historic.name}</div>
                    <div className="date">{ prettyDate(uma.created)}</div>
                    <div className="point"><strong>{uma.point}</strong></div>
                    </div>
                </div>
                <ParameterTableDiv parameter={uma.parameter} />
                <div className="factor-table">
                    <div className="left-column">
                        <div className="blue-factor factor">{decodeUmaParameterKey((uma.blueKind as UmaParameterKey))} {renderStar(uma.blueStar as Star)}</div>
                        <div className="red-factor factor">{decodeUmaPropertyKey(uma.redKind)} {renderStar(uma.redStar as Star)}</div>
                        <div className="green-factor factor">{"固有"} {renderStar(uma.greenStar as Star)}</div>
                    </div>
                    <div className="right-column">
                            {whiteFactors.map(factor => {
                                return <div className="white-factor factor">
                                    {extractName(factor)}:  {renderStar(factor.star as Star)}
                                </div>;
                            })}
                    </div>
                </div>
                <div>Note: </div>
                <div>{uma.note || "(no note)"}</div>
            </div>
        )}
    );
}

export default HoFRowDivision;