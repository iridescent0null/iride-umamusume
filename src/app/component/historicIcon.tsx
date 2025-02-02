import Image from "next/image";

interface HistoricIconDivisionProps {
    name_en: string,
    tiny?: boolean
}

const HistoricIconDivision = (props: HistoricIconDivisionProps) => {
        return <span className={`uma-icon-wrapper ${props.tiny?"tiny-icon-wrapper":""}`}>
            <Image className="uma-icon" src={`/uma/icons/${props.name_en}_icon.png`} fill={true} alt={""}/>
        </span>;
};

export default HistoricIconDivision;