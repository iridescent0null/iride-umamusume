"use client"
import { PropertyCreation } from "@/app/api/historic/route";
import { HoFUmaSummary } from "@/app/api/hofuma/all/route";
import { HoFUmaCreationRequest } from "@/app/api/hofuma/route";
import HistoricUmaSelector from "@/app/component/historicSelector";
import { prettyDate, renderStar, Star } from "@/app/component/hof";
import { convertToRank, fromId } from "@/app/component/hofRow";
import DynamicRaceListDiv from "@/app/component/raceList";
import DynamicScenarioFactorListDiv from "@/app/component/scenarioFactorList";
import DynamicSkillListDiv from "@/app/component/skillList"
import { codeUmaParameterKey, codeUmaPropertyKey, decodeRank, decodeUmaParameterKey, decodeUmaPropertyKey, getUmaParameterKeys, getUmaPropertyKeys, Rank, UmaParameterKey, UmaPropertyKey } from "@/app/db/models";
import { HoFUmaWithMaterializedParameterWithoutIdProperty, WhiteFactorWithoutUma } from "@/app/db/type";
import { getRoot } from "@/app/utils/webinfo";
import { Types } from "mongoose";
import { useState } from "react";
import Image from "next/image";
import OcrReaderDiv from "@/app/component/ocrReader";

interface ParentSummary {
    uma: HoFUmaSummary,
    name_en: string
}

const defaultDate = "2024-12-01";

const HoFRegisterForm = () => {
    const [historicUma,setHistoricUma] = useState<Types.ObjectId>();
    const [redFactorKind,setRedFactorKind] = useState<UmaPropertyKey | "">("");
    const [redFactorStar,setRedFactorStar] = useState<Star | 0 >(0);
    const [blueFactorKind,setBlueFactorKind] = useState<UmaParameterKey | "">("");
    const [blueFactorStar,setBlueFactorStar] = useState<Star | 0 >(0);
    const [greenFactorStar,setGreenFactorStar] = useState<Star | 0 >(0);

    const [races] = useState<Map<Types.ObjectId,Star | 0>>(new Map());
    const [scenarios] = useState<Map<Types.ObjectId,Star | 0>>(new Map());
    const [skills] = useState<Map<Types.ObjectId,Star | 0>>(new Map());

    const [turf,setTurf] = useState<Rank>("A");
    const [dirt,setDirt] = useState<Rank>("G");
    const [sprint,setSprint] = useState<Rank>("A");
    const [mile,setMile] = useState<Rank>("A");
    const [intermediate,setIntermediate] = useState<Rank>("A");
    const [long,setLong] = useState<Rank>("A");
    const [lead,setLead] = useState<Rank>("A");
    const [front,setFront] = useState<Rank>("A");
    const [holdup,setHoldup] = useState<Rank>("A");
    const [late,setLate] = useState<Rank>("A");

    const [fatherSummary,setFatherSummary] = useState<ParentSummary>();
    const [motherSummary,setMotherSummary] = useState<ParentSummary>();

    const constructJSON = () => {
        // return values
        let json: HoFUmaCreationRequest;
        let hof: HoFUmaWithMaterializedParameterWithoutIdProperty;
        let property: PropertyCreation;
        const white_factors: WhiteFactorWithoutUma[] = [];

        const father = (document.getElementById("father-id-input") as HTMLInputElement).value;
        const mother = (document.getElementById("mother-id-input") as HTMLInputElement).value;

        if (!father || !mother) {
            const ok = confirm("you are about to register the uma without father and/or mother. are you sure?");
            if (!ok) {
                return;
            }
        }

        const created = (document.getElementById("creation-date") as HTMLInputElement).valueAsDate!;
        if (created.toDateString()  == new Date(defaultDate).toDateString()) {
            const ok = confirm(`the creation date has not been changed: ${defaultDate}. are you sure?`);
            if (!ok) {
                return;
            }
        }

        if (!redFactorKind || !blueFactorKind) {
            alert("select red and blue factors!");
            return;
        }

        if (!historicUma) {
            alert("select a uma musume!");
            return;
        }

        hof = {
            created: (document.getElementById("creation-date") as HTMLInputElement).valueAsDate!,
            historic: historicUma,
            parameter: {
                speed: (document.getElementById("speed-input") as HTMLInputElement).valueAsNumber!,
                stamina: (document.getElementById("stamina-input") as HTMLInputElement).valueAsNumber!,
                power: (document.getElementById("power-input") as HTMLInputElement).valueAsNumber!,
                guts: (document.getElementById("guts-input") as HTMLInputElement).valueAsNumber!,
                wisdom: (document.getElementById("wisdom-input") as HTMLInputElement).valueAsNumber!
            },
            star: Number.parseInt((document.getElementById("blossom-star-selector") as HTMLInputElement).value),
            awakeningLevel: Number.parseInt((document.getElementById("awaken-label-selector") as HTMLInputElement).value),
            redStar: redFactorStar,
            redKind: redFactorKind,
            blueStar: blueFactorStar,
            blueKind: blueFactorKind,
            greenStar: greenFactorStar,
            note: (document.getElementById("hof-input-note") as HTMLInputElement).value,
            point: (document.getElementById("point") as HTMLInputElement).valueAsNumber,
            father: father? new Types.ObjectId(father).toString() as unknown as Types.ObjectId : undefined, // FIXME resolve the very very lousy circumvention.  HoFUmaSummary might have to be fixed not to have ObjectIds
            mother: mother? new Types.ObjectId(mother).toString() as unknown as Types.ObjectId : undefined 
        };

        property = {
            turf: turf,
            dirt: dirt,
            sprint: sprint,
            mile: mile,
            intermediate: intermediate,
            long: long,
            lead: lead,
            front: front,
            holdup: holdup,
            late: late
        };

        [...races.entries()].flatMap(entry => {
            const race = entry[0];
            const star = entry[1];

            if (!star) { // removing 0 star
                return [];
            }
            return {star: star, race: race} as WhiteFactorWithoutUma;
        })
        .forEach(factor => white_factors.push(factor));

        [...skills.entries()].flatMap(entry => {
            const skill = entry[0];
            const star = entry[1];

            if (!star) { // removing 0 star
                return [];
            }
            return {star: star, skill: skill} as WhiteFactorWithoutUma;
        })
        .forEach(factor => white_factors.push(factor));

        [...scenarios.entries()].flatMap(entry => {
            const scenario = entry[0];
            const star = entry[1];

            if (!star) { // removing 0 star
                return [];
            }
            return {star: star, scenario: scenario} as WhiteFactorWithoutUma;
        })
        .forEach(factor => white_factors.push(factor!));

        json = {
            hof: hof,
            property: property,
            white_factors: white_factors
        }

        alert(`generated: white factors: ${white_factors.length}`);
        (document.getElementById("hof-register-confirm") as HTMLTextAreaElement).value = JSON.stringify(json);
    };

    const fillPropertyWithDefaultValues = () => {
        if (!historicUma) {
            alert("select a umamusume!")
            return;
        }

        fetch(`${getRoot()}api/historic/${historicUma}`)
        .then(res => res.json())
        .then(json => {
            const pro = json.property;
            setTurf(decodeRank(pro.turf)!);
            setDirt(decodeRank(pro.dirt)!);
            setSprint(decodeRank(pro.sprint)!);
            setMile(decodeRank(pro.mile)!);
            setIntermediate(decodeRank(pro.intermediate)!);
            setLong(decodeRank(pro.long)!);
            setLead(decodeRank(pro.lead)!);
            setFront(decodeRank(pro.front)!);
            setHoldup(decodeRank(pro.holdup)!);
            setLate(decodeRank(pro.late)!);
        });
    }

    const retrieveFatherSummary = () => {
        let uma: HoFUmaSummary;
        fromId((document.getElementById("father-id-input") as HTMLInputElement).value)
        .then(json => {
            if (!json.uma) {
                alert("invalid hall of fame uma!");
                return;
            }
            uma = json.uma;
            fetch(`${getRoot()}api/historic/${json.uma.historic}`)
            .then(res => res.json())
            .then(json => {
                setFatherSummary({
                    uma:uma,
                    name_en: json.name_en!
                })
            })
        })
    };

    const retriveMotherSummary = () => {
        let uma: HoFUmaSummary;
        fromId((document.getElementById("mother-id-input") as HTMLInputElement).value)
        .then(json => {
            if (!json.uma) {
                alert("invalid hall of fame uma!");
                return;
            }
            uma = json.uma;
            fetch(`${getRoot()}api/historic/${json.uma.historic}`)
            .then(res => res.json())
            .then(json => {
                setMotherSummary({
                    uma:uma,
                    name_en: json.name_en!
                })
            })
        })
    };

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
                <input type="date" id="creation-date" defaultValue={defaultDate}></input>
                <label htmlFor="point">point:</label>
                <input type="number" id="point" min={0} defaultValue={0}></input><br/>
                <label htmlFor="awaken-label-selector">awaken level:</label>
                <select id="awaken-label-selector" defaultValue="5">
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
                    <label htmlFor="wisdom-input">widsom: </label>
                </div>
                <div className="input-row">
                    <input type="number" id="speed-input" min={0} defaultValue={0}></input>
                    <input type="number" id="stamina-input" min={0} defaultValue={0}></input>
                    <input type="number" id="power-input" min={0} defaultValue={0}></input>
                    <input type="number" id="guts-input" min={0} defaultValue={0}></input>
                    <input type="number" id="wisdom-input" min={0} defaultValue={0}></input>
                </div>
            </div> 
            <div className="property-input">
                <button onClick={()=>fillPropertyWithDefaultValues()}>refer!</button>
                <div className="property-input-row">
                    <label htmlFor="property-turf-selector">芝:</label>
                    <select id="property-turf-selector" value={turf} onChange={event => setTurf(event.target.value as Rank)}>
                        <option value="S">S</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                    </select>
                    <label htmlFor="property-dirt-selector">ダート:</label>
                    <select id="property-dirt-selector" value={dirt} onChange={event => setDirt(event.target.value as Rank)}>
                        <option value="S">S</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                    </select>
                </div>
                <div className="property-input-row">
                <label htmlFor="property-sprint-selector">短距離:</label>
                <select id="property-sprint-selector" value={sprint} onChange={event => setSprint(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                <label htmlFor="property-mile-selector">マイル:</label>
                <select id="property-mile-selector" value={mile} onChange={event => setMile(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                <label htmlFor="property-intermediate-selector">中距離:</label>
                <select id="property-intermediate-selector" value={intermediate} onChange={event => setIntermediate(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                <label htmlFor="property-intermediate-selector">長距離:</label>
                <select id="property-long-selector" value={long} onChange={event => setLong(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                </div>
                <div className="property-input-row">
                <label htmlFor="property-lead-selector">逃げ:</label>
                <select id="property-lead-selector" value={lead} onChange={event => setLead(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                <label htmlFor="property-front-selector">先行:</label>
                <select id="property-front-selector" value={front} onChange={event => setFront(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                <label htmlFor="property-holdup-selector">差し:</label>
                <select id="property-holdup-selector" value={holdup} onChange={event => setHoldup(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                <label htmlFor="property-late-selector">追込:</label>
                <select id="property-late-selector" value={late} onChange={event => setLate(event.target.value as Rank)}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                </select>
                </div>
            </div>
            <div className="textarea-wrapper">
                <label htmlFor="hof-input-note">Note: </label>
                <textarea defaultValue="" id="hof-input-note"/>
            </div>
            <div>
                <label htmlFor="father-id-input">継承元:</label><input type="text" id="father-id-input"></input>
                <button onClick={() => retrieveFatherSummary()}>view</button>
                {!fatherSummary? <></>:
                <HoFUmaInlineRowDiv uma={fatherSummary.uma} name_en={fatherSummary.name_en}/>}
            </div>
            <div>
                <label htmlFor="mother-id-input">継承元:</label><input type="text" id="mother-id-input"></input>
                <button onClick={() => retriveMotherSummary()}>view</button>
                {!motherSummary? <></>:
                <HoFUmaInlineRowDiv uma={motherSummary.uma} name_en={motherSummary.name_en}/>}
            </div>
        </div>
        <div id="hof-input-note" className="right-side">
            <DynamicSkillListDiv skillSetter={skills.set.bind(skills)} />
            <div className="double-factor-list-wrapper">
                <DynamicRaceListDiv raceSetter={races.set.bind(races)} />
                <DynamicScenarioFactorListDiv scenarioFactorSetter={scenarios.set.bind(scenarios)} />
            </div>
        </div>
        </div>
        <div className="bottom-button-wrapper">
            <button onClick={()=>constructJSON()}>confirm</button>
        </div>
        <div>
            {(fatherSummary && motherSummary && fatherSummary.name_en === motherSummary.name_en)?
           <div className="caution">you cant adopt hall of fame umas sharing the histotic horse (e.g., Vodka and Vodka)!</div> 
        :<></>}
        </div>
        <textarea id="hof-register-confirm"/>
        <OcrReaderDiv inputIds={{
            speed: "speed-input",
            stamina: "stamina-input",
            power: "power-input",
            guts: "guts-input",
            widsom: "wisdom-input",
            point: "point"
        }} />
    </div>
}

const HoFUmaInlineRowDiv = (props: ParentSummary) => {
    const uma = props.uma;    
    return <div key={uma._id.toString()} className="hof-row">
        <span className="uma-icon-wrapper">
            {!props.name_en? <></>:
                <Image className="uma-icon" src={`/uma/icons/${props.name_en}_icon.png`} fill={true} alt={""}/>
            }
        </span>
        <div className="second-column">
            <div className="date-column">{prettyDate(uma.created)}</div>
            <div className="point-rank">{convertToRank(uma.point)}</div>
        </div>
        <div className="factor blue-factor">{decodeUmaParameterKey(uma.blueKind )} {renderStar(uma.blueStar as Star)}</div>
        <div className="factor red-factor">{decodeUmaPropertyKey(uma.redKind )} {renderStar(uma.redStar as Star)}</div>
        <div className="factor green-factor">固有 {renderStar(uma.greenStar as Star)}</div>
    </div>;
};
export default HoFRegisterForm;