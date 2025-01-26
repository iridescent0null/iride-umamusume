"use client"
import { useEffect, useState } from "react";
import SkillRowDivision, { Skill } from "./skillRow";
import { getRoot } from "../utils/webinfo";
import { Ids } from "../historic/all/page";
import { Types } from "mongoose";
import { Star } from "./hof";

interface DynamicSkillListDivProps{
    skillSetter: (key: Types.ObjectId, value: Star | 0) => Map<Types.ObjectId,Star | 0>
}

const DynamicSkillListDiv = (props: DynamicSkillListDivProps) => {
    const [allSkills,setAllSkills] = useState<Skill[]>([]);
    const [keyword,setKeyWord] = useState<string>("");
    const [onlyNormal,setOnlyNormal] = useState<boolean>(true);
    const [skillWhiteFactors] = useState<Map<Types.ObjectId, Star | 0>>(new Map());
    const [forceReload,setForceReload] = useState<boolean>(false);

    useEffect(() => {
        const getSkills = () => {
            if (allSkills.length > 0 && !forceReload) {
                return;
            }
            fetch(`${getRoot()}api/skill/ids`)
            .then(res => res.json())
            .then((json: Ids) => {
                const ids: Types.ObjectId[] = json.ids;
                return Promise.all(
                    ids.map(id => {
                        return fetch(`${getRoot()}api/skill/${id.toString()}`)
                        .then(res => res.json());
                    })
                );
            })
            .then((skills: Skill[]) => {
                setForceReload(false);
                setAllSkills(skills);
            });
        };
        getSkills();
    },[forceReload]);    

    return <div className="component-skill-list">
        <button onClick={() => alert([...skillWhiteFactors.entries()])}>see map</button>
        <button onClickCapture={() => setForceReload(true)}>refresh</button>
        <input type="text" onChange={event => setKeyWord(event.target.value)}></input>
        <input type="checkbox" id="only-normal-checkbox" defaultChecked 
                onChange={event => setOnlyNormal(event.target.checked)}>
        </input><label htmlFor="only-normal-checkbox">remove gold or higher, or ◎</label>
        {allSkills.filter(
            skill => keyword? skill.name.includes(keyword) : true 
        )
        .filter(
            skill => onlyNormal? (skill.backgroundColor === 0 && !skill.base && !skill.inherent) : true
        )
        .map(skill => {
            return <div className="check-object-pair" key={`pair-${skill._id}`}>
                <select onChange={event => {
                    skillWhiteFactors.set(skill._id, Number.parseInt(event.target.value) as Star | 0);
                    props.skillSetter(skill._id, Number.parseInt(event.target.value) as Star | 0)
                }} defaultValue="0">
                    <option value="0">-</option>
                    <option value="1">★</option>
                    <option value="2">★★</option>
                    <option value="3">★★★</option>
                </select> <SkillRowDivision skill={skill}/></div>
        })}
    </div>;
}

export default DynamicSkillListDiv;