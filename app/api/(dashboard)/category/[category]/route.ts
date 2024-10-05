import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;


export const PATCH = async(request: Request, context:{params: any})=>{

    try{
        const categoryId = context.params.category;
        const body = await request.json();
        const {title} = body;

        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}), {status:400});
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: "invalid or Missing categoryId"}), {status: 400});
        }

        await connect();

        const user = await User.findById(userId);
        
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}),{status: 404});
        }

        const category = await Category.findOne(
           { _id: categoryId,
            user: userId
        }
        )

        // console.log("category", category);

        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 404});
        }

        const UpdatedCategory = await Category.findByIdAndUpdate(
            
                categoryId,
                {title},
                {new: true}

        );

        console.log("UpdatedCategory", UpdatedCategory);
    

        return new NextResponse(JSON.stringify({message: "Category Updated", category: UpdatedCategory}), {status: 200});
    } catch(error: any){
        return new NextResponse(JSON.stringify({message: error.message}), {status:500});
    }
}

export const DELETE = async (request: Request, context:{params: any})=>{

    try{
        
        const categoryId = context.params.category;

        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}), {status:400});
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: "invalid or Missing categoryId"}), {status: 400});
        }

        await connect();

        const user = await User.findById(userId);
        console.log(user);
        
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}),{status: 404});
        }

        const category = await Category.findOne(
           { _id: categoryId,
            user: userId
        }
        )

        // console.log("category", category);

        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 404});
        }

        const delCategory = await Category.findByIdAndDelete(
            categoryId
        )

        console.log(delCategory);

        return new NextResponse(JSON.stringify({message: "category deleted", category: delCategory}),{status: 200})
        

    }catch(error: any){
        return new NextResponse(JSON.stringify({message: error.message}), {status:400});
    }

}