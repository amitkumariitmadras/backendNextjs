import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

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
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "userId or newUsername is not present" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "userId isn't valid" }),
        { status: 400 }
      );
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );
    if (!updateUser) {
      return new NextResponse(
        JSON.stringify({ message: "User couldn't be updated" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Username has been Updated",
        user: updateUser,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error:" + err.message, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "userId isn't avaialable" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "userId isn't valid" }),
        { status: 400 }
      );
    }
    await connect();

    const UpdatedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!UpdatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "user isn't available in database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User has been deleted", user: UpdatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};
