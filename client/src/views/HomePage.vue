<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Dashboard from './dashboard/Dashboard.vue';

const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const selectedCategory = ref(0)
const categoryOptions = ref([])

onMounted(() => {
    loadCategorys()
})

const categoryName = computed(() => {
    let selectOption = categoryOptions.value.find((options) => { return options.value == selectedCategory.value })
    return selectOption ? selectOption.label : ""
})

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

const homePage = () => {
    router.push("/")
}
const dashboard = () => {
    router.push("/login")
}
</script>

<template>
    <div class="container">
        <div class="nav">
            <div @click="HomePage">首页</div>
            <div>
                <n-popselect v-model:value="selectedCategory" :options="categoryOptions" trigger="click">
                    <div>分类<span>{{ " " + categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="dashboard">后台</div>
        </div>
        <n-divider></n-divider>
        <div class="footer">
            <div>xx</div>
            <div>xxxx</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.catainer {
    width: 1200px;
    margin: 0 auto;
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    margin-left: 100px;
    margin-right: 100px;
    color: #64676a;

    div {
        cursor: pointer;
        margin-right: 15px;

        &:hover {
            color: #f60;
        }

        span {
            font-size: 12px;
        }
    }
}

.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
</style>