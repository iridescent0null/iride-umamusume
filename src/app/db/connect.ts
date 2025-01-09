import mongoose, { Types } from "mongoose";
import Config from "../../../secret/config";
import { RouteModuleHandleContext } from "next/dist/server/route-modules/route-module";
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

const extractIdFromURL = async (context: RouteModuleHandleContext) => {
        const params = await context.params; // my editor erroneously insists the await is meaningless. (it is significant!)
        if (!params || !params.id || Array.isArray(params.id)) {
            return NextResponse.json({massage: `invalid paramter: ${params?.id}`}, {status: 400});
        }

        try {
            new Types.ObjectId(params.id);
        } catch (err) {
            console.log(err);
            return NextResponse.json({massage: `invalid paramter: ${params.id}`}, {status: 400});
        }
        return params.id;
};

export default connectDB;
export { extractIdFromURL };