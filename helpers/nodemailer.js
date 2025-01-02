import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


  
        

      const transporter=  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
               user:process.env.SMTP_MAIL,
               pass:process.env.SMTP_PASSWORD
            }
        }) 
        export const sendMail=async(email,subject,content)=>{
            try {
                const mailOptions = {
                    from:process.env.SMTP_MAIL,
                    to:email,
                    subject,
                    html:content
                }
                
                 
            transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent :- ", info.response)
            }

        })
            } catch (error) {
                console.log(error.message)
            }
        }

    



        
        
        
        
        
    
