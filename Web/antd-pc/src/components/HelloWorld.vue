<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div>
    <a-table :columns="columns" :data-source="tableData" bordered :pagination="false">

      <!-- 操作 -->
      <template slot="edit" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span>
            <!-- <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a> -->
            <a :disabled="editingKey !== ''" @click="edit(index)">编辑</a>
          </span>
        </div>
      </template>

    </a-table>

    <!-- 编辑浮层 -->
    <a-modal v-model="visible" title="编辑" @ok="handleOk" @cancel="handCancel">

      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">

        <a-form-item label="字段名称" :required="currentEditArr[0].isMust == '是' ? true : false">
          <a-input @change="changeInputName" :value="currentEditArr[0].name" />
        </a-form-item>

        <a-form-item label="字段类型" :required="currentEditArr[0].isMust == '是' ? true : false">
          <a-select @change="handleSelectChange" :value="currentEditArr[0].type">
            <a-select-option value="单行文本">
              单行文本
            </a-select-option>
            <a-select-option value="日期">
              日期
            </a-select-option>
            <a-select-option value="单选下拉">
              单选下拉
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="是否必填" :required="currentEditArr[0].isMust == '是' ? true : false">
          <a-switch :checked="currentEditArr[0].isMust == '是' ? true : false" @change="changeIsMast" />
        </a-form-item>

        <a-form-item v-if="currentEditArr[0].type != '单行文本'" label="字段选项"
          :required="currentEditArr[0].isMust == '是' ? true : false">
          <a-radio-group v-if="currentEditArr[0].type == '日期'" v-model="chooseIndex" @change="changeChoose">
            <a-radio v-for="(item, index) in dataChoose" :key="index" :style="radioStyle" :value="index">
              {{ item }}
            </a-radio>
          </a-radio-group>
          <a-input v-if="currentEditArr[0].type == '单选下拉'" @change="changeOptionChoose"
            :value="chooseOption.join('、')" />
        </a-form-item>


      </a-form>

    </a-modal>

  </div>
</template>
<script>
const columns = [
  {
    title: '字段名称',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '字段类型',
    dataIndex: 'type',
    width: '15%',
    scopedSlots: { customRender: 'type' },
  },
  {
    title: '是否必填',
    dataIndex: 'isMust',
    width: '25%',
    scopedSlots: { customRender: 'isMust' },
  },
  {
    title: '字段选项',
    dataIndex: 'choose',
    width: '25%',
    scopedSlots: { customRender: 'choose' },
  },
  {
    title: '操作',
    dataIndex: 'edit',
    scopedSlots: { customRender: 'edit' },
  },
];
export default {
  data() {
    return {
      tableData: [{
        key: 0,
        name: '字段一',
        type: '单行文本',
        isMust: '是',
        choose: '无'
      }, {
        key: 1,
        name: '字段二',
        type: '日期',
        isMust: '否',
        choose: '年 - 月 - 日'
      }, {
        key: 2,
        name: '字段三',
        type: '单选下拉',
        isMust: '否',
        choose: '选项一、选项二'
      }],
      columns,
      editingKey: '',
      visible: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      currentEditIndex: 1,  //当前编辑的选项的下标
      currentEditArr: [],  //当前编辑的数组
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      dataChoose: ['年 - 月', '年 - 月 - 日', '年 - 月 - 日 时 - 分'],
      chooseOption: ['选项一', '选项二'],
      chooseIndex: 0,
    };
  },
  beforeMount() {
    this.currentEditArr.push(JSON.parse(JSON.stringify(this.tableData[0])))
  },
  mounted() {

  },
  methods: {
    edit(index) {
      this.currentEditArr = [];

      this.currentEditIndex = index
      this.currentEditArr.push(JSON.parse(JSON.stringify(this.tableData[index])))
      this.visible = true

      if (this.currentEditArr[0].type == '日期') {
        if (this.dataChoose.indexOf(this.currentEditArr[0].choose) == -1) {
          this.chooseIndex = 0
          this.currentEditArr[0].choose = this.dataChoose[this.chooseIndex]
        } else {
          this.chooseIndex = this.dataChoose.indexOf(this.currentEditArr[0].choose)
        }
      }
    },
    // 浮层-点击ok
    handleOk(e) {
      console.log(e);
      if (this.currentEditArr[0].isMust == '是') {
        if (this.currentEditArr[0].name == '') return alert('请输入字段名称')
        if (this.currentEditArr[0].type == '单选下拉' && this.currentEditArr[0].choose == '') return alert('请输入字段选项')
      }

      this.tableData[this.currentEditIndex].name = this.currentEditArr[0].name
      this.tableData[this.currentEditIndex].type = this.currentEditArr[0].type
      this.tableData[this.currentEditIndex].isMust = this.currentEditArr[0].isMust
      this.tableData[this.currentEditIndex].choose = this.currentEditArr[0].choose

      this.visible = false;

    },
    // 浮层-点击取消或×或遮罩层
    handCancel() {
      this.visible = false;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    // 修改字段名称
    changeInputName(value) {
      this.currentEditArr[0].name = value.target.value
    },
    // 修改字段类型
    handleSelectChange(value) {
      this.currentEditArr[0].type = value
      if (this.currentEditArr[0].type == '日期') {
        if (this.dataChoose.indexOf(this.currentEditArr[0].choose) == -1) {
          this.chooseIndex = 0
          this.currentEditArr[0].choose = this.dataChoose[this.chooseIndex]
        } else {
          this.chooseIndex = this.dataChoose.indexOf(this.currentEditArr[0].choose)
        }
      } else if (this.currentEditArr[0].type == '单选下拉') {
        this.currentEditArr[0].choose = this.chooseOption.join('、')
      } else {
        this.currentEditArr[0].choose = '无'
      }
    },
    // 修改是否必填
    changeIsMast(checked) {
      if (checked) {
        this.currentEditArr[0].isMust = '是'
      } else {
        this.currentEditArr[0].isMust = '否'
      }
    },
    // 修改字段选项
    changeChoose(e) {
      this.currentEditArr[0].choose = this.dataChoose[e.target.value]
    },
    // 修改 单选下拉 的字段选项
    changeOptionChoose(value) {
      this.chooseOption = value.target.value.split('、')
      this.currentEditArr[0].choose = value.target.value
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
