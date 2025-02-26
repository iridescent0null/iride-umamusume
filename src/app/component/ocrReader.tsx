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

/** 
 * Form to recognize screenshots of hall of fame umamusumes containing their factors and fill inputs out with the recognized text 
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
        const worker = await createWorker(traineddataForHallOfFameUmas, 1, {langPath: "../tesseract/"});

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
    </>;
};

export default OcrReaderDiv;