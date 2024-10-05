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

    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page: any = parseInt(searchParams.get("page") || "1");
    const limit: any = parseInt(searchParams.get("limit") || "10");

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

      const filter: any = {
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId),
      };
  
      if (searchKeywords) {
        filter.$or = [
          {
            title: { $regex: searchKeywords, $options: "i" },
          },
          {
            description: { $regex: searchKeywords, $options: "i" },
          },
        ];
      }
  
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
        };
      } else if (endDate) {
        filter.createdAt = {
          $lte: new Date(endDate),
        };
      }
  
      const skip = (page - 1) * limit;

      const newBlog = await Blog.find(filter).sort({createdat:"asc"}).skip(skip).limit(limit);

 
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