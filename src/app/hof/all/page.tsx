import { HoFUmaSummary } from "@/app/api/hofuma/all/route"
import HoFUmaInlineRowDiv from "@/app/component/hofRow"
import { getRoot } from "@/app/utils/webinfo"

const ViewAllHallOfFameUmas = () => {
    return fetch(`${getRoot()}api/hofuma/all`)
    .then(res => res.json())
    .then((umas: HoFUmaSummary[]) => {
        return umas.map(uma =>{
            return <HoFUmaInlineRowDiv uma={uma}/>;
        }
    );})
    .catch(err => {
        console.error(err);
        return <>try again later!</>;
    });
}

export default ViewAllHallOfFameUmas;