<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { AdminStore } from '../../stores/UserStore'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject("message") // const message = useMessage() // 实例化
const axios = inject("axios") // 注入 axios
const adminStore = AdminStore() // 实例化

const showAddModel = ref(false)
const categoryList = ref([])
const addCategory = reactive({
    name: ""
})

onMounted(() => {
    loadDatas()
})

// 获取分类列表
const loadDatas = async () => {
    let res = await axios.get("/category/list")
    categoryList.value = res.data.rows
}

// 添加分类
const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showAddModel.value = false
}
</script>

<template>
    <div>
        <n-button @click="showAddModel = true">添加</n-button>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>

        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>

        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="update">提交</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<style lang="scss" scoped></style>