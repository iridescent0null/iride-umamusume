import { Rank } from "../db/models"

interface RankProps {
    rank: Rank
}

const RankDivision = (props: RankProps) => {
    return (
        <span className={"rank-"+props.rank +" rank"}>
            {props.rank}
        </span>
    )
};

export default RankDivision;