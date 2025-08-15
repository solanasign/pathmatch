import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Improved async wrapper
const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.pathmatch@gmail.com',
    pass: process.env.PATHMATCH_GMAIL_APP_PASSWORD || '',
  },
});

interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

async function sendRegistrationEmail(data: RegistrationData): Promise<boolean> {
  const mailOptions = {
    from: 'info.pathmatch@gmail.com',
    to: 'info.pathmatch@gmail.com',
    subject: `New Registration: ${data.role === 'employer' ? 'Employer' : 'Job Seeker'}`,
    text: `New user registration:\n\nEmail: ${data.email}\nName: ${data.firstName} ${data.lastName}\nRole: ${data.role}`,
    html: `
      <h2>New User Registration</h2>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Role:</strong> ${data.role}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully');
    return true;
  } catch (err) {
    console.error('Error sending registration email:', err);
    throw new Error('Failed to send registration email');
  }
}

export const register = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const { email, password, role, firstName, lastName } = req.body;

  console.log('Registration request received:', { email, firstName, lastName, role });

  // Validate required fields
  if (!email || !password || !firstName || !lastName || !role) {
    res.status(400).json({ 
      success: false,
      message: 'All fields are required: email, password, first name, last name, and role' 
    });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
    return;
  }

  // Password validation
  if (password.length < 6) {
    res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters' 
    });
    return;
  }

  try {
    // Send registration email
    const emailSent = await sendRegistrationEmail({
      email,
      firstName,
      lastName,
      role
    });

    if (!emailSent) {
      throw new Error('Failed to send registration email');
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Registration successful. Email notification sent.',
      user: {
        email,
        firstName,
        lastName,
        role
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Registration failed' 
    });
  }
});

// Dummy login endpoint (since we're not storing users)
export const login = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Login functionality not implemented (no user storage)'
  });
});

// Dummy current user endpoint
export const getCurrentUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'User retrieval not implemented (no user storage)'
  });
});

// Dummy refresh token endpoint
export const refreshToken = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Token refresh not implemented (no user storage)'
  });
});