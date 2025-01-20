"use client"
import { useEffect, useState } from "react";
import { Factor, Race } from "../db/type";
import { getRoot } from "../utils/webinfo";
import { Star } from "./hof";
import { AllScenarioFactorResponse } from "../api/scenariofactor/all/route";
import { Types } from "mongoose";

interface DynamicScenarioFactorListDivProps {
    scenarioFactorSetter: (key: Types.ObjectId, value: Star | 0) => Map<Types.ObjectId,Star | 0>
}

const DynamicScenarioFactorListDiv = (props: DynamicScenarioFactorListDivProps) => {
    const[scenarioFactors,setScenarioFactors] = useState<Factor[]>([]);
    const[keyword,setKeyword] = useState<string>("メカウマ娘");

    useEffect(() => {
        const getScenarioFactors = () => {
            if (scenarioFactors.length > 0) {
                return;
            }
            fetch(`${getRoot()}api/scenariofactor/all`)
            .then(res=>res.json())
            .then((response: AllScenarioFactorResponse) => response.factors)
            .then((factors: Factor[] | undefined) => {
                if (!factors) {
                    console.error("failed to retrieve races!");
                    return;
                }
                setScenarioFactors(factors);
            })
        };
        getScenarioFactors();
    },[]);

    return <div className="component-scenario-factor-list">
        <select onChange={event => setKeyword(event.target.value)}>
            <option value="メカウマ娘" key="mecha">メカ娘</option>
            <option value="豊食" key="agri">豊食</option>
        </select>
        {scenarioFactors.filter(factor => factor.name.includes(keyword))
            .map(factor => 
            <div key={`selector-${factor._id}`} id={`selector-${factor._id}`}>
                <select onChange={event => props.scenarioFactorSetter(factor._id,Number.parseInt(event.target.value) as (Star | 0))} 
                        defaultValue="0"        
                >
                    <option value="0">-</option>
                    <option value="1">★☆☆</option>
                    <option value="2">★★☆</option>
                    <option value="3">★★★</option>
                </select> 
                {factor.name}  
            </div>)}
    </div>;
}

export default DynamicScenarioFactorListDiv;