import * as Constants from "../../common/constants";
import getApi from "../../api/api";
const {
    getDataListPage,
    getDataTotal,
    editData,
    Deletes,
} = getApi(Constants.XINZENG);
export default {
    data() {
        return {
            filters: {
                locationDesc:'',//按照内容检索数据（模糊查询）
            },
            editFormVisible: false,
            status: 0,
            data: [],
            total: 0, // 分页
            page: 1,
            listLoading: false,
            sels: [], //列表选中列
            editLoading: false,
            //编辑界面数据
            editForm: {},
            //  是否显示查看图片对话框
            showViewImage: false,
            //   图片数据
            viewImageData: [],
            editFormRules: {
                comments: [{
                    required: true,
                    message: "请输入新增审核内容",
                    trigger: "blur"
                }]
            },

        };
    },
    methods: {
        //对未审核数据执行审核处理(弹出编辑画面)
        handleEdit(index, row) {
            this.editForm = Object.assign({}, row);
            // 显示对话框
            this.editFormVisible = true;
        },
        // 显示照片弹出画面
        viewPhoto(index,date) {
            this.showViewImage = true;
            this.viewImageData = date;
        },
        //按钮状态显示转换
        transformButtonStatus(row, column) {
            return row.status == 1 ?
                "已审核" :
                row.status == 0 ?
                "未审核" :
                "未知";
        },
        //table中状态显示转换
        transformStatus(row, column) {
            return row.status == 1 ?
                "已审核" :
                row.status == 0 ?
                "未审核" :
                 "未知";
        },
        transformtType(row, column) {
            return row.type == 1 ? "峪口" : row.type == 2 ? "河流" : row.type == 3 ? "山峰" : row.type == 4 ? "寺庙" : row.type == 5 ? "景点" : row.type == 6 ? "酒店" : row.type == 7 ? "农家乐" : "未知";
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getDataList();
        },
        // 点击查询按钮刷新页面
        refreshData() {
            let para = {
                locationDesc:this.filters.locationDesc
            };
            this.listLoading = true;
            let self = this;
            getDataTotal(para)
                .then(res => {
                    this.total = res.data.data;
                    this.listLoading = false;
                    this.getDataList();
                })
                .catch(function (error) {
                    self.listLoading = false;
                    self.$message({
                        message: "请求出错",
                        type: "error"
                    });

                });
        },
        //分页功能
        getDataList() {
            let para = {
                skip: (this.page - 1) * 5,
                limit: 5,
                locationDesc:this.filters.locationDesc
            };
            this.listLoading = true;
            let self = this;
            getDataListPage(para)
                .then(res => {
                    this.data = res.data.data;
                    this.listLoading = false;
                })
                .catch(function (error) {
                    self.listLoading = false;
                    self.$message({
                        message: "请求出错",
                        type: "error"
                    });
                });
        },
        // 审核数据处理
        handleDataSubmit() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        let para = Object.assign({}, this.editForm);
                        para.status = '1'; //修改状态为已审核
                        this.editLoading = false;
                        editData(para).then(res => {
                            if (res.data.success) {
                                this.$message({
                                    message: "处理成功",
                                    type: "success"
                                });
                           
                            } else {
                                this.$message({
                                    message: "处理出错",
                                    type: "error"
                                });
                            }
                            this.$refs["editForm"].resetFields();
                            this.editFormVisible = false;
                            this.refreshData();
                        });
                    });
                }
            });
        },
        //批量删除
        handleDeletes() {
            let ids = this.sels.map(item => item.id).toString();
            this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                })
                 .then(() => {
                    this.listLoading = true;
                    let para = { ids: ids};
                    Deletes(para).then(res => {
                        this.listLoading = false;
                        if (res.data.success) {
                            this.$message({
                                message: "处理成功",
                                type: "success"
                            });
                        } else {
                            this.$message({
                                message: "删除出错",
                                type: "error"
                            });
                        }
                        this.refreshData();
                    });
                })
                .catch(error => {
                    console.info(error);
                });
        },
        // 实现批量按钮删除通过selection-change实现
        selsChange(sels) {
            this.sels   = sels;
        }
    },
     // 在vue的生命周期的mounted中调用渲染列表
    mounted() {
        this.refreshData();
    }
};