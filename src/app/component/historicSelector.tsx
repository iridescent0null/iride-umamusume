"use client"
import { Types } from "mongoose";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getRoot } from "../utils/webinfo";
import Image from "next/image";
import { HistoricUma } from "../db/type";
import { isNOTStranger, Stranger } from "../api/historic/[id]/route";
import { isDefined } from "../utils/basicFunctions";

interface UmaIcon {
    id: Types.ObjectId,
    name_en: string,
    name: string
}

interface HistoricUmaSelectorProps {
    selectUma: Dispatch<SetStateAction<Types.ObjectId | undefined>>
}
const HistoricUmaSelector = (props: HistoricUmaSelectorProps) => {
    const [umaIcons,setUmaIcons] = useState<UmaIcon[]>([]);
    const [selectedUma,selectUma] = useState<Types.ObjectId>();

    useEffect(() => {
        const getUmaIcons = () => {
            if (umaIcons.length > 0) {
                return;
            }
            fetch(`${getRoot()}api/historic/all`)
            .then(res => res.json())
            .then(json => {
                const ids: Types.ObjectId[] = json.ids;
                return Promise.all(
                    ids.map(id => {
                        return fetch(`${getRoot()}api/historic/${id.toString()}`)
                        .then(res => res.json())
                        .then((json: HistoricUma | Stranger) => {
                            if (!isNOTStranger(json)) {
                                return undefined;
                            }
                            return {
                                id: json._id,
                                name_en: json.name_en,
                                name: json.name
                            } as UmaIcon;
                        })
                    })
                );
            })
            .then((umas: (UmaIcon | undefined)[]) => {
                setUmaIcons(umas.filter(isDefined));
            });
        };
        getUmaIcons();
    },[]);    

    return <div className="historic-uma-icon-selector">
        {umaIcons.map(uma=>
                    <div className={`uma-icon-wrapper ${(selectedUma === uma.id)?"selected":""}`} 
                            key={uma.id.toString()} 
                            onClick={()=>{selectUma(uma.id); props.selectUma(uma.id)}
                    }>
                        <span>{uma.name}</span>
                        <Image className="uma-icon" src={`/uma/icons/${uma.name_en}_icon.png`} fill={true} alt={uma.name_en} 
                                sizes="(max-width: 92px) 20vw, (max-width: 92px) 20vw"
                        />
                    </div>
        )}   
    </div>;
}

export default HistoricUmaSelector;