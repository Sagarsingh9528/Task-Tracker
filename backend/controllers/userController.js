import bcrypt from 'bcryptjs'
import User from "../models/userModel.js"
import {generateToken} from '../config/token.js'

export const signup = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        if(!email || !password) {
            res.status(400).json({ message: 'Email and password required' });
        }

        const existing = await User.findOne({email});
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, passwordHash});
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        next(error);
    }
}


