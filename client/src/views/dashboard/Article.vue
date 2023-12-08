<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { AdminStore } from '../../stores/UserStore'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '../../components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()

const message = inject("message") // const message = useMessage() // 实例化
const dialog = inject("dialog")
const axios = inject("axios") // 注入 axios

const adminStore = AdminStore() // 实例化

const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: ""
})

const blogListInfo = ref([]) // 文章列表
const categoryOptions = ref([]) // 分类列表

// 分页 列表个数
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0
})

onMounted(() => {
    loadBlogs()
    loadCategorys()
})
// 显示文章列表
const loadBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    let temp_rows = res.data.data.rows
    for (let row of temp_rows) {
        row.content += "..."
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogListInfo.value = temp_rows

    pageInfo.count = res.data.data.count // 列表总条数
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0) // 总页数

    console.log(res)
}
// 显示分类列表
const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categoryOptions.value)
}

const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        addArticle.categoryId = 0
        addArticle.title = ""
        addArticle.content = ""
    } else {
        message.error(res.data.msg)
    }
}

const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}
</script>

<template>
    <n-tabs default-value="list" justify-content="start" type="line">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px;">
                <n-card :title="blog.title">
                    {{ blog.content }}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button>修改</n-button>
                            <n-button>删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <n-space>
                <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
                    <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">
                        {{ pageNum }}
                    </div>
                </div>
            </n-space>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
            <n-form :model="addArticle">
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <RichTextEditor v-model="addArticle.content" />
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="xx" tab="xx">
            xx
        </n-tab-pane>
    </n-tabs>
</template>

<style lang="scss" scoped>
.tabPane {
    position: relative;
}
</style>