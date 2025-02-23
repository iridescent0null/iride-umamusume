import { createWorker, PSM } from "tesseract.js";
import { getRanks, getUmaPropertyKeys, Rank, UmaPropertyKey } from "../db/models";
import { isDefined } from "../utils/basicFunctions";

interface OcrReaderDivProps {
    inputIds: {
        speed: string,
        stamina: string,
        power: string,
        guts: string,
        widsom: string,
        point: string
    }
}

interface PropertyPair {
    key: UmaPropertyKey,
    value: Rank
}

// TODO there still are functions for both of tesseract and MacOS Preview. Adopt one side and remove the others

/** 
 * Form to recognize screenshots of hall of fame umamusumes containing their factors and fill inputs out with the recognized text \
 * Currently this div can use both of tesseract and MacOS Preview as OCR, but one of those will be abandoned shortly
 */
const OcrReaderDiv = (props: OcrReaderDivProps) => {
    const setFilename = (name: string) => {
        (document.getElementById("hof-ocr-dropped-filename") as HTMLBodyElement).innerHTML =
                "file: "+name.replaceAll(/C:\\fakepath\\/g,"");
    };

    const extractParameters = (text: string) => {
        const fiveNumbers = /\d{3,4}/g;
        const parametersLines = text.split("\n").filter(line => {
            const match = line.match(fiveNumbers);
            return match && match.length === 5;
        });
        if (parametersLines.length !== 1) {
            console.log(`failed to extract her parameters: ${parametersLines}`);
            alert("failed to extract parameters!");
            return;
        }

        const parameters = parametersLines[0].match(fiveNumbers)!;
        console.log(`extracted parameters: ${parameters}`);
        
        (document.getElementById(props.inputIds.speed) as HTMLInputElement).value = parameters[0];
        (document.getElementById(props.inputIds.stamina) as HTMLInputElement).value = parameters[1];
        (document.getElementById(props.inputIds.power) as HTMLInputElement).value = parameters[2];
        (document.getElementById(props.inputIds.guts) as HTMLInputElement).value = parameters[3];
        (document.getElementById(props.inputIds.widsom) as HTMLInputElement).value = parameters[4];
    };

    const extractPoint = (text: string) => {
        const pointPattern = /\d{1,2}[\,\.]\d{1,3}/;
        const pointLines = text.split("\n").filter(line =>  {
            const match = line.match(pointPattern);
            return match && match.length === 1;
        });
        if (pointLines.length !== 1) {
            console.log(`failed to extract her point: ${pointLines}`);
            alert("failed to extract the point!");
            return;
        }

        // 12,345 or 12.345 => 12345
        const point = pointLines[0].match(pointPattern)![0].replaceAll(/[\,\.]/g,"");
        (document.getElementById(props.inputIds.point) as HTMLInputElement).value = point;
    };

    const extractProperties = (extractedWithPreview: string) => {
        const propertyAreaPattern = /(?<=脚質適性)[\s\S]*(?=スキル)/;
        const propertyPatternAllowingAdditives = `(${getUmaPropertyKeys().reduce((a,b)=>{return a+"|"+b})})[\\s\\S]{0,1}\\S`;
        const propertyPattern = `(${getUmaPropertyKeys().reduce((a,b)=>{return a+"|"+b})})`;

        const propertiesPortion = extractedWithPreview.match(propertyAreaPattern);
        if (!propertiesPortion) {
            console.warn("failed to extract properties");
            return;
        }

        // mac preview often adds white spaces or line breaks, then permit those in dection
        const rawPropertyPairs = propertiesPortion[0].match(RegExp(propertyPatternAllowingAdditives,"g"));
        if (!rawPropertyPairs) {
            console.warn("failed to extract properties");
            return;
        }

        // then removing those and read the key & values
        const propertyPairs = rawPropertyPairs.map(pair => pair.replace(/\r\n|\n|\r|\s/,""))
                .map(pair => {
                        return {
                                key: pair.match(propertyPattern)![0] as UmaPropertyKey, 
                                value: pair.replace(RegExp(propertyPattern),"")
                        }
                })
                .map(rectifyCharacterForMacPreview)
                .map(pair => {
                    if (getRanks().some(rank => rank === pair.value)) {
                        return pair as PropertyPair;
                    }
                    console.warn(`removed: ${pair}`);
                    return undefined;
                })
                .filter(isDefined);

        console.log(propertyPairs);
        // TODO fill the form out with the result
    }

    /** list up known problematic characters which Preview regularly generates and fix those */
    const rectifyCharacterForMacPreview = (pair: {key: UmaPropertyKey, value: string}) => {
        return {key:pair.key,value:pair.value.replace("8","S")};
    }

    const extractParameterPortion = (extractedWithPreview: string) => {
        const parameterRowPattern = /(?<=スピード)[\s\S]*(?=バ場適性)/;
        const numberPattern = /\d{3,5}/g;

        const parameterLine = extractedWithPreview.match(parameterRowPattern);
        const parameters = (parameterLine? parameterLine[0] : extractedWithPreview) // when it failes to detect the paramter line, search whole of the text instead
                .replace(/\r\n|\n|\r/," ") // mac preview often adds line breaks
                .replace(/\d{1,2}[\,\.]\d{3}/g,"") // numbers' with a period or comma should be a point, not a parameter value
                .match(numberPattern)!.map(str => Number.parseInt(str))
                .map(fixTooLargeParameterValue);

        if (parameters.length !== 5) {
            console.warn(`failed to extract parameters ${parameters}`);
        }

        (document.getElementById(props.inputIds.speed) as HTMLInputElement).value = parameters[0]+"";
        (document.getElementById(props.inputIds.stamina) as HTMLInputElement).value = parameters[1]+"";
        (document.getElementById(props.inputIds.power) as HTMLInputElement).value = parameters[2]+"";
        (document.getElementById(props.inputIds.guts) as HTMLInputElement).value = parameters[3]+"";
        (document.getElementById(props.inputIds.widsom) as HTMLInputElement).value = parameters[4]+"";
    }

    const fixTooLargeParameterValue = (value: number) => {
        // mac preview sometimes makes parameter values like U81234, erroneously recognizing the rank prefix as a number (UG => U8)
        // then 5 digit paramter numbers should be converted (U81234 -> 1234)
        const threshold = 2001;
        if (value < threshold) {
            return value;
        }
        if (value < 10000 || value > 99999) {
            console.log(value);
            // TODO handle 2001 - 9999 (error, perhaps)
            // TODO handle numbers like U123456
            throw Error(`cannot handle the parameter value yet ${value}`);
        }
        return value - Number.parseInt((value+"").substring(0,1)) * 10000;
    }

    const readImage = async () => {
        const input = document.getElementById("orc-image-input") as HTMLInputElement | null;
        if (!input) {
            alert("not found input!");
            return;
        }
        if (!input.files || input.files.length < 1) {
            alert("designate image!");
            return;
        }

        // training result specialized for this app
        const traineddataForHallOfFameUmas = "jpn_hofuma";
        const worker = await createWorker("jpn_hofuma", 1, {langPath: "../tesseract/"});

        // if you cannot use the specialized trained data, you can use the default and latest jpn trained data like:
        // const defaultTraineddataPath = "https://tessdata.projectnaptha.com/4.0.0_best/";
        // const worker = await createWorker("jpn", 1, {langPath: defaultTraineddataPath});
        // ...but it will provide you with lousy results failing to detect stars (e.g., ★☆☆) 
        
        try {
            // TODO attune the parameters
            await worker.setParameters({
                preserve_interword_spaces: "1",
                chop_enable: "1",
                use_new_state_cost: "0",
                segment_segcost_rating: "0",
                user_defined_dpi: "442",
                edges_max_children_per_outline: "40",
                tessedit_char_blacklist: "⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿",
                tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
            });
            const result = await worker.recognize(input.files[0]);
            console.debug(result);
            console.debug(result.data.text);
            extractParameters(result.data.text);
            extractPoint(result.data.text);
        } catch (err) {
            console.error(err);
        } finally {
            worker.terminate();
        }
    };

    const readExtractionFromImage = async (text: string) => {
        extractProperties(text);
        extractParameterPortion(text);
        extractPoint(text);
    };

    return <>
        <div className="hof-ocr">
            <h4>use screenshot</h4>
            <div id="hof-ocr-dropped-filename"></div>
            <span className="droparea-background">Drop you screenshot here!</span>
            <input type="file" id="orc-image-input" 
                    onDrop = {event => setFilename((event.target as HTMLInputElement).value)}
                    onChange = {event => setFilename(event.target.value)}
            />
        </div>
        <button className="hof-ocr-button" onClick={() => readImage()}>read</button>
        <div className="hof-text">
            <div id="hof-ocr-dropped-filename"></div>
            <textarea placeholder="input extracted text with Mac preview" id="hof-text-textarea"/>
        </div>
        <button className="hof-ocr-button" onClick={() => readExtractionFromImage((document.getElementById("hof-text-textarea") as HTMLInputElement).value)}>read</button>
    </>;
};

export default OcrReaderDiv;