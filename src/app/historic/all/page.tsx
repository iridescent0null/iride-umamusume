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

    const dependingOnConditionOne = (uma: HistoricUma) => {
        // if there is no valid conditions, all umas are OK
        if (conditionOneRank === void 0 || Number.isNaN(conditionOneRank)|| !conditionOneKey) {
            return true;
        }
        return uma.property![conditionOneKey]! <= conditionOneRank;
    }
    const dependingOnConditionTwo = (uma: HistoricUma) => {
        if (conditionTwoRank === void 0 || Number.isNaN(conditionTwoRank)|| !conditionTwoKey) {
            return true;
        }
        return uma.property![conditionTwoKey]! <= conditionTwoRank;
    }
    const dependingOnConditionThree = (uma: HistoricUma) => {
        if (conditionThreeRank === void 0 || Number.isNaN(conditionThreeRank)|| !conditionThreeKey) {
            return true;
        }
        return uma.property![conditionThreeKey]! <= conditionThreeRank;
    }
    const dependingOnConditionFour = (uma: HistoricUma) => {
        if (conditionFourRank === void 0 || Number.isNaN(conditionFourRank)|| !conditionFourKey) {
            return true;
        }
        return uma.property![conditionFourKey]! <= conditionFourRank;
    }

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