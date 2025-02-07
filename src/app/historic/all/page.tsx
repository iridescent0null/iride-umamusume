"use client"
import { HistoricEntry } from "@/app/api/historic/english/all/route";
import { HoFUmaSummary } from "@/app/api/hofuma/all/route";
import HistoricRowDividion from "@/app/component/historicRow";
import HoFUmaInlineRowDiv, { ThreeFactors } from "@/app/component/hofRow";
import UmaPropertyKeySelect from "@/app/component/part/umaPropertyKeySelect";
import { UmaPropertyKey, getUmaPropertyKeys, getRanks, codeRank, codeUmaPropertyKey } from "@/app/db/models";
import { HistoricUma } from "@/app/db/type";
import { getRoot } from "@/app/utils/webinfo"
import { Types } from "mongoose"
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Ids {
    ids: Types.ObjectId[];
}

interface FactorEffect {
    kind: UmaPropertyKey,
    stars: number
}

const hasDesignatedFactors = (factorSets: (ThreeFactors | undefined)[], keys: UmaPropertyKey[]) => {
    return keys.every(key=>hasDesignatedFactor(factorSets.filter(a=>a) as ThreeFactors[],key));
};

const hasDesignatedFactor = (factorSets: ThreeFactors[], key: UmaPropertyKey) => {
    return factorSets.map(factor => factor.redKind).includes(key);
};

const ViewAllHistoricUma = () => {

    const [umas,setUmas] = useState<HistoricUma[]>([]);
    const [conditionOneRank,setConditionOneRank] = useState<number>();
    const [conditionOneKey,setConditionOneKey] = useState<UmaPropertyKey | "">();
    const [conditionTwoRank,setConditionTwoRank] = useState<number>();
    const [conditionTwoKey,setConditionTwoKey] = useState<UmaPropertyKey | "">();
    const [conditionThreeRank,setConditionThreeRank] = useState<number>();
    const [conditionThreeKey,setConditionThreeKey] = useState<UmaPropertyKey | "">();
    const [conditionFourRank,setConditionFourRank] = useState<number>();
    const [conditionFourKey,setConditionFourKey] = useState<UmaPropertyKey | "">();

    const [firstRedFactorKey,setFirstRedFactorKey] = useState<UmaPropertyKey | "">();
    const [firstRedFactorLevel,setFirstRedFactorLevel] = useState<number>(0);
    const [secondRedFactorKey,setSecondRedFactorKey] = useState<UmaPropertyKey | "">();
    const [secondRedFactorLevel,setSecondRedFactorLevel] = useState<number>(0);
    const [thirdRedFactorKey,setThirdRedFactorKey] = useState<UmaPropertyKey | "">();
    const [thirdRedFactorLevel,setThirdRedFactorLevel] = useState<number>(0);
    const [fourthRedFactorKey,setFourthRedFactorKey] = useState<UmaPropertyKey | "">();
    const [fourthRedFactorLevel,setFourthRedFactorLevel] = useState<number>(0);
    const [fifthRedFactorKey,setFifthRedFactorKey] = useState<UmaPropertyKey | "">();
    const [fifthRedFactorLevel,setFifthRedFactorLevel] = useState<number>(0);
    const [sixthRedFactorKey,setSixthRedFactorKey] = useState<UmaPropertyKey | "">();
    const [sixthRedFactorLevel,setSixthRedFactorLevel] = useState<number>(0);
    const [laterRedFactorsHidden,setLaterRedFactorsHidden] = useState<boolean>(true);

    const [hofUmas,setHofUmas] = useState<HoFUmaSummary[]>([]);
    const extractThreeFactors = (umaId: Types.ObjectId) => {
        const uma = hofUmas.find(summary => summary._id === umaId);
        return !uma? undefined :
                {
                    redKind: uma.redKind,
                    redStar: uma.redStar,
                    blueKind: uma.blueKind,
                    blueStar: uma.blueStar,
                    greenStar: uma.greenStar,
                    historic: uma.historic
                } as ThreeFactors;
    };
    const [hofRedFactorFilterFirst,setHofRedFactorFilterFirst] = useState<UmaPropertyKey | undefined>(undefined);
    const [hofRedFactorFilterSecond,setHofRedFactorFilterSecond] = useState<UmaPropertyKey | undefined>(undefined);
    const [hofRedFactorFilterThird,setHofRedFactorFilterThird] = useState<UmaPropertyKey | undefined>(undefined);
    const [hofRedFactorFilterFourth,setHofRedFactorFilterFourth] = useState<UmaPropertyKey | undefined>(undefined);
    const hasAnyDesignatedFactor = (hof: HoFUmaSummary, keys: UmaPropertyKey[]) => { // TODO better name to express her or her parents
        return hasDesignatedFactors([hof,
                hof.father? extractThreeFactors(hof.father) : undefined,
                hof.mother? extractThreeFactors(hof.mother) : undefined
        ],keys);
    };
    
    const [historicUmas,setHistoricUmas] = useState<Map<Types.ObjectId,string>>();

    /** 
     * determine how it looses the limitation considering red factors. \
     * e.g. returning 2 means that C rank is OK when A rank is required, because the following eq is true: \
     * C <= A - 2. \
     * When none of the red factors is concerning the given key, just returns 0.
     */
    const determineEaseValue = (key: UmaPropertyKey) => {
        const starMax = 10;
        let stars = 0;
        if (firstRedFactorKey === key) {
            stars = stars + firstRedFactorLevel;
        }
        if (secondRedFactorKey === key) {
            stars = stars + secondRedFactorLevel;
        }
        if (thirdRedFactorKey === key) {
            stars = stars + thirdRedFactorLevel;
        }
        if (fourthRedFactorKey === key) {
            stars = stars + fourthRedFactorLevel;
        }
        if (fifthRedFactorKey === key) {
            stars = stars + fifthRedFactorLevel;
        }
        if (sixthRedFactorKey === key) {
            stars = stars + sixthRedFactorLevel;
        }
        if (stars > starMax) {
            stars = starMax;
        }
        return Math.trunc((stars+2)/3); // e.g. 4, 5 and 6 stars have to have the same effect (+2 ranks)
    };

    // FIXME the A rank cap is working but has been implemented by a little tricky method
    const dependingOnConditionOne = (uma: HistoricUma) => {
        // if there is no valid conditions, all umas are OK
        if (conditionOneRank === void 0 || Number.isNaN(conditionOneRank) || !conditionOneKey) {
            return true;
        }
        if (conditionOneRank === 0) { 
            // if S is required, no uma is OK
            return false;
        }
        return uma.property![conditionOneKey]! <= conditionOneRank + determineEaseValue(conditionOneKey);
    }
    const dependingOnConditionTwo = (uma: HistoricUma) => {
        if (conditionTwoRank === void 0 || Number.isNaN(conditionTwoRank) || !conditionTwoKey) {
            return true;
        }
        if (conditionTwoRank === 0) {
            return false;
        }
        return uma.property![conditionTwoKey]! <= conditionTwoRank + determineEaseValue(conditionTwoKey);
    }
    const dependingOnConditionThree = (uma: HistoricUma) => {
        if (conditionThreeRank === void 0 || Number.isNaN(conditionThreeRank) || !conditionThreeKey) {
            return true;
        }
        if (conditionThreeRank === 0) {
            return false;
        }
        return uma.property![conditionThreeKey]! <= conditionThreeRank + determineEaseValue(conditionThreeKey);
    }
    const dependingOnConditionFour = (uma: HistoricUma) => {
        if (conditionFourRank === void 0 || Number.isNaN(conditionFourRank) || !conditionFourKey) {
            return true;
        }
        if (conditionFourRank === 0) {
            return false;
        }
        return uma.property![conditionFourKey]! <= conditionFourRank + determineEaseValue(conditionFourKey);
    }

    const adoptIngaPreset = () => {
        (document.getElementById("historic-condition-one-rank") as HTMLSelectElement).value = "1";
        setConditionOneRank(1);
        (document.getElementById("historic-condition-one-key") as HTMLSelectElement).value = "turf";
        setConditionOneKey("turf");
        (document.getElementById("historic-condition-two-rank") as HTMLSelectElement).value = "3";
        setConditionTwoRank(3);
        (document.getElementById("historic-condition-two-key") as HTMLSelectElement).value = "dirt";
        setConditionTwoKey("dirt");
        (document.getElementById("historic-condition-three-rank") as HTMLSelectElement).value = "2";
        setConditionThreeRank(2);
        (document.getElementById("historic-condition-three-key") as HTMLSelectElement).value = "intermediate";
        setConditionThreeKey("intermediate");
        (document.getElementById("historic-condition-four-rank") as HTMLSelectElement).value = "2";
        setConditionFourRank(2);
        (document.getElementById("historic-condition-four-key") as HTMLSelectElement).value = "mile";
        setConditionFourKey("mile");

        (document.getElementById("first-red-factor-key") as HTMLSelectElement).value = "dirt";
        setFirstRedFactorKey("dirt");
    };

    const drawRedFactorBar = (keysetter: Dispatch<SetStateAction<"" | UmaPropertyKey | undefined>>,
            levelSetter: Dispatch<SetStateAction<number>>,
            level: number,
            ordinal: string) => {
        return <div id={`${ordinal}-red-factor`} className="red-factor-input">
        <select id={`${ordinal}-red-factor-key`} onChange={event => keysetter(event.target.value as UmaPropertyKey | "")}> 
            <option value="">-</option>
            {getUmaPropertyKeys().map(key=>
                    <option value={codeUmaPropertyKey(key)} key={`${ordinal}-option-${key}`}>
                        {key}
                    </option>
            )}
        </select>
        <span className="three-stars">
            <span className="the-0-star star"></span>
            {[1,2,3,4,5,6,7,8,9].map(i => 
                    <span className={"the-"+i+"-star star"} key={`${ordinal}-star-${i}`}>
                        ★
                    </span>
            )}
            <span className="the-10-star star" key={`${ordinal}-star-10`}>☆</span>
        </span><br/>
        <span className="star-value">{level}</span>
        <span className="star-bar-wrapper">
            <input type="range" className="star-bar" id={`${ordinal}-red-factor-star-bar`} 
                    min={0} max={10} step={1} defaultValue={0} 
                    onChange={event => levelSetter(Number.parseInt(event.target.value))}
            />
        </span>
    </div>
    }

    const consolidateRedFactors = (umas: readonly (HoFUmaSummary | undefined)[]) => {
        const filterdUmas = umas.filter(uma => uma) as HoFUmaSummary[] ;
        const grouped = Object.groupBy(filterdUmas, ({redKind}) => redKind);
        const array = [...Object.entries(grouped)].map(entry => {return {kind: entry[0], stars: entry[1]
                .flatMap(uma1 => uma1.redStar as number)
                .reduce((a,b) => a+b)}}) as FactorEffect[];

        // dirt should go to the first place to correspond with Inshi button 
        return bringToFisrtIfKindExists(array,"dirt");
    }

    const bringToFisrtIfKindExists = (array: FactorEffect[], significantKey: UmaPropertyKey) => {
        const significantOnes = array.filter(factor => factor.kind ===  significantKey);

        if (significantOnes.length > 1) {
            throw Error(`duplication! ${significantKey}`);
        }

        if (significantOnes.length < 1) {
            return array;
        }

        const returnValue: FactorEffect[] = [];
        returnValue[0] = significantOnes[0];
        array.filter(factor => factor.kind !==  significantKey)
                .sort((a,b) => a.kind.length - b.kind.length)
                .forEach(factor => returnValue.push(factor));

        return returnValue;
    }

    const referToParents = () => {
        const fatherRadio: HTMLElement | null = document.querySelector('input[name="father"]:checked');
        const motherRadio: HTMLElement | null = document.querySelector('input[name="mother"]:checked');

        if (!fatherRadio || !motherRadio) {
            alert("select two umas!");
            return;
        }

        const father = hofUmas.filter(uma => uma._id.toString() === (fatherRadio as HTMLInputElement)?.value)[0];
        const mother = hofUmas.filter(uma => uma._id.toString() === (motherRadio as HTMLInputElement)?.value)[0];

        if ( father._id === mother._id) {
            alert(" you cannot adopt the same uma!");
            return;
        }

        const broodMareSire = hofUmas.filter(uma => uma._id.toString() === mother?.father?.toString())[0];
        const motherMother = hofUmas.filter(uma => uma._id.toString() === mother?.mother?.toString())[0];
        const fatherFather = hofUmas.filter(uma => uma._id.toString() === father?.father?.toString())[0];
        const fatherMother = hofUmas.filter(uma => uma._id.toString() === father?.mother?.toString())[0];

        const factorEffects = consolidateRedFactors([father,mother,broodMareSire,fatherFather,fatherMother,motherMother]);

        if (factorEffects[0]) {
            inputFactorEffect("first-red-factor-star-bar", "first-red-factor-key", factorEffects[0]);
            setFirstRedFactorKey(factorEffects[0].kind);
            setFirstRedFactorLevel(factorEffects[0].stars);
        }
        if (factorEffects[1]) {
            inputFactorEffect("second-red-factor-star-bar", "second-red-factor-key", factorEffects[1]);
            setSecondRedFactorKey(factorEffects[1].kind);
            setSecondRedFactorLevel(factorEffects[1].stars);
        }
        if (factorEffects[2]) {
            inputFactorEffect("third-red-factor-star-bar", "third-red-factor-key", factorEffects[2]);
            setThirdRedFactorKey(factorEffects[2].kind);
            setThirdRedFactorLevel(factorEffects[2].stars);
        }
        if (factorEffects[3]) {
            inputFactorEffect("fourth-red-factor-star-bar", "fourth-red-factor-key", factorEffects[3]);
            setFourthRedFactorKey(factorEffects[3].kind);
            setFourthRedFactorLevel(factorEffects[3].stars);
        }
        if (factorEffects[4]) {
            inputFactorEffect("fifth-red-factor-star-bar", "fifth-red-factor-key", factorEffects[4]);
            setFifthRedFactorKey(factorEffects[4].kind);
            setFifthRedFactorLevel(factorEffects[4].stars);
        }
        if (factorEffects[5]) {
            inputFactorEffect("sixth-red-factor-star-bar", "sixth-red-factor-key", factorEffects[5]);
            setSixthRedFactorKey(factorEffects[5].kind);
            setSixthRedFactorLevel(factorEffects[5].stars);
        }
    }

    const inputFactorEffect = (barName: string, pulldownName: string, factorEffect: FactorEffect) => {
        const bar = document.getElementById(barName) as (null | HTMLInputElement);
        const pulldown = document.getElementById(pulldownName) as (null | HTMLInputElement);
        if (!bar || !pulldown) {
            console.warn(`not found the bar or pulldown! ${barName} ${pulldownName}`);
            return;
        }

        bar.value = ""+factorEffect.stars;
        pulldown.value = factorEffect.kind;
    };

    useEffect(() => {
        const hydrete = () => {
            if (umas.length > 0 && hofUmas.length > 0) { // redundant guard
                return;
            }
            fetch(`${getRoot()}api/historic/all`)
            .then(res=>res.json())
            .then((json: Ids) => {
                const ids = json.ids;
                return Promise.all(
                    ids.map(id=> {
                        return fetch(`${getRoot()}api/historic/${id.toString()}`)
                        .then(res=>res.json())
                    })
                )
            })
            .then((umas: HistoricUma[]) => {
                // alphabetical sort
                setUmas(umas.sort((uma1,uma2)=> uma1.name.localeCompare(uma2.name)));
            })
            .then(() => {
                fetch(`${getRoot()}api/historic/english/all`)
                .then(res => res.json())
                .then(wrappedResult => wrappedResult.result)
                .then((names: HistoricEntry[])=>{
                    const map = new Map();
                    names.map(name => map.set(name._id,name.name_en));
                    setHistoricUmas(map);
                })
            })
            .then(() => {
                fetch(`${getRoot()}api/hofuma/all`)
                .then(res => res.json())
                .then((umas: HoFUmaSummary[]) => {
                    setHofUmas(umas);
                });
            })
            .catch(err => {
                console.error(err);
            }) 
        };
        hydrete();
    },
    []
    );
    
        return <div className="dynamic-table">
            <div className="dynamic-search-input">
                <div className="red-factor-input-wrapper">
                    <div className="red-factor-input-row">
                        <label htmlFor="first-red-factor">first: </label>
                        {drawRedFactorBar(setFirstRedFactorKey,setFirstRedFactorLevel,firstRedFactorLevel,"first")}
                        <label htmlFor="second-red-factor">second: </label> 
                        {drawRedFactorBar(setSecondRedFactorKey,setSecondRedFactorLevel,secondRedFactorLevel,"second")}
                        <label htmlFor="second-red-factor">third: </label> 
                        {drawRedFactorBar(setThirdRedFactorKey,setThirdRedFactorLevel,thirdRedFactorLevel,"third")}
                    </div>
                    <div className={`${laterRedFactorsHidden?"hidden-":""}wrapper red-factor-input-row`}>
                        <label htmlFor="second-red-factor">forth: </label> 
                        {drawRedFactorBar(setFourthRedFactorKey,setFourthRedFactorLevel,fourthRedFactorLevel,"fourth")}
                        <label htmlFor="second-red-factor">fifth: </label> 
                        {drawRedFactorBar(setFifthRedFactorKey,setFifthRedFactorLevel,fifthRedFactorLevel,"fifth")}
                        <label htmlFor="second-red-factor">sixth: </label> 
                        {drawRedFactorBar(setSixthRedFactorKey,setSixthRedFactorLevel,sixthRedFactorLevel,"sixth")}
                        <button onClick={()=>setLaterRedFactorsHidden(true)} id="hide-later-red-factor-button">-</button>
                    </div>
                    <div className={`${!laterRedFactorsHidden?"hidden-":""}wrapper`}>
                        <button onClick={()=>setLaterRedFactorsHidden(false)} id="show-later-red-factor-button"> + </button>
                    </div>
                </div>
                <label htmlFor="historic-condition-one-rank">search condition 1: </label>
                <select id="historic-condition-one-rank" onChange={event => setConditionOneRank(Number.parseInt(event.target.value))}>
                    <option value="">-</option>
                    {getRanks().map(rank=><option value={codeRank(rank)} key={`option-${rank}`}>
                            {rank}
                        </option>
                    )}
                </select>
                <select id="historic-condition-one-key" onChange={event => setConditionOneKey(event.target.value as UmaPropertyKey | "")}> 
                    <option value="">-</option>
                    {getUmaPropertyKeys().map(key=><option value={codeUmaPropertyKey(key)} key={`option-${key}`}>
                            {key}
                        </option>
                    )}
                </select><br/>
                <label htmlFor="historic-condition-two-rank">search condition 2: </label>
                <select id="historic-condition-two-rank" onChange={event => setConditionTwoRank(Number.parseInt(event.target.value))}>
                    <option value="">-</option>
                    {getRanks().map(rank=><option value={codeRank(rank)} key={`option-${rank}`}>
                            {rank}
                        </option>
                    )}
                </select>
                <select id="historic-condition-two-key" onChange={event => setConditionTwoKey(event.target.value as UmaPropertyKey | "")}> 
                    <option value="">-</option>
                    {getUmaPropertyKeys().map(key=><option value={codeUmaPropertyKey(key)} key={`option-${key}`}>
                            {key}
                        </option>
                    )}
                </select><br/>
                <label htmlFor="historic-condition-three-rank">search condition 3: </label>
                <select id="historic-condition-three-rank" onChange={event => setConditionThreeRank(Number.parseInt(event.target.value))}>
                    <option value="">-</option>
                    {getRanks().map(rank=><option value={codeRank(rank)} key={`option-${rank}`}>
                            {rank}
                        </option>
                    )}
                </select>
                <select id="historic-condition-three-key" onChange={event => setConditionThreeKey(event.target.value as UmaPropertyKey | "")}> 
                    <option value="">-</option>
                    {getUmaPropertyKeys().map(key=><option value={codeUmaPropertyKey(key)} key={`option-${key}`}>
                            {key}
                        </option>
                    )}
                </select><br/>
                <label htmlFor="historic-condition-four-rank">search condition 4: </label>
                <select id="historic-condition-four-rank" onChange={event => setConditionFourRank(Number.parseInt(event.target.value))}>
                    <option value="">-</option>
                    {getRanks().map(rank=><option value={codeRank(rank)} key={`option-${rank}`}>
                            {rank}
                        </option>
                    )}
                </select>
                <select id="historic-condition-four-key" onChange={event => setConditionFourKey(event.target.value as UmaPropertyKey | "")}> 
                    <option value="">-</option>
                    {getUmaPropertyKeys().map(key=><option value={codeUmaPropertyKey(key)} key={`option-${key}`}>
                            {key}
                        </option>
                    )}
                </select>
            </div>
            <div className="dual">
                <div>
                    <button onClick={()=>adoptIngaPreset()}>因果preset</button>
                    <div className="uma-row" key="header">
                        <span className="uma-column uma-long-column">name</span>
                        <span className="uma-column">芝</span>
                        <span className="uma-column">ダ</span>
                        <span className="uma-column">短</span>
                        <span className="uma-column">マ</span>
                        <span className="uma-column">中</span>
                        <span className="uma-column">長</span>
                        <span className="uma-column">逃</span>
                        <span className="uma-column">先</span>
                        <span className="uma-column">差</span>
                        <span className="uma-column">追</span>
                    </div>
                    {umas
                        .filter(uma => dependingOnConditionOne(uma))
                        .filter(uma => dependingOnConditionTwo(uma))
                        .filter(uma => dependingOnConditionThree(uma))
                        .filter(uma => dependingOnConditionFour(uma))
                        .map(uma => {
                            return <HistoricRowDividion uma={uma} key={uma._id?.toString()}/>
                        })
                    }
                </div>
                <div className="right-part">
                    <button onClick={()=>referToParents()}>refer to parent(s)</button>
                    <UmaPropertyKeySelect setter={setHofRedFactorFilterFirst} id="setHofRedFactorFilterFirst"/>
                    <UmaPropertyKeySelect setter={setHofRedFactorFilterSecond} id="setHofRedFactorFilterSecond"/>
                    <UmaPropertyKeySelect setter={setHofRedFactorFilterThird} id="setHofRedFactorFilterThird"/>
                    <UmaPropertyKeySelect setter={setHofRedFactorFilterFourth} id="setHofRedFactorFilterFourth"/>
                    <div className="hof-select-area">
                        {!historicUmas?<></>:
                        hofUmas.map(hof => !hof.historic?<>historic missing!</>:
                            <div className={`hof-select-area-row ${hasAnyDesignatedFactor(hof,
                                    [hofRedFactorFilterFirst,hofRedFactorFilterSecond,hofRedFactorFilterThird,hofRedFactorFilterFourth].filter(a=>a) as UmaPropertyKey[]
                            )? "":"hidden-row"}`} key={hof._id.toString()} id={`hof-row-${hof._id.toString()}`}>
                                <input type="radio" name="father" value={hof._id.toString()}/>
                                <input type="radio" name="mother" value={hof._id.toString()}/>
                                <HoFUmaInlineRowDiv uma={hof} 
                                        fatherFactors={hof.father? extractThreeFactors(hof.father) : undefined}
                                        motherFactors={hof.mother? extractThreeFactors(hof.mother) : undefined}
                                name_en={historicUmas.get(hof.historic)}/>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>;
}

export default ViewAllHistoricUma;
export type { Ids };