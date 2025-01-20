"use client"
import HistoricUmaSelector from "@/app/component/historicSelector";
import { Star } from "@/app/component/hof";
import DynamicRaceListDiv from "@/app/component/raceList";
import DynamicScenarioFactorListDiv from "@/app/component/scenarioFactorList";
import DynamicSkillListDiv from "@/app/component/skillList"
import { codeUmaParameterKey, codeUmaPropertyKey, getUmaParameterKeys, getUmaPropertyKeys, UmaParameterKey, UmaPropertyKey } from "@/app/db/models";
import { Types } from "mongoose";
import { useState } from "react";

//TODO accept value from the skill list
const HoFRegisterForm = () => {
    const [historicUma,setHistoricUma] = useState<Types.ObjectId>();
    const [redFactorKind,setRedFactorKind] = useState<UmaPropertyKey | "">("");
    const [redFactorStar,setRedFactorStar] = useState<Star | 0 >(0);
    const [blueFactorKind,setBlueFactorKind] = useState<UmaParameterKey | "">("");
    const [blueFactorStar,setBlueFactorStar] = useState<Star | 0 >(0);
    const [greenFactorStar,setGreenFactorStar] = useState<Star | 0 >(0);

    const [races] = useState<Map<Types.ObjectId,Star | 0>>(new Map());
    const [scenarios] = useState<Map<Types.ObjectId,Star | 0>>(new Map());

    return <div className="hof-register-form">
        <div className="dual">
        <div className="left-side">
            <HistoricUmaSelector selectUma={setHistoricUma}/>
            <div>
                <select className="factor-selector red-factor-selector" 
                        onChange={event => setRedFactorKind(event.target.value as UmaPropertyKey | "" )}
                >
                    <option value="" key="blank property key"> - </option>
                    {getUmaPropertyKeys().map(key=>
                        <option value={codeUmaPropertyKey(key)} key={codeUmaPropertyKey(key)}>{key}</option>
                    )}
                </select>
                <select onChange={event => setRedFactorStar(Number.parseInt(event.target.value)  as (Star | 0))}>
                    <option value="0">-</option>
                    <option value="1">★☆☆</option>
                    <option value="2">★★☆</option>
                    <option value="3">★★★</option>
                </select>
                <select className="factor-selector blue-factor-selector" 
                        onChange={event => setBlueFactorKind(event.target.value as UmaParameterKey | "" )}
                >
                    <option value="" key="blank property key"> - </option>
                    {getUmaParameterKeys().map(key=>
                        <option value={codeUmaParameterKey(key)} key={codeUmaParameterKey(key)}>{key}</option>
                    )}
                </select>
                <select onChange={event => setBlueFactorStar(Number.parseInt(event.target.value) as (Star | 0))}>
                    <option value="0">-</option>
                    <option value="1">★☆☆</option>
                    <option value="2">★★☆</option>
                    <option value="3">★★★</option>
                </select>
                <select className="factor-selector green-factor-selector">
                    <option value="" key="blank property key"> 固有 </option>
                </select>
                <select onChange={event => setGreenFactorStar(Number.parseInt(event.target.value) as (Star | 0))}>
                    <option value="0">-</option>
                    <option value="1">★☆☆</option>
                    <option value="2">★★☆</option>
                    <option value="3">★★★</option>
                </select> 
            </div>
            <div className="hof-additional-input">
                <label htmlFor="creation-date">created:</label>
                <input type="date" id="creation-date" defaultValue={"2024-12-01"}></input>
                <label htmlFor="point">point:</label>
                <input type="number" id="point" min={0} defaultValue={0}></input><br/>
                <label htmlFor="awaken-lavel-selector">awaken level:</label>
                <select id="awaken-lavel-selector" defaultValue="5">
                    <option value="5">Lv 5</option>
                    <option value="4">Lv 4</option>
                    <option value="3">Lv 3</option>
                    <option value="2">Lv 2</option>
                    <option value="1">Lv 1</option>
                </select>
                <label htmlFor="blossom-star-selector">Talent:</label>
                <select id="blossom-star-selector" defaultValue="3">
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★</option>
                    <option value="3">★★★</option>
                    <option value="2">★★</option>
                    <option value="1">★</option>
                </select>
            </div>

            <div className="parameter-input">
                <div className="input-row">
                    <label htmlFor="speed-input">speed: </label>
                    <label htmlFor="stamina-input">stamina: </label>
                    <label htmlFor="power-input">power: </label>
                    <label htmlFor="guts-input">guts: </label>
                    <label htmlFor="widsom-input">widsom: </label>
                </div>
                <div className="input-row">
                    <input type="number" id="speed-input" min={0} defaultValue={0}></input>
                    <input type="number" id="stamina-input" min={0} defaultValue={0}></input>
                    <input type="number" id="power-input" min={0} defaultValue={0}></input>
                    <input type="number" id="guts-input" min={0} defaultValue={0}></input>
                    <input type="number" id="widsom-input" min={0} defaultValue={0}></input>
                </div>
            </div>
            <div className="textarea-wrapper">
                <label htmlFor="hof-input-note">Note: </label>
                <textarea defaultValue=""/>
            </div>
        </div>
        <div id="hof-input-note" className="right-side">
            <DynamicSkillListDiv/>
            <div className="double-factor-list-wrapper">
                <DynamicRaceListDiv raceSetter={races.set.bind(races)} />
                <DynamicScenarioFactorListDiv scenarioFactorSetter={scenarios.set.bind(scenarios)} />
            </div>
        </div>
        </div>
        <div className="bottom-button-wrapper">
            <button onClick={()=>alert([...scenarios.entries()])}>confirm</button>
        </div>
    </div>
}

export default HoFRegisterForm;