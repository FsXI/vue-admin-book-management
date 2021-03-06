<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="{ prop: 'date', order: 'ascending' }"
    >
      <el-table-column prop="id" align="center" label="读者ID" width="95" sortable>
        <template slot-scope="scope">
          {{ scope.row.readerId }}
        </template>
      </el-table-column>
      <el-table-column prop="id" align="center" label="读者姓名" width="95">
        <template slot-scope="scope">
          {{ scope.row.reader.readerName }}
        </template>
      </el-table-column>
      <el-table-column label="纸质图书作者" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.bookAuthor }}
        </template>
      </el-table-column>
      <el-table-column label="纸质图书名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.bookName }}
        </template>
      </el-table-column>
      <el-table-column label="纸质图书库存" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookRepertory }}</span>
        </template>
      </el-table-column>
       <el-table-column label="纸质图书ISBN码" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookIsbn }}</span>
        </template>
      </el-table-column>
       <el-table-column label="纸质图书简介" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookIntro }}</span>
        </template>
      </el-table-column>
       <el-table-column label="纸质图书出版社" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookPress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" width="110" align="center">
         <template slot-scope="scope">
          <el-tag :type="scope.row.state| statusFilter">{{scope.row.state | formatStata}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="图书类别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category.categoryName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="纸质图书图片" width="150" align="center" >
        <template slot-scope="scope">
          <el-image :src="scope.row.bookPicture">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            width="200"
            icon="search"
            class="search-input"
            placeholder="输入纸质图书名称搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="putAway(scope.row)" :disabled="scope.row.state == 0 ? false : true" >
            允许上架
          </el-button>
          <el-button size="mini" type="danger" @click="refuse(scope.row)" :disabled="scope.row.state == 0 ? false : true" >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="page"
    />
  </div>
</template>

<script>
import {
  getList,
  getListPage,
  getReaderLikeNameList,
  putAway,
  refuse
} from '@/api/appleBook'

export default {
  data () {
    return {
      search: '', // 搜索
      pageSize: 7,
      total: 0,
      list: [],
      listLoading: true,
      imageUrl: '',
      category: '',
      appleBook: {},
    }
  },
  watch: {
    search: function (val, oldVal) {
      console.log('正在输入的姓名：' + val)
      console.log('已经输入过的姓名：' + oldVal)

      if (val.length != 0) {
        getReaderLikeNameList(val).then(response => {
          console.log('%c [ response ]', 'font-size:13px; background:pink; color:#bf2c9f;', response)
          this.list = response.appleBookList.filter(item => ~item.bookName.indexOf(val))
        })
      } else {
        this.fetchData()
      }
    },
  },
     filters: {
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        1: 'info',
        2: 'danger',
        0: 'success',
      }
      return statusMap[status]
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        1: '审核通过',
        2: '审核失败',
        0: '待审核'
      }
      return statusMap[status]
    }
  },

  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      getList().then(response => {
        console.log(response)
        this.list = response.pageInfo.list
        this.pageSize = response.pageInfo.list.length
        this.total = response.pageInfo.total
        this.listLoading = false
      })
    },
    refuse (row) {
      this.appleBook.bookId = row.bookId
      this.appleBook.bookAuthor = row.bookAuthor
      this.appleBook.bookIntro = row.bookIntro
      this.appleBook.bookIsbn = row.bookIsbn
      this.appleBook.bookName = row.bookName
      this.appleBook.bookPicture = row.bookPicture
      this.appleBook.bookPress = row.bookPress
      this.appleBook.bookRepertory = row.bookRepertory
      this.appleBook.categoryId = row.categoryId
      this.appleBook.readerId = row.readerId
      this.appleBook.state = row.state
      refuse(this.appleBook).then(response => {
        console.log('%c [ this.appleBook ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.appleBook)
            if (response.result != 0) {
              this.$message(
                '名称为：' + response.appleBook.bookName + '的纸质图书拒绝上架'
              )
            } else {
              this.$message('出错啦')
            }
      })
    },
    putAway (row) {
      console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      this.appleBook.bookId = row.bookId
      this.appleBook.bookAuthor = row.bookAuthor
      this.appleBook.bookIntro = row.bookIntro
      this.appleBook.bookIsbn = row.bookIsbn
      this.appleBook.bookName = row.bookName
      this.appleBook.bookPicture = row.bookPicture
      this.appleBook.bookPress = row.bookPress
      this.appleBook.bookRepertory = row.bookRepertory
      this.appleBook.categoryId = row.categoryId
      this.appleBook.readerId = row.readerId
      this.appleBook.state = row.state
      putAway(this.appleBook).then(response => {
            if (response.result != 0) {
              this.$message(
                '名称为：' + response.appleBook.bookName + '的纸质图书上架成功'
              )
            } else {
              this.$message('出错啦')
            }
          })
    },
    page (currentPage) {
      this.listLoading = true
      getListPage(currentPage).then(response => {
        console.log(process.env.VUE_APP_BASE_API)
        console.log(response)
        console.log(currentPage + '========')
        this.list = response.pageInfo.list
        // this.pageSize = response.pageInfo.list.length;
        this.total = response.pageInfo.total
        this.listLoading = false
      })
    },
  },
}
</script>
