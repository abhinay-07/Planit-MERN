const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
const sendVerificationEmail = async (email, token, userType, name) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    
    let subject, html;
    
    if (userType === 'student') {
      subject = 'Verify your VIT-AP Email - Plan It';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Plan It, ${name}!</h2>
          <p>Thank you for registering with your VIT-AP email address. Please verify your email to complete your student account setup.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Next Steps:</h3>
            <ol>
              <li><strong>Verify your email</strong> by clicking the button below</li>
              <li><strong>Upload verification documents</strong> (Student ID, ID Card)</li>
              <li><strong>Wait for admin approval</strong> (usually within 24 hours)</li>
              <li><strong>Start exploring</strong> with verified student privileges!</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify VIT-AP Email
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 24 hours. If you didn't create an account with Plan It, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Plan It - Your Local Guide | VIT-AP University
          </p>
        </div>
      `;
    } else {
      subject = 'Verify your Email - Plan It';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Plan It, ${name}!</h2>
          <p>Thank you for joining our community. Please verify your email address to complete your registration.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 24 hours. If you didn't create an account with Plan It, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Plan It - Your Local Guide
          </p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"Plan It" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, name, userType) => {
  try {
    const transporter = createTransporter();
    
    let subject, html;
    
    if (userType === 'student') {
      subject = 'Welcome to Plan It - Student Account Activated!';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🎉 Welcome to Plan It, ${name}!</h2>
          <p>Your VIT-AP student account has been successfully verified and activated!</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0;">Student Privileges Unlocked:</h3>
            <ul style="color: #047857;">
              <li>✅ Write verified student reviews</li>
              <li>✅ Filter reviews to see only student feedback</li>
              <li>✅ Access to student-only vehicle rentals</li>
              <li>✅ Exclusive VIT-AP community features</li>
              <li>✅ Priority access to trending spots</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
               style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Exploring
            </a>
          </div>
          
          <p>Happy exploring around VIT-AP! 🚀</p>
        </div>
      `;
    } else {
      subject = 'Welcome to Plan It!';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Welcome to Plan It, ${name}!</h2>
          <p>Your account has been successfully verified. Start discovering amazing places around VIT-AP!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Exploring
            </a>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: `"Plan It" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification for student verification
const sendAdminNotification = async (studentData) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Student Verification Required</h2>
        <p>A new VIT-AP student has registered and needs verification approval.</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #991b1b; margin-top: 0;">Student Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${studentData.name}</li>
            <li><strong>Email:</strong> ${studentData.email}</li>
            <li><strong>VIT-AP ID:</strong> ${studentData.vitapId}</li>
            <li><strong>Year:</strong> ${studentData.year}</li>
            <li><strong>Branch:</strong> ${studentData.branch}</li>
            <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/verify-students" 
             style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Review Student Verification
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Please review and approve/reject this student verification request.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Plan It Admin" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: 'New Student Verification Required - Plan It',
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendAdminNotification
};