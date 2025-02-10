import { createWorker } from "tesseract.js";

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

    // FIXME frankly tesseract results a little lousy Japanese texts, then replace it with another OCR (macOS's preview?)
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

        const worker = await createWorker("jpn", 1, {langPath: "../tesseract/"});
        try {
            await worker.load();
            //TODO tesseract shows countless warnings insist there are many missing parameter
            await worker.setParameters({
                preserve_interword_spaces:"0",
                user_defined_dpi: "144"
            });
            const result = await worker.recognize(input.files[0]);
            console.log(result);
            console.log(result.data.text);
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