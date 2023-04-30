const nodeMailer = require("nodemailer");

const sendEmailToUser = async(obj)=>{

    const transporter  = nodeMailer.createTransport({
        host: process.env.SMTP_HOST, // host of gmail
        port: process.env.SMTP_PORT, //port of gmail
        secure:true,
        service : process.env.SMTP_SERVICE,
        auth : {
            user: process.env.SMTP_MAIL, //main admin/owner ki mail jiski taraf se users ko mail bheji jayegi
            pass: process.env.SMTP_PASSWORD //isi upar wali original mail ka app password jo google account me security me jake obtain kiya hai, using org password doesnot work
        }
    });

    const mailOptions = {
        from : process.env.SMTP_MAIL, //upar wala original mail admin/owner, jiski taraf se mail bheja ja rha hai
        to : obj.email,               //user ka mail jisko hm ye mail bhej rhe hai
        subject : obj.subject,
        text : obj.message
    }

    await transporter.sendMail(mailOptions); //sending mail
}

module.exports = sendEmailToUser;