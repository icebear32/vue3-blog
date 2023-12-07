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

const categoryOptions = ref([])
onMounted(() => {
    loadCategorys()
})
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
</script>

<template>
    <n-tabs default-value="add" justify-content="start" type="line">
        <n-tab-pane name="Oasis" tab="Oasis">
            Oasis
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

<style lang="scss" scoped></style>