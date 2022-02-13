// make sure to install dotenv - jsonwebtoken
const jwt = require("jsonwebtoken");
const db = require("./dbConnection.js");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

const jwtConfiged = {
  createAccessToken: function (userInfo = {}) {
    return new Promise(async (resolve, reject) => {
      delete userInfo.exp;
      delete userInfo.iat;
      userInfo.email = userInfo.email.toLowerCase();
      var isUserAvailable = await jwtConfiged.checkIfUserIsAvailable(userInfo);
      if (isUserAvailable == false) return resolve(isUserAvailable);
      var access_token = jwt.sign(
        { ...isUserAvailable },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      resolve(access_token);
    });
  },
  createRefreshToken: function (userInfo = {}) {
    return new Promise(async (resolve, reject) => {
      delete userInfo.exp;
      delete userInfo.iat;
      var isUserAvailable = await jwtConfiged.checkIfUserIsAvailable(userInfo);
      if (isUserAvailable == false) return resolve(false);
      userInfo = isUserAvailable;
      var refresh_token = jwt.sign(
        { ...userInfo },
        REFRESH_TOKEN_SECRET
      );
      var sql = `DELETE FROM refresh_tokens WHERE user_id='${_escpe(userInfo.user_id)}'`;
      PromisifiedQuery(sql).then(() => {
        var sql1 = `INSERT IGNORE INTO refresh_tokens(user_id,refresh_token) VALUES ('${_escpe(userInfo.user_id)}','${_escpe(refresh_token)}')`;
        PromisifiedQuery(sql1).then((refresh_tokens) => {
          if (refresh_tokens.affectedRows == 0) {
            return resolve(false);
          }
          resolve(refresh_token);
        });
      });
    });
  },
  refreshAccessToken: function (refresh_token = "") {
    return new Promise((resolve, reject) => {
      jwtConfiged.checkRefreshTokenAvailability(refresh_token).then(isAvailable => {
        if (isAvailable == false) {
          return resolve({ access_token: false, user: false })
        }
        jwt.verify(
          refresh_token,
          REFRESH_TOKEN_SECRET,
          (err, user) => {
            if (err) return resolve(false);
            var access_token = jwt.sign(
              { ...user },
              ACCESS_TOKEN_SECRET
            );
            resolve({ access_token, user });
          }
        );
      });
    });
  },
  checkRefreshTokenAvailability: function (refresh_token = "") {
    return new Promise((resolve, reject) => {
      var sql = `SELECT * FROM refresh_tokens WHERE isActive='true' AND refresh_token='${_escpe(refresh_token)}'`;
      PromisifiedQuery(sql).then((refresh_tokens) => {
        if (refresh_tokens.length == 0) {
          return resolve(false);
        }
        resolve(true);
      });
    });
  },
  checkAuth: function (req, res, next) {
    const refresh_token =
      req.headers["authorization"]?.split(" ")?.[2] ||
      req?.cookies?.refresh_token ||
      "null";
    const access_token =
      req.headers["authorization"]?.split(" ")?.[1] ||
      req?.cookies?.access_token ||
      "null";
    var useRefreshTokenInstead = function (req, res, next) {
      const refresh_token =
        req.headers["authorization"]?.split(" ")?.[2] ||
        req?.cookies?.refresh_token ||
        "null";
      jwtConfiged
        .refreshAccessToken(refresh_token)
        .then((refreshData) => {
          if (refreshData.access_token == false) {
            return res.sendStatus(401);
          }
          jwtConfiged
            .checkIfUserIsAvailable(refreshData.user)
            .then((isUserAvailable) => {
              if (isUserAvailable == false) return res.sendStatus(401);
              user = isUserAvailable;
              jwtConfiged.createAccessToken(user).then((newAccessToken) => {
                req.user = user;
                req.refresh_token = refresh_token;
                if (newAccessToken != false) {
                  req.access_token = newAccessToken;
                }
                next();
              });
            }
            );
        });
    };
    if (access_token == "null" && refresh_token == "null") return res.sendStatus(401);
    jwt.verify(
      access_token,
      ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          if (refresh_token == "null") {
            return res.sendStatus(401);
          } else {
            return useRefreshTokenInstead(req, res, next);
          }
        }
        user.email = user.email.toLowerCase();
        jwtConfiged.checkIfUserIsAvailable(user).then((isUserAvailable) => {
          if (isUserAvailable == false) return res.sendStatus(401);
          req.user = isUserAvailable;
          jwtConfiged
            .createAccessToken(isUserAvailable)
            .then((newAccessToken) => {
              req.refresh_token = refresh_token;
              if (newAccessToken != false) {
                req.access_token = newAccessToken;
              }
              next();
            });
        });
      }
    );
  },
  checkIfUserIsAvailable: function (user = {}) {
    return new Promise((resolve, reject) => {
      var sql = `SELECT * FROM users WHERE (email='${_escpe(user.email)}' OR user_id='${_escpe(user.user_id)}') AND password='${_escpe(user.password)}'`;
      PromisifiedQuery(sql).then((users) => {
        if (users.length == 0) return resolve(false);
        var finalUser = users[0];
        delete finalUser.id;
        resolve(finalUser);
      });
    });
  },
};
function PromisifiedQuery(sql, pst) {
  return new Promise((resolve, reject) => {
    if (pst == undefined) {
      db.query(sql, (err, result) => {
        if (err) {
          console.log("error PromisifiedQuery : " + err + " " + sql);
          console.log(err);
        }
        resolve(result);
      });
    } else {
      db.query(sql, pst, (err, result) => {
        if (err) {
          console.log("error PromisifiedQuery : " + err + " " + sql);
          console.log(err);
        }
        resolve(result);
      });
    }
  });
}

function _escpe(val) {
  if (val == undefined && val != null) {
    val = "";
  }
  if (typeof val != "string") {
    return val;
  }
  val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
    switch (s) {
      case "\0":
        return "\\0";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\b":
        return "\\b";
      case "\t":
        return "\\t";
      case "\x1a":
        return "\\Z";
      case "'":
        return "''";
      case '"':
        return '""';
      default:
        return "\\" + s;
    }
  });
  return val;
}
module.exports = jwtConfiged;
