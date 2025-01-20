"use client"
import { useEffect, useState } from "react";
import { Race } from "../db/type";
import { getRoot } from "../utils/webinfo";
import { AllRacesResponse } from "../api/race/all/route";
import { Star } from "./hof";
import { Types } from "mongoose";

/** accept Map.set() to give the Race to the caller */
interface DynamicRaceListDivProps {
    raceSetter: (key: Types.ObjectId, value: Star | 0) => Map<Types.ObjectId, Star | 0>
}

const DynamicRaceListDiv = (props: DynamicRaceListDivProps) => {
    const[g1Races,setG1Races] = useState<Race[]>([]) ;

    useEffect(() => {
        const getRaces = () => {
            if (g1Races.length > 0) {
                return;
            }
            fetch(`${getRoot()}api/race/all`)
            .then(res=>res.json())
            .then((response: AllRacesResponse) => response.races)
            .then((races: Race[] | undefined) => {
                if (!races) {
                    console.error("failed to retrieve races!");
                    return;
                }
                // if non-G1 races start to appear in the API result, filter those out here!
                setG1Races(races);
            })
        };
        getRaces();
    },[]);

    return <div className="component-race-list">
        {g1Races.map(race => 
            <div key={`selector-${race._id}`} id={`selector-${race._id}`}>
                <select onChange={event => props.raceSetter(race._id, Number.parseInt(event.target.value) as (Star | 0))} 
                    defaultValue="0" 
                >
                    <option value="0">-</option>
                    <option value="1">★☆☆</option>
                    <option value="2">★★☆</option>
                    <option value="3">★★★</option>
                </select> 
                {race.name}  
            </div>
        )}
    </div>;
}

export default DynamicRaceListDiv;