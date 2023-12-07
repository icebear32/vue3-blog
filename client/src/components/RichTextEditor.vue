<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { ref, inject, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef，重要
const editorRef = shallowRef()

// 设置工具栏
const toolbarConfig = { 
    excludeKeys: ["uploadVideo"] // 去除上传视频功能
}
const editorConfig = { placeholder: '请输入内容...' }

// 上传图片的服务器地址配置
const server_url = inject("server_url")
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024, // 小于该值就插入 base64 格式（而不上传），默认为 0 
    server: server_url + '/upload/rich_editor_upload'
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if (src.indexOf("http" !== 0)) {
            return `${server_url}${src}`
        }
        return src
    }
}

const mode = ref("default")
const valueHtml = ref("")

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["update:model-value"])

// 组件销毁时，及时销毁编辑器，重要
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return

    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('createed', editor)
    editorRef.value = editor // 记录 editor 实例，重要
}

const handleChange = (editor) => {
    // console.log('change', editor.getHtml())
    emit("update:model-value", valueHtml.value)
}
</script>

<template>
    <div>
        <Toolbar :editor="editorRef" :default-config="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc;" />
        <Editor :default-config="editorConfig" :mode="mode" v-model="valueHtml" style="height: 280px; overflow-y: hidden;"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<style lang="scss" scoped></style>