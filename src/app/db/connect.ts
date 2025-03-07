import mongoose, { Types } from "mongoose";
import Config from "../../../secret/config";
import { NextResponse } from "next/server";

const url = `mongodb+srv://${Config.DB.user}:${Config.DB.password}@cluster0.9blrk.mongodb.net/${Config.DB.DbName}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.debug("connected to MongoDB");
    } catch(err) {
        console.error(err);
        throw new Error("failed to connect to MongoDB!");
    }
};

interface IdParameterContext {
        params: Promise<{id?: string}>
}

const extractIdFromURL = async (context: IdParameterContext) => {
    const params = await context.params;
    if (!params || !params.id || Array.isArray(params.id)) {
        return NextResponse.json({massage: `invalid paramter: ${params?.id}`}, {status: 400});
    }

    try {
        // FIXME bad technique: try-catch clause for conditional branch
        new Types.ObjectId(params.id);
    } catch (err) {
        console.log(err);
        return NextResponse.json({massage: `invalid paramter: ${params.id}`}, {status: 400});
    }
    return params.id;
};

export default connectDB;
export { extractIdFromURL };
export type { IdParameterContext as IdParameteContext };