import express from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Users from "../models/Users";
import UserRole from "../models/UserRole";

const authApi = express.Router();

// adminApiRouter.post("/register", async (request, response) => {
//   const data = request.body;
//   console.log(data);
//   // if (data) {
//   //   const oldUser = await User.findOne({ email: email });
//   //   if (oldUser) {
//   //     return response.status(400).json({
//   //       success: false,
//   //       message: " User allready created",
//   //     });
//   //   }

//   //   const hashedPassword = await bcrypt.hash(data.password, 10);

//   //   data.password = hashedPassword;

//   //   try {
//   //     const user = await User.create(data);
//   //     const result = await user.populate("userRole");
//   //     response.status(201).json({
//   //       message: " User successfully created",
//   //       data: result,
//   //     });
//   //   } catch (error) {
//   //     response.status(500).json({
//   //       success: false,
//   //       error: error,
//   //     });
//   //   }
//   // }
// });

// register endpoint
authApi.post("/register", async (req, res) => {
  const data = req.body;
  console.log(req.body);
  if (data) {
    const oldUser = await Users.findOne({ email: data.email });
    if (oldUser) {
      return res.status(400).json({
        success: false,
        status: "Хэрэглэгч аль хэдийн үүссэн байна. Нэвтэрч орно уу.",
      });
    }
    var hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    try {
      const user = await Users.create(data);
      console.log("user created");
      const result = await user.populate("userRole");
      console.log("user populated");

      res.status(201).json({
        message: "Хэрэглэгч амжилттай үүслээ",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error,
      });
    }

    // Users.create(data)
    //   .then((data) => {
    //     res.status(201).json({
    //       message: "Хэрэглэгч амжилттай үүслээ",
    //       data,
    //     });
    //     return;
    //   })
    //   .catch((error) => {
    //     res.status(500).json({
    //       success: false,
    //       error: error,
    //     });
    //   });
  } else {
    return res.json({
      error: "The input field is empty",
    });
  }
});

// authApi.post("/login", async (request, response) => {

//   try {
//     const { email, password } = request.body;

//     if (!(password && email)) {
//       return response.status(400).json({
//         message: "Утгуудыг бүрэн оруулна уу",
//       });
//     }
//     const user = await Users.findOne({ email: email });

//     if (user) {
//       const isMatch = await bcrypt.compare(password, user?.password);

//       if (user && isMatch) {
//         const jwtBody = { user_id: user._id, email: email };
//         const token = jwt.sign(jwtBody, "MySuperDuperPrivateKey", {
//           expiresIn: "24",
//         });
//         return response.status(200).json({
//           status: "Successfully Login",
//           success: true,
//           token: token,
//         });
//       }
//     } else {
//       return response.status(400).json({
//         success: false,
//         status: "Нууц үг нэр хоорондоо таарахгүй байна",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     response.status(500).json({
//       data: "aldaa garlaa",
//       error: error,
//     });
//   }
// });

authApi.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({
        success: false,
        status: "Утгуудаа бүрэн оруулна уу.",
        updated: 1,
        email: email,
        password: password,
      });
      return;
    }
    const user = await Users.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        "MySuperDuperPrivateKey",
        {
          expiresIn: "1m",
        }
      );
      res.status(200).json({
        success: true,
        status: "Амжилттай нэвтэрлээ.",
        data: user,
        token: token,
      });
      return;
    }
    res.status(400).json({
      success: false,
      status: "Нууц үг нэр хоорондоо таарахгүй байна.",
    });
    return;
  } catch (err) {
    console.log(err);
  }
});

authApi.post("/role/create", async (req, res) => {
  const { name } = req.body;

  const result = await UserRole.create({ name });

  res.status(200).json({
    data: result,
  });
});

authApi.get("/role/list", async (req, res) => {
  const result = await UserRole.find({});

  res.status(200).json({
    data: result,
  });
});

module.exports = authApi;
