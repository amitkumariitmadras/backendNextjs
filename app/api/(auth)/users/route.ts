import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const Users = await User.find();

    return new NextResponse(JSON.stringify(Users), { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Error" + err.message, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const user = await request.json();
    await connect();
    const newUser = new User(user);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "New User created", user: newUser }),
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Error" + err.message, { status: 500 });
  }
};


export const PATCH = async (request: Request) => {
  const User = await request.json();
  
}   
