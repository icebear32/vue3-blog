const express = require("express")
const router = express.Router()
const { db, genid } = require("../db/DbUtils")

// 列表接口
router.get("/list", async (req, res) => {
    const search_sql = "SELECT * FROM `category`"

    let { err, rows } = await db.async.all(search_sql, [])

    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }
})

// 删除接口 /category/delete?id=xxx
router.delete("/delete", async (req, res) => {
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
    }

    let id = req.query.id
    let delete_sql = "DELETE FROM `category` WHERE `id` = ?"
    let { err, rows } = await db.async.run(delete_sql, [id])

    if (err == null) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
})

// 修改接口
router.put("/update", async (req, res) => {
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
    }

    // ===== 修改部分 =====
    let { id, name } = req.body
    let update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?"
    let { err, rows } = await db.async.run(update_sql, [name, id])

    if (err == null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }
})

// 添加接口
router.post("/add", async (req, res) => {
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
    }

    let { name } = req.body
    let insert_sql = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)"
    let { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name])

    if (err == null) {
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
})

module.exports = router