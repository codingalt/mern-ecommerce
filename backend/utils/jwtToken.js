// create token and save in session storage

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    
    // Save token in session storage
    localStorage.setItem("token", token);
  
    res.status(statusCode).json({
      success: true,
      user,
      token
    });
  };
  
  module.exports = sendToken;


// // create token and save in cookie

// const sendToken = (user, statusCode, res)=>{
//     const token = user.getJWTToken();
//     // options for cookie
//     const options = {
//         expires: new Date(
//             Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
//         ),
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//         // domain: "https://mern-ecommerce-2wa7.onrender.com"
//     }
//     res.status(statusCode).cookie("token", token, options).json({
//         success: true,
//         user, 
//         token
//     })
// }

// module.exports = sendToken;