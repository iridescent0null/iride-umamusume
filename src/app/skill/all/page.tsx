"use client"
import SkillRowDivision, { Skill } from "@/app/component/skillRow";
import { Ids } from "@/app/historic/all/page";
import { getRoot } from "@/app/utils/webinfo";
import { Types } from "mongoose";
import { useEffect, useState } from "react";

const ViewAllSkills = () => {
    const [skills,setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        const hydrate = () => {
            if (skills.length > 0) {
                return;
            }
            fetch(`${getRoot()}api/skill/all`)
            .then(res=>res.json())
            .then((json: Ids) => {
                const ids: Types.ObjectId[] = json.ids;
                return Promise.all(
                    ids.map(id => {
                        return fetch(`${getRoot()}api/skill/${id.toString()}`)
                        .then(res=>res.json());
                    })
                );
            })
            .then((skills: Skill[]) => {
                setSkills(skills);
            });
        };
        hydrate();
    },
    []
    );

    return <div className="dynamic-table">
        {skills.map(skill => {
            return <SkillRowDivision skill={skill} key={skill._id.toString()}/>;
        })}
    </div>;
};

export default ViewAllSkills;