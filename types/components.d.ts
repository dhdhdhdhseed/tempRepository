// 弹窗组件
interface DialogConfigVue extends HTMLElement {
    visible: boolean
}

// 分页组件
interface PaginationVue extends HTMLElement {
    currentPage: number
    pageSize: number
    changePage: (page: number) => void
    refresh: () => void
    changeSize: (size: number) => void
}