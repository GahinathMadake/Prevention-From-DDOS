// controllers/authController.js
const User = require('../models/User.js');
const NodeCache = require("node-cache");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendEmail = require("../utils/sendEmail.js");


// Cache to store OTPs temporarily (expiry: 5 minutes)
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Generate a random 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};


const sendOTP = async (req, res) => {

    console.log("OTP send Request received");

  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    const cacheKey = `${email}:REGISTRATION`; 

    // Store OTP in cache
    const success = otpCache.set(cacheKey, otp);
    
    if (!success) {
      throw new Error('Failed to store OTP in cache');
    }


    // Send email with OTP
    await sendEmail(
        email,
        'Your OTP for Verification',
        `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello ${name},</h2>
            <p>Your OTP for account verification is:</p>
            <h1 style="background: #00466a; margin: 0 auto; width: max-content; padding: 10px 20px; color: #fff; border-radius: 4px;">
                ${otp}
            </h1>
            <p>This OTP is valid for 5 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>Your App Team</p>
            </div>
        `);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } 
  catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};



const verifyOTP = async (req, res) => {
    console.log("Registration user Request Received");

  try {
    const { email, name, password, code } = req.body;


    console.log(email, name, password, code);

    // Validate input
    if (!email || !name || !password || !code){
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }


    const cacheKey = `${email}:REGISTRATION`; // Must match the key used in sendOTP
    const cachedOtp = otpCache.get(cacheKey);

    // Debug logging
    console.log('Cache Key:', cacheKey);
    console.log('Cached OTP:', cachedOtp);
    console.log('Received OTP:', code);


    if (!cachedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found'
      });
    }

    if (cachedOtp != code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if user already exists (race condition check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } 
  catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
};




const axios = require("axios");
const jwt = require("jsonwebtoken");


const loginUser = async (req, res) => {

  console.log("requiest received for login");
  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha is required" });
  }

  try {
    // reCAPTCHA verification
    const verifyRes = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        secret: process.env.Recaptcha_KEY,
        response: captchaToken,
      }
    );
    

    // if (!verifyRes.data.success) {
    //   return res.status(400).json({ message: "Captcha verification failed" });
    // }

    // Find user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches (using bcrypt to compare hashed passwords)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id:user._id, email: user.email}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





module.exports = {sendOTP, verifyOTP, loginUser};