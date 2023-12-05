/**
 * npm install multer multer 是一个 Node.js 中间件，用于处理 multipart/form-data 类型的表单数据，主要用于文件上传
 * npm install sqlite3
 * npm install uuid 
 */

const express = require("express")
const multer = require("multer")
const path = require("path")
const { db } = require("./db/DbUtils")
const app = express()
const port = 8080

//开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*")
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*")
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
    if (req.method == "OPTIONS") res.sendStatus(200) //让options尝试请求快速结束
    else next()
})

app.use(express.json())
const update = multer({
    dest: "./public/upload/temp"
})
app.use(update.any())
// 指定静态资源路径
app.use(express.static(path.join(__dirname, "public")))

// 每个接口调用前验证 token 信息，当访问路径中含有 /_token 时，就会验证用户 token 信息
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        // ===== token 验证部分 =====
        let { token } = req.headers
        console.log(token)

        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql, [token])
        if (adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return
        } else {
            next()
        }
    } else {
        next()
    }
})

app.use("/test", require("./routers/TestRouter"))
app.use("/admin", require("./routers/AdminRouter"))
app.use("/category", require("./routers/categoryRouter"))
app.use("/blog", require("./routers/BlogRouter"))
app.use("/upload", require("./routers/UploadRouter"))

app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`启动成功：http://localhost:${port}`)
})