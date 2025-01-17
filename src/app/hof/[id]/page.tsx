import { HoFResponse, MaterializedHoFUma } from "@/app/api/hofuma/[id]/route";
import { AllRacesResponse } from "@/app/api/race/all/route";
import { AllScenarioFactorResponse } from "@/app/api/scenariofactor/all/route";
import { AllSkillsResponse } from "@/app/api/skill/all/route";
import HoFRowDivision from "@/app/component/hof";
import { Factor, Race, Skill, WhiteFactorWithoutUma } from "@/app/db/type";
import { RequestContext } from "@/app/historic/[id]/page";
import { getRoot } from "@/app/utils/webinfo";

interface ErrorMessage {
    message: string,
    status: number
}

const ViewHoF = (context: RequestContext) => {
    return context.params
    .then(params => {
        let _uma: MaterializedHoFUma;
        let _whiteFactors: WhiteFactorWithoutUma[];
        let _races: Race[];
        let _skills: Skill[];
        let _factors : Factor[];
        return fetch(`${getRoot()}/api/hofuma/${params.id}`)
        .then(res => {
            return res.json().then(json => {
                return {...json, status: res.status}
            })
        })
        .then((uma: HoFResponse | ErrorMessage) => {
            if ("message" in uma) {
                if (uma.status === 404) {
                    throw Error("uma not found", {cause: 404});                 
                }
                throw Error("failed to get the uma", {cause: uma.message});
            }
            _uma = uma.uma;
            _whiteFactors = uma.whiteFactors;
        })
        .then(() => fetch(`${getRoot()}/api/race/all`)
        .then(res => res.json())
        .then((json: AllRacesResponse) => json.races)
        .then((races: Race[] | undefined )=> { 
            if(!races){
                console.error("failed to retrieve races from the DB")
                return;
            }
            _races = races;
        }))
        .then(() => fetch(`${getRoot()}/api/skill/all`)
        .then(res => res.json())
        .then((json: AllSkillsResponse) => json.skills)
        .then((skills: Skill[] | undefined) => {
            if(!skills){
                console.error("failed to retrieve skills from the DB")
                return;
            }
            _skills = skills;
        })
        .then(() => fetch(`${getRoot()}/api/scenariofactor/all`)
            .then(res => res.json())
            .then((json: AllScenarioFactorResponse) => json.factors)
            .then((factors: Factor[] | undefined )=> {
                if(!factors){
                    console.error("failed to retrieve factors from the DB")
                    return;
                }
                _factors = factors;
                return <HoFRowDivision uma={_uma} whiteFactors={_whiteFactors} races={_races} skills={_skills} scenarios={_factors}/>
        }))
    )
    })
    .catch(err => {
        if (err.cause === 404) {
            return <>NOT FOUND</>;
        }
        console.log(err);
        throw err;
    });
};

export default ViewHoF;