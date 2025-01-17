import { ParameterWithoutId } from "../db/type";

interface WrappedParameterWithoutId {
    parameter: ParameterWithoutId
}

const toRank = (parameterValue: number) => {
    return parameterValue > 1200? "U"
            :parameterValue > 1100? "SS"
                    :parameterValue > 1000? "S"
                            :parameterValue > 800? "A"
                                    :parameterValue > 600? "B"
                                            :parameterValue > 400? "C"
                                                    :parameterValue > 300? "D"
                                                            :parameterValue > 200? "E"
                                                                    :parameterValue > 100? "F"
                                                                            :"G"
};

const ParameterTableDiv = (prop: WrappedParameterWithoutId) => {
    const parameter = prop.parameter;
    return <div className="parameter-table">
        <div className="row">
            <div className="column">
                Speed
            </div>
            <div className="column">
                Stamina
            </div>
            <div className="column">
                Power
            </div>
            <div className="column">
                Guts
            </div>
            <div className="column">
                Wis
            </div>
        </div>
        <div className="row">
            <div className={`column parameter-value parameter-column-${toRank(parameter.speed)}`}>
                {parameter.speed}
            </div>
            <div className={`column parameter-value parameter-column-${toRank(parameter.stamina)}`}>
                {parameter.stamina}
            </div >
            <div className={`column parameter-value parameter-column-${toRank(parameter.power)}`}>
                {parameter.power}
            </div>
            <div className={`column parameter-value parameter-column-${toRank(parameter.guts)}`}>
                {parameter.guts}
            </div>
            <div className={`column parameter-value parameter-column-${toRank(parameter.wisdom)}`}> 
                {parameter.wisdom}
            </div>
        </div>
    </div>;
};

export default ParameterTableDiv;