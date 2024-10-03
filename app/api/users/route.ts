import { NextResponse } from "next/server";

export const GET = ()=>{
    return new NextResponse("This is my new API");
}