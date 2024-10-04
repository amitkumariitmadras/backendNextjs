import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import Category from "@/app/lib/modals/category";
import Blog from "@/app/lib/modals/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;


export const GET = async(request: Request) =>{

    try{
    console.log("hello")
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    console.log(categoryId);

    if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing userId" }),
          { status: 400 }
        );
      }
  
      if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing categoryId" }),
          { status: 400 }
        );
      }
  
      await connect();

      const user = await User.findById(userId);

      if(!user){
        return new NextResponse(JSON.stringify({ message: "User not found" }), {
            status: 404,
          });
      }

      const category = await Category.findById(categoryId)

      if(!category){
        return new NextResponse(JSON.stringify({ message: "Category not found" }), {
            status: 404,
          });
      }

      const newBlog = await Blog.find({
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId),
      })

 
      return new NextResponse(JSON.stringify({newBlog}), {status: 200});

    } catch(error: any){
        return new NextResponse(JSON.stringify({ message: "Blog not found" + error.message }), {
            status: 400,
          });
    }

}

export const POST = async(request: Request) =>{

    try{
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        const body = await request.json();
        const {title, description} = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing userId" }),
          { status: 400 }
        );
      }
  
      if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing categoryId" }),
          { status: 400 }
        );
      }
  
      await connect();

      const user = await User.findById(userId);

      if(!user){
        return new NextResponse(JSON.stringify({ message: "User not found" }), {
            status: 404,
          });
      }

      const category = await Category.findById(categoryId)

      if(!category){
        return new NextResponse(JSON.stringify({ message: "Category not found" }), {
            status: 404,
          });
      }

      const newBlog = new Blog(
       {
        title,
        description,
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId)
       }
      )

      await newBlog.save();

      return new NextResponse(JSON.stringify({message: "Blog created", blog: newBlog}), {status:200})

    } catch(error: any){
        return new NextResponse(JSON.stringify({ message: "Blog not found" + error.message }), {
            status: 400,
          });
    }    

}