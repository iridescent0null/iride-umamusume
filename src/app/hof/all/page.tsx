import { HoFUmaSummary } from "@/app/api/hofuma/all/route"
import HoFUmaInlineRowDiv, { ThreeFactors } from "@/app/component/hofRow"
import { getRoot } from "@/app/utils/webinfo"
import { Types } from "mongoose";

const ViewAllHallOfFameUmas = () => {
    return fetch(`${getRoot()}api/hofuma/all`)
    .then(res => res.json())
    .then((umas: HoFUmaSummary[]) => {
        const extractThreeFactors = (umaId: Types.ObjectId) => {
            const uma = umas.find(summary => summary._id === umaId);
            return !uma? undefined :
                    {
                        redKind: uma.redKind,
                        redStar: uma.redStar,
                        blueKind: uma.blueKind,
                        blueStar: uma.blueStar,
                        greenStar: uma.greenStar,
                        historic: uma.historic
                    } as ThreeFactors;
        }

        return umas.sort((a,b)=> new Date(a.created).getTime() -  new Date(b.created).getTime()).map(uma =>{
            return <HoFUmaInlineRowDiv uma={uma} 
                    fatherFactors={uma.father? extractThreeFactors(uma.father) : undefined}
                    motherFactors={uma.mother? extractThreeFactors(uma.mother) : undefined}
            />;
        }
    );})
    .catch(err => {
        console.error(err);
        return <>try again later!</>;
    });
}

export default ViewAllHallOfFameUmas;