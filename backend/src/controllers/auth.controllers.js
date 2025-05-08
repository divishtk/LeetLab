import bcrypt from "bcryptjs";
import {
    db
} from "../libs/db.js";
import {
    UserRole
} from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
    const {
        email,
        password,
        name
    } = req.body;


    try {
        const existinguUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existinguUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER,
            },
        });

        const token = jwt.sign({
                id: newUser.id,
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d",
            }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            samesite: "strict",
            secure: process.env.NODE_ENV !== "DEVLOPMENT",
            maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
        });

        res.status(200).json({
            sucess: true,
            message: "User Created!",
            user: {
                newUser,
            },
        });
    } catch (error) {
        console.log("Err", error);
        res.status(500).json({
            error: "Error Creating user",
        });
    }
};


export const login = async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({
                id: user.id
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d"
            }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            samesite: "strict",
            secure: process.env.NODE_ENV !== "DEVLOPMENT",
            maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
        });

        res.status(200).json({
            sucess: true,
            message: "User Loggedin Success!",
            user: {
                user,
            },
        });

    } catch (error) {
        console.log("Err", error);
        res.status(500).json({
            error: "Error Logging in user",
        });
    }

};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            samesite: "strict",
            secure: process.env.NODE_ENV !== "DEVLOPMENT",
        });
        res.status(200).json({
            sucess: true,
            message: "User Logged out successfully"
        });
    } catch (error) {

    }

};

export const check = (req, res) => {
    try {
        res.status(200).json({
            sucess: true,
            message: "User authenticated successfully",
            user: req.user,
        });
    } catch (error) {
            console.log("Err", error);
            res.status(500).json({
            error: "User not authenticated",
        });
    }
};