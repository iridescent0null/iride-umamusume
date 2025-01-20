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
    const[historicUmaNameEn,setHistoricUmaNameEn] = useState<string>();
    const skill = props.skill;

    useEffect(() => {
        const getIconPath = () => {
            if (!skill || !skill.inherent) {
                return;
            }
            fetch(`${getRoot()}api/historic/${skill.inherent.toString()}`)
            .then(res=>res.json())
            .then((historic: HistoricUma) => {
                setHistoricUmaNameEn(historic.name_en);
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
                {!historicUmaNameEn? <></> :
                    <Image className="uma-icon" src={`/uma/icons/${historicUmaNameEn}_icon.png`} fill={true} alt={""}/>
                }
            </span>
            <span className="skill-column skill-column-long skill-id" key={skill._id.toString()+"_id"}>{skill._id.toString()}</span>
        </div>
    );
}

export default SkillRowDivision;
export type { SkillProps, Skill, SkillWithoutId };