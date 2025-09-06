import jwt from 'jsonwebtoken'
import User from '../model/User.js'

export async function auth(req,res,next){
    try{
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7, header.length) : null;
        if(!token){
            return res.status(401).json({message: 'No token, authorization denied'});
        }
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).lean();
        if (!user) return res.status(401).json({ message: 'User not found' });

        if ((user.tokenVersion || 0) !== (payload.tokenVersion || 0)) {
         return res.status(401).json({ message: 'Token no longer valid (logout detected)' });
        }
        req.user = { id: user._id.toString(), businessId: user._id.toString() };
        req.tokenPayload = payload;
        next();
    }
    catch (err) {
     console.error(err);
     return res.status(401).json({ message: 'Invalid or expired token' });
}
}