import jwt from 'jsonwebtoken'
import {validationResult} from 'express-validator'
import User from '../model/User.js'

export const register = async (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const  {username,email,password} = req.body;

        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"Useer already exist"})
        }
        const user = new User({username,email});
        await user.setPassword(password);
        await user.save();

        const token = jwt.sign(
            {userId:user._id,
            tokenVersion:user.tokenVersion},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        res.status(201).json({message:"User registered successfully",
            user:{username:user.username,email:user.email,id:user._id},
            token})
    }
    catch(err){
        res.status(500).json({message:"Internal server error"})
    }
}

export const login = (async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const logout = async (req,res) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:"No token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.userId,{$inc:{tokenVersion:1}});

        res.json({message:"logged out successfully"})
    }
    catch(err){
        res.status(500).json({message:"Internal server error"})
    }
}