"use client"
import HistoricRowDividion from "@/app/component/historicRow";
import { HistoricUma } from "@/app/db/type";
import { getRoot } from "@/app/utils/webinfo"
import { Types } from "mongoose"
import { useEffect, useState } from "react";

interface Ids {
    ids: Types.ObjectId[];
}

const ViewAllHistoricUma = (ignored: unknown) => {

    const [umas,setUmas] = useState<HistoricUma[]>([]);

    useEffect(() => {
        const hydrete = () => {
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
                setUmas(umas);
            })
            .catch(err => {
                console.error(err);
            }) 
        };
        hydrete();
    },
    []
    );
    
        return <>
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
            {umas.map(uma => {
                return <HistoricRowDividion uma={uma} key={uma._id?.toString()}/>
            })}
        </>;
}

export default ViewAllHistoricUma;