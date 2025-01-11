"use client"
import HistoricRowDividion from "@/app/component/historicRow";
import { Rank, UmaPropertyKey, getUmaPropertyKeys, getRanks, codeRank, codeUmaPropertyKey } from "@/app/db/models";
import { HistoricUma } from "@/app/db/type";
import { getRoot } from "@/app/utils/webinfo"
import { Types } from "mongoose"
import { useEffect, useState } from "react";

interface Ids {
    ids: Types.ObjectId[];
}

const ViewAllHistoricUma = () => {

    const [umas,setUmas] = useState<HistoricUma[]>([]);
    const [conditionOneRank, setConditionOneRank] = useState<number>();
    const [conditionOneKey, setConditionOneKey] = useState<UmaPropertyKey | "">();
    const [conditionTwoRank, setConditionTwoRank] = useState<number>();
    const [conditionTwoKey, setConditionTwoKey] = useState<UmaPropertyKey | "">();
    const [conditionThreeRank, setConditionThreeRank] = useState<number>();
    const [conditionThreeKey, setConditionThreeKey] = useState<UmaPropertyKey | "">();
    const [conditionFourRank, setConditionFourRank] = useState<number>();
    const [conditionFourKey, setConditionFourKey] = useState<UmaPropertyKey | "">();

    const [fatherRedFactorKey,setFatherRedFactorKey] = useState<UmaPropertyKey | "">();
    const [fatherRedFactorLevel,setFatherRedFactorLevel] = useState<number>(0);
    const [motherRedFactorKey,setMotherRedFactorKey] = useState<UmaPropertyKey | "">();
    const [motherRedFactorLevel,setMotherRedFactorLevel] = useState<number>(0);

    /** 
     * determine how it looses the limitation considering red factors. \
     * e.g. returning 2 means that C rank is OK when A rank is required, because the following eq is true: \
     * C <= A - 2. \
     * When none of the red factors is concerning the given key, just returns 0.
     */
    const determineEaseValue = (key: UmaPropertyKey) => {
        const starMax = 10;
        let stars = 0;
        if (fatherRedFactorKey === key) {
            stars = stars + fatherRedFactorLevel;
        }
        if (motherRedFactorKey === key) {
            stars = stars + motherRedFactorLevel;
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

        (document.getElementById("father-red-factor-key") as HTMLSelectElement).value = "dirt";
        setFatherRedFactorKey("dirt");
    };

    useEffect(() => {
        const hydrete = () => {
            if (umas.length > 0) { // redundant guard
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
                    <label htmlFor="father-red-factor">father: </label>
                    <div id="father-red-factor" className="red-factor-input">
                        <select id="father-red-factor-key" onChange={event => setFatherRedFactorKey(event.target.value as UmaPropertyKey | "")}> 
                            <option value="">-</option>
                            {getUmaPropertyKeys().map(key=>
                                <option value={codeUmaPropertyKey(key)} key={`father-option-${key}`}>
                                    {key}
                                </option>
                            )}
                        </select>
                            <span className="three-stars">
                            <span className="the-0-star star"></span>
                            {[1,2,3,4,5,6,7,8,9].map(i => <span className={"the-"+i+"-star star"} key={"father-star-"+i}>
                                ★
                            </span>)
                            }
                            <span className="the-10-star star" key="father-star-10">☆</span>
                        </span><br/>
                        <span className="star-value">{fatherRedFactorLevel}</span>
                        <span className="star-bar-wrapper">
                            <input type="range" className="star-bar" id="father-red-factor-star-bar" 
                                    min={0} max={10} step={1} defaultValue={0} 
                                    onChange={event => setFatherRedFactorLevel(Number.parseInt(event.target.value))}
                            />
                        </span>
                    </div>
                    <label htmlFor="mother-red-factor">mother: </label> 
                    <div id="mother-red-factor" className="red-factor-input">
                        <select id="mother-red-factor-key" onChange={event => setMotherRedFactorKey(event.target.value as UmaPropertyKey | "")}> 
                            <option value="">-</option>
                            {getUmaPropertyKeys().map(key=>
                                <option value={codeUmaPropertyKey(key)} key={`mother-option-${key}`}>
                                    {key}
                                </option>
                            )}
                        </select>
                        <span className="three-stars">
                            <span className="the-0-star star"></span>
                            {[1,2,3,4,5,6,7,8,9].map(i => <span className={"the-"+i+"-star star"} key={"mother-star-"+i}>
                                ★
                            </span>)
                            }
                            <span className="the-10-star star" key="mother-star-10">☆</span>
                        </span><br/>
                        <span className="star-value">{motherRedFactorLevel}</span>
                        <span className="star-bar-wrapper">
                            <input type="range" className="star-bar" id="mother-red-factor-star-bar" 
                                    min={0} max={10} step={1} defaultValue={0} 
                                    onChange={event => setMotherRedFactorLevel(Number.parseInt(event.target.value))}
                            />
                        </span>
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
        </div>;
}

export default ViewAllHistoricUma;