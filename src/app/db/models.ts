import mongoose from "mongoose";

const Schema = mongoose.Schema;

/** One char strings for rank expression: S, A, B...*/
type Rank = "S" | "A" | "B" | "C" | "D" | "E" | "F" | "G";
const rankMap = new Map<Rank,number>();
rankMap.set("S",0);
rankMap.set("A",1);
rankMap.set("B",2);
rankMap.set("C",3);
rankMap.set("D",4);
rankMap.set("E",5);
rankMap.set("F",6);
rankMap.set("G",7);

/** e.g. E -> 5 */
function codeRank(rank: Rank) {
    return rankMap.get(rank);
}

/** e.g. 0 -> S (in Rank, which extends string) */
function decodeRank(rank: number) {
    return [...rankMap.entries()].find(entry=>entry[1] === rank)?.[0];
}

/** ["S", "A", "B"...] */
function getRanks() {
    return [...rankMap.keys()];
}

type Field = "turf" | "dirt";
type Distance = "sprint" | "mile" | "intermediate" | "long";
type Style = "lead" | "front" | "holdup" | "late";
type UmaPropertyKey = Field | Distance | Style;
const umaPropertyKeyMap = new Map<string,UmaPropertyKey>();
umaPropertyKeyMap.set("芝", "turf");
umaPropertyKeyMap.set("ダート", "dirt");
umaPropertyKeyMap.set("短距離", "sprint");
umaPropertyKeyMap.set("マイル", "mile");
umaPropertyKeyMap.set("中距離", "intermediate");
umaPropertyKeyMap.set("長距離", "long");
umaPropertyKeyMap.set("逃げ", "lead");
umaPropertyKeyMap.set("先行", "front");
umaPropertyKeyMap.set("差し", "holdup");
umaPropertyKeyMap.set("追込", "late");

/** e.g. 芝 => turf */
function codeUmaPropertyKey(plainName: string) {
    return umaPropertyKeyMap.get(plainName);
}

/** e.g. dirt => ダート, case sensitive */
function decodeUmaPropertyKey(key: UmaPropertyKey) {
    return [...umaPropertyKeyMap.entries()].find(entry => entry[1] === key)?.[0]
}

/** ["芝", "ダート", "短距離" ... "追込"] */
function getUmaPropertyKeys() {
    return [...umaPropertyKeyMap.keys()];
}
    
const HistoricUmaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true
    },
    property: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "properties"
    },
    plain_id: {
        type: Schema.Types.ObjectId,
        ref: "historic_umas"
    }
});
HistoricUmaSchema.index(
    {name: 1},
    {unique: true}
);
HistoricUmaSchema.index(
    {property: 1},
    {unique: true}
);

const PropertySchema = new Schema({
    turf: {
        type: Number,
        required: true
    },
    dirt: {
        type: Number,
        required: true
    },
    sprint: {
        type: Number,
        required: true
    },
    mile: {
        type: Number,
        required: true
    },
    intermediate: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    lead: {
        type: Number,
        required: true
    },
    front: {
        type: Number,
        required: true
    },
    holdup: {
        type: Number,
        required: true
    },
    late: {
        type: Number,
        required: true
    }
});

const ParameterSchema = new Schema({
    speed: {
        type: Number,
        required: true
    },
    stamina: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true  
    },
    guts: {
        type: Number,
        required: true      
    },
    wisdom: {
        type: Number,
        required: true  
    }
});
type UmaParameterKey = "speed" | "stamina" | "power" | "guts" | "wisdom";
const parameterKeykMap = new Map<string,UmaParameterKey>(); 
parameterKeykMap.set("スピード", "speed");
parameterKeykMap.set("スタミナ", "stamina");
parameterKeykMap.set("パワー", "power");
parameterKeykMap.set("根性", "guts");
parameterKeykMap.set("賢さ", "wisdom");
function codeUmaParameterKey(plainName: string) {
    return parameterKeykMap.get(plainName);
}
function decodeUmaParameterKey(key: UmaParameterKey) {
    return [...parameterKeykMap.entries()].find(entry => entry[1] === key)?.[0]
}
function getUmaParameterKeys() {
    return [...parameterKeykMap.keys()];
}

const HoFUmaSchema = new Schema({
    created: {
        type: Date,
        required: true
    },
    historic: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "historic_umas"
    },
    parameter: { // TODO unique constraint without index cannot be implemented?
        type: Schema.Types.ObjectId,
        required: true,
        ref: "parameters"
    },
    star: {
        type: Number,
        required: true 
    },
    point: {
        type: Number,
        required: true
    },
    awakeningLevel: {
        type: Number,
        required: true    
    },
    property: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "properties"
    },
    redStar: {
        type: Number,
        required: true   
    },
    redKind: {
        type: String,
        required: true   
    },
    greenStar: {
        type: Number,
        required: true      
    },
    blueStar: {
        type: Number, 
        required: true   
    },
    blueKind: {
        type: String,
        required: true   
    },
    father: { // not tested  yet
        type: Schema.Types.ObjectId,
        ref: "historic_umas"
    },
    mother: { // not tested  yet
        type: Schema.Types.ObjectId,
        ref: "historic_umas"
    },
    note: String
});

const WhiteFactorSchema = new Schema({
    HoFUma: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "hof_umas"
    },
    star: {
        type: Number,
        required: true   
    },
    skill: {
        type: Schema.Types.ObjectId,
        ref: "skills"
    },
    scenario: {
        type: Schema.Types.ObjectId,
        ref: "scenario_factor_names"
    },
    race: {
        type: Schema.Types.ObjectId,
        ref: "races"
    },
});
WhiteFactorSchema.index(
    {HoFUma: 1, skill: 1, scenario: 1, race: 1},
    {unique: true}
);

const ScenarioFactorNameSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});
ScenarioFactorNameSchema.index(
    {name: 1},
    {unique: true}
);

const RaceSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});
RaceSchema.index(
    {name: 1},
    {unique: true}
);

const SkillRowSchema = new Schema({ //TODO not tested yet
    HoFUma: { // TODO foreign key
        type: Schema.Types.ObjectId,
        required: true
    },
    skill: { // TODO foreign key
        type: Schema.Types.ObjectId,
        required: true
    }
});
// TODO index with unique constraint

type IconColor = "normal" | "blue" | "green" | "red";
type BackgroundColor = "normal" | "gold" | "red" | "iridescent";
const iconColorMap = new Map<IconColor,number>();
iconColorMap.set("normal",0);
iconColorMap.set("blue",1);
iconColorMap.set("green",2);
iconColorMap.set("red",3);
function codeIconColor(color: IconColor) {
    return iconColorMap.get(color);
}
function decodeIconColor(color: number) {
    return [...iconColorMap.entries()].find(entry=>entry[1] === color)?.[0];
}

const backgroundColorMap = new Map<BackgroundColor,number>();
backgroundColorMap.set("normal",0);
backgroundColorMap.set("gold",1);
backgroundColorMap.set("red",2);
backgroundColorMap.set("iridescent",3);
function codeBackgroundColor(color: BackgroundColor) {
    return backgroundColorMap.get(color);
}
function decodeBackgroundColor(color: number) {
    return [...backgroundColorMap.entries()].find(entry=>entry[1] === color)?.[0];
}

const SkillSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    iconColor: { // TODO code and decode  (0, normal; 1 blue; 2 green, 3:red)
        type: Number,
        required: true
    },
    backgroundColor: { // TODO code and decode  (0, normal; 1 gold; 2 pink)
        type: Number,
        required: true
    },
    isTurf: Boolean,
    isDirt: Boolean,
    isSprint: Boolean,
    isMile: Boolean,
    isIntermediate: Boolean,
    isLong: Boolean,
    isLead: Boolean,
    isFront: Boolean,
    isHoldup: Boolean,
    isLate: Boolean,
    inherent: {
        type: Schema.Types.ObjectId,
        ref: "historic_umas"
    },
    base: {
        type: Schema.Types.ObjectId,
        ref: "skills"
    }
});
SkillSchema.index(
    {name: 1},
    {unique: true}
);

// client mode requires the "?" mark (like models?.historic_umas) for some reason (next's bug?)
export const HistoricUmaModel = mongoose.models?.historic_umas || mongoose.model("historic_umas", HistoricUmaSchema);
export const PropertyModel = mongoose.models?.properties || mongoose.model("properties", PropertySchema);
export const SkillModel = mongoose.models?.skills || mongoose.model("skills", SkillSchema);
export const ParameterModel = mongoose.models?.parameters || mongoose.model("parameters", ParameterSchema);
export const HoFUmaModel = mongoose.models?.hof_umas || mongoose.model("hof_umas", HoFUmaSchema);
export const WhiteFactorModel = mongoose.models?.white_factors || mongoose.model("white_factors", WhiteFactorSchema);
export const RaceModel = mongoose.models?.races || mongoose.model("races", RaceSchema);
export const ScenarioFactorNameModel = mongoose.models?.scenario_factor_names || mongoose.model("scenario_factor_names", ScenarioFactorNameSchema);

export { codeRank, decodeRank, getRanks, codeUmaPropertyKey, decodeUmaPropertyKey, getUmaPropertyKeys, codeIconColor, codeBackgroundColor, decodeIconColor, decodeBackgroundColor, decodeUmaParameterKey, getUmaParameterKeys, codeUmaParameterKey};
export type { Rank, UmaPropertyKey, Field, Distance, Style, IconColor, BackgroundColor, UmaParameterKey };