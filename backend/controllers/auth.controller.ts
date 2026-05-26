import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { Register, Login } from "../schemas/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

export const register = async (req: Request, res: Response): Promise<void> => {
    const result = Register.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ message: result.error.issues[0].message });
        return;
    }

    const { name, email, password } = result.data;

    const existing = await UserModel.findOne({ email });
    if (existing) {
        res.status(409).json({ message: "An account with this email already exists." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
        message: "Account created successfully.",
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        },
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const result = Login.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ message: result.error.issues[0].message });
        return;
    }

    const { email, password } = result.data;

    const user = await UserModel.findOne({ email });
    if (!user) {
        res.status(401).json({ message: "Invalid email or password." });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password." });
        return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
        message: "Logged in successfully.",
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        },
    });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
    }
    res.status(200).json({ user });
};
