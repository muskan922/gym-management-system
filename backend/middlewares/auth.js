import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('_id name email role');

      if (!req.user) {
        const error = new Error("Not authorized, user not found");
        error.statusCode = 401;
        return next(error);
      }

      return next();

    } catch (err) {
      console.error(err);

      const error = new Error("Not authorized, token failed");
      error.statusCode = 401;
      return next(error);
    }
  }

  if (!token) {
    const error = new Error("Not authorized, no token");
    error.statusCode = 401;
    return next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.role || 'unknown'} is not authorized to access this route`,
      });
    }

    next();
  };
};