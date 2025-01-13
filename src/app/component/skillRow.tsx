import { Types } from "mongoose"
import { BackgroundColor, decodeBackgroundColor, decodeIconColor, IconColor } from "../db/models"
import { useEffect, useState } from "react"
import { getRoot } from "../utils/webinfo"
import { HistoricUma } from "../db/type"
import Image from "next/image"

type Skill = SkillWithoutId & { 
    _id: Types.ObjectId
}

interface SkillWithoutId {
    name: string,
    iconColor: number, // coded
    backgroundColor: number, //coded
    isTurf?: boolean,
    isDirt?: boolean,
    isSprint?: boolean,
    isMile?: boolean,
    isIntermediate?: boolean,
    isLong?: boolean,
    isLead?: boolean,
    isFront?: boolean,
    isHoldup?: boolean,
    isLate?: boolean,
    inherent?: Types.ObjectId,
    base?:  Types.ObjectId
}

interface SkillProps {
    skill: Skill
}
const SkillRowDivision = (props: SkillProps) => {
    const[historicUmaName,setHistoricUmaName] = useState<string>();
    const skill = props.skill;

    useEffect( () => {
        const getIconPath = () => {
            if (!skill || !skill.inherent) {
                return;
            }
            fetch(`${getRoot()}api/historic/${skill.inherent.toString()}`)
            .then(res=>res.json())
            .then((historic: HistoricUma) => {
                setHistoricUmaName(historic.name_en);
            })
            .catch(err => {
                console.error(err);
            })
        };
        getIconPath();
    },
    []
    );

    return (
        <div className={"skill-row skill-row-in-"+decodeBackgroundColor(skill.backgroundColor)} key={skill._id.toString()}>
            <span className="skill-column skill-column-long" key={skill._id.toString()+"_name"}>{skill.name}</span>
            <span className={"skill-column icon-wrapper"} key={skill._id.toString()+"_icon"}>
                {!historicUmaName? <></> :
                    <Image className="uma-icon" src={`/uma/icons/${historicUmaName}_icon.png`} fill={true} alt={""}/>
                }
            </span>
        </div>
    );
}

export default SkillRowDivision;
export type { SkillProps, Skill, SkillWithoutId };