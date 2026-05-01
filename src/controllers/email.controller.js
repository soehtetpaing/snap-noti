const nodemailer = require("nodemailer");
const { app } = require("../configs/app.config");
const crypto = require("crypto");
const { AuthHandler, CommonHandler, DateTimeHandler } = require("genius-utils");

const APP_VERSION = process.env.VERSION || app.version;
const secretKey = process.env.SECRET_KEY || app.secretKey;

exports.receiveMessage = async (req, res) => {
    const requestBody = emailRequest(req.body);
    const {name, email, subject, message, projectcode} = requestBody;

    try {
        if (!email || !message) {
            return res.status(500).json({
                status: 500,
                message: "Email and message are required!",
                metadata: generateMetadata()
            });
        }

        const owner = getOwnerCredencial(projectcode);
        const password = getPasswordCredencial(projectcode);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: owner,
                pass: password
            }
        });

        await transporter.sendMail({
            from: `"Snap Noti" <${email}>`,
            to: owner,
            subject: subject || "New Contact Message",
            text: message + "\n\n" + name + "\n" + email, 
            replyTo: email
        });

        // prepare autoreply message
        const reply = prepareAutoReply(name, projectcode);

        await autoreply(transporter, owner, email, subject, reply);

        return res.status(200).json({
            status: 200,
            message: "Message sent successfully.",
            metadata: generateMetadata()
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
            metadata: generateMetadata()
        });
    }
}

exports.sendMessage = async (req, res) => {
    const requestBody = emailRequest(req.body);
    const {email, subject, message, projectcode} = requestBody;

    try {
        if (!email || !message) {
            return res.status(500).json({
                status: 500,
                message: "Email and message are required!",
                metadata: generateMetadata()
            });
        }

        const owner = getOwnerCredencial(projectcode);
        const password = getPasswordCredencial(projectcode);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: owner,
                pass: password
            }
        });

        await transporter.sendMail({
            from: `"Snap Noti" <${owner}>`,
            to: email,
            subject: subject || "New Contact Message",
            text: message
        });

        return res.status(200).json({
            status: 200,
            message: "Message sent successfully.",
            metadata: generateMetadata()
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
            metadata: generateMetadata()
        });
    }
}

exports.sendOTP = async (req, res) => {
    const requestBody = emailRequest(req.body);
    const {email, subject, projectcode} = requestBody;

    try {
        if (!email) {
            return res.status(500).json({
                status: 500,
                message: "Email is required!",
                metadata: generateMetadata()
            });
        }

        const owner = getOwnerCredencial(projectcode);
        const password = getPasswordCredencial(projectcode);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: owner,
                pass: password
            }
        });

        const otp = generateOTP();
        // const message = "To: " + email
        //             + "\n"
        //             + "Verification code: " + otp
        //             + "\n\n"
        //             + "This code expires in 10 minutes.";
        const expireAt = Date.now() + 10 * 60 * 1000;

        await transporter.sendMail({
            from: `"Snap Noti" <${owner}>`,
            to: email,
            subject: subject || "Your OTP Code",
            // text: message
            html: `
                <div style="font-family: Arial;">
                    To: ${email} <br>
                    Verification code: <br>
                    <h2>${otp}</h2>
                    <span style="font-size:14px;color:gray;">
                        This code expires in 10 minutes.
                    </span>
                </div>
            `
        });

        return res.status(200).json({
            status: 200,
            message: "OTP sent to email.",
            data: {
                otp,
                expireAt
            },
            metadata: generateMetadata()
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
            metadata: generateMetadata()
        });
    }
}

// metadata
function generateMetadata() {
    return {
        requestId: CommonHandler.getSyskey(),
        timestamp: DateTimeHandler.getMyanmarDateTime(),
        version: APP_VERSION
    }
}

// private function
async function autoreply(transporter, sender, receiver, subject, reply) {
    try {
        await transporter.sendMail({
            from: `"Snap Noti" <${sender}>`,
            to: receiver,
            subject: `Automatic reply: ${subject}`,
            text: reply
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

function emailRequest(param = {}) {
    return {
        name: param.name || "",
        email: param.email || "",
        subject: param.subject || "",
        message: param.message || "",
        projectcode: param.projectcode || ""
    };
}

function getOwnerCredencial(projectcode = "") {
    let encrypted = "";
    let owner = "";

    switch (projectcode) {
        case AuthHandler.decrypt("GJLv9QuPr9ye4mlGBqiTzuXDbRcNY2VS6mJalTwnRG8=", secretKey):
            encrypted = app.email || process.EMAIL;
            owner = AuthHandler.decrypt(encrypted, secretKey);
            break;
    
        default:
            encrypted = app.email || process.EMAIL;
            owner = AuthHandler.decrypt(encrypted, secretKey);
            break;
    }

    return owner;
}

function getPasswordCredencial(projectcode = "") {
    let encrypted = "";
    let password = "";

    switch (projectcode) {
        case AuthHandler.decrypt("GJLv9QuPr9ye4mlGBqiTzuXDbRcNY2VS6mJalTwnRG8=", secretKey):
            encrypted = app.apppassword || process.env.APP_PASSWORD;
            password = AuthHandler.decrypt(encrypted, secretKey);
            break;
    
        default:
            encrypted = app.apppassword || process.env.APP_PASSWORD;
            password = AuthHandler.decrypt(encrypted, secretKey);
            break;
    }

    return password;
}

function prepareAutoReply(name, projectcode) {
    const receiver = name || "there";
    let reply = "";

    switch (projectcode) {
        case AuthHandler.decrypt("GJLv9QuPr9ye4mlGBqiTzuXDbRcNY2VS6mJalTwnRG8=", secretKey):
            reply = "Hi " + name + ","
                + "\n"
                + "Thank you for your message. I received it and will reply soon."
                + "\n\n"
                + "— Soe Htet Paing";
            break;
    
        default:
            reply = "Hi " + name + ","
                + "\n"
                + "Thank you for your message. We received it and will reply soon."
                + "\n\n"
                + "— Snap Noti Team";
            break;
    }

    return reply;
}
