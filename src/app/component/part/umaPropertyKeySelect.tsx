import { codeUmaPropertyKey, getUmaPropertyKeys, UmaPropertyKey } from "@/app/db/models";
import { Dispatch, SetStateAction } from "react";

interface SelectProps {
    id: string,
    setter: Dispatch<SetStateAction<UmaPropertyKey | undefined>>
}

const UmaPropertyKeySelect = (props: SelectProps) => {

    return <select onChange={event => props.setter(event.target.value as UmaPropertyKey)} id={props.id} >
        <option value="">-</option>
        {getUmaPropertyKeys().map(key => <option value={codeUmaPropertyKey(key)} key={`option-${key}`}>
                {key}
            </option>
        )}
    </select>;
};

export default UmaPropertyKeySelect;