<template>
<!-- 人员库拆过来的页面 -->
    <div id="upload-excel">
        <el-upload  ref="upload"
                    accept=".xls,.xlsx"
                    :action="uploadUrl"
                    :limit="1"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :auto-upload="false">
            <el-button size="small" plain slot="trigger">选取文件</el-button>
            <el-button size="small" type="primary" @click="submitUpload" style="margin-left:10px">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xls, .xlsx文件</div>
        </el-upload>
        <div v-if="showAbnormal" style="margin-left:50px;">
            <div>
                共{{len}}条数据异常,异常电话号码如下
            </div>
            <div>
                <span v-for="(item, index) in abnormalArr" 
                        :key="index">{{item}}
                </span>
            </div>
        </div>
        <div class="buttons">
            <el-button @click="cancelSubmit" >关闭</el-button>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            // 异常数据的条数
            len: 0,
            // 控制是否展示异常数据
            showAbnormal: false,
            // 异常数据数组
            abnormalArr: [],
            uploadUrl: ''
        }
    },
    mounted() {
        if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'pred') {
            // 200和联通环境
            this.uploadUrl = 'https://dgateway.allhome.com.cn/hiddencallbase/platformBaseHiddenCall/business/groupNet/excelAdd'
        } else {
            // 线上环境
            this.uploadUrl = 'https://basehidden.allhome.com.cn/platformBaseHiddenCall/business/groupNet/excelAdd'
        }

    },
    methods: {
        /**1
         * 上传到服务器
         * @author 郭梦娜
         * @date 2019-1-17
         */
        submitUpload() {
            this.$refs.upload.submit();
        },
        /**1
         * 上传成功
         * @author 郭梦娜
         * @date 2019-1-15
         */
        onSuccess(response, file, files) {
            if(response.statusCode === "200") {
                this.$message({
                    message: response.message,
                    type: 'success'
                })
                this.$emit('close-dialog')
            } else if(response.statusCode === "404") {
                this.$message({
                    message: response.message,
                    type: "error"
                })
            } else {
                this.showAbnormal = true;
                let {result} = response;
                if(result!==null) {
                    this.len = result.length;
                    this.abnormalArr = [...result];
                }
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
            this.$store.dispatch('tanhe/queryTableData', {page:1, pageSize:30, value: ''})
        },
        /**1
         * 上传失败
         * @author 郭梦娜
         * @date 2019-1-15
         */
        onError(error, file, files) {
            this.$message({
                message: error.message,
                type: 'error'
            })
        },
        /**1
         * 取消
         * @author 郭梦娜
         * @date 2019-1-15
         * 
         */
        cancelSubmit() {
            this.$emit('close-dialog')
        }
        
    }
}
</script>
<style>
#upload-excel .buttons {
    margin-top:20px;
    margin-left: 100px;
}
#upload-excel .buttons .el-button{
    height: 30px;
    text-align: center;
    line-height: 7px;
}
.upload-demo {
    margin-left: 50px;
}
.upload-demo::after {
    clear: both;
    display: inline-block;
    zoom: 1;
    content: '';
    height:0;
}
</style>


