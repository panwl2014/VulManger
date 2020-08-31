<template>
  <div class="vuladd" v-loading="loading">
    <con-title :name="titlename">
      <div class="button-box">
        <vul-button type="primary" size="small" class="button-pos" @click="addVulShow">添加漏洞</vul-button>
      </div>
    </con-title>
    <el-card class="mt-1 mr-1 pb-2">
      <!-- 标题 -->
      <div class="pb-2">
        <span class="risk-title">待加入漏洞列表</span>
        <span class="description">（请按需将漏洞加入漏洞库）</span>
        <div class="title mt-1"></div>
      </div>
      <!-- 按钮 -->
      <div class="pb-2">
        <vul-button @click="batchImportVul(false)" type="danger" size="medium" plain>批量加入漏洞库</vul-button>
        <vul-button @click="batchImportVul(true)" type="danger" size="medium">全部加入漏洞库</vul-button>
        <vul-button @click="batchAddWhite('more')" size="medium" plain>批量加入白名单</vul-button>
        <vul-button @click="batchAddWhite('all')" type="primary" size="medium">全部加入白名单</vul-button>
      </div>
      <div class="mt-7">
        <el-table
          @selection-change="select_change_data"
          :data="tableData2"
          :header-cell-style="tableHeaderColor"
          @filter-change="filterChange"
        >
          <!-- :filter-method="d.filters && filterHandler || null" -->
          <!-- <el-table-column type="selection" width="55px" align="center"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="d in tableTitle"
            :key="d.key"
            :prop="d.key"
            :label="d.label"
            :align="d.text_algin"
            :filters="d.filters || null"
            :column-key="d.filterArrName || null"
            show-overflow-tooltip
          >
            <!-- eslint-disable-next-line -->
            <template slot-scope="scope">
              <span
                v-text="filter.filter(d.filter)(scope.row[d.key])"
                v-if="typeof(d.filter) !== 'undefined'"
              ></span>
              <span v-text="scope.row[d.key]" v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" align="center" fixed="right">
            <!-- eslint-disable-next-line -->
            <template slot-scope="scope">
              <span class="button-text" @click="editVul(scope.row)">编辑</span>
              <span class="button-line">|</span>

              <span class="button-text" @click="addVul(scope.row)">加入漏洞库</span>
              <span class="button-line">|</span>

              <span class="button-text" @click="addWhite(scope.row, 'aa')">加入白名单</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pt-2 text-center">
          <el-pagination
            background
            @size-change="page_currentsize_change"
            @current-change="page_current_change"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="添加漏洞"
      :visible.sync="dialogVisible"
      width="50%"
      class="bigDia addVulStyle"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-tabs type="border-card" v-model="importType" @tab-click="importTypeChange">
        <el-tab-pane label="报告导入" name="baogao">
          <el-form :inline="true" :model="uploadForm" ref="uploadForm">
            <el-form-item
              prop="type"
              :rules="[{required: true, message: '请选择漏洞来源', trigger: 'blur'}]"
              label="漏洞来源"
            >
              <el-select v-model="uploadForm.type" placeholder="请选择漏洞来源">
                <el-option v-for="d in souceList" :key="d.value" :value="d.value" :label="d.label"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              prop="risktype"
              :rules="[{required: true, message: '请选择漏洞类型', trigger: 'blur'}]"
              label="漏洞类型">
                <el-select v-model="uploadForm.risktype" placeholder="请选择漏洞类型" style="margin-left: 10px;">
                  <el-option
                    v-for="d in risklist"
                    :key="d.value"
                    :value="d.value"
                    :label="d.label"
                  ></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://103.44.144.41:12120/upload/uploading"
                :data="uploadData"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
              >
                <vul-button style="margin-left: 10px;" size="medium" type="primary">选择文件导入</vul-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="模板导入" name="moban">
          <el-upload
            class="upload-demo"
            drag
            :show-file-list="false"
            accept=".xls, .xlsx"
            :before-upload="mobanBeforeUpload"
            :on-success="mobanUploadSuccess"
            action="http://103.44.144.41:12120/upload/uploading"
            :data="uploadData2"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">注意：上传文件格式只能为xls或xlsx格式</div>
          </el-upload>
          <el-col :span="4" :offset="20">
            <a href="/static/vul_template.xlsx">
              <i class="el-icon-download">下载模板</i>
            </a>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="手动添加" name="shoudong">
          <el-row :gutter="20">
            <el-form label-width="80px" :model="RiskAddForm" ref="RiskAddForm">
              <el-col :span="12">
                <el-form-item
                  prop="flawName"
                  :rules="[
                  {required: true, message: '请输入漏洞名称', trigger: 'blur'}
                ]"
                  label="漏洞名称"
                >
                  <el-input
                    :disabled="editModel"
                    v-model="RiskAddForm.flawName"
                    maxlength="50"
                    placeholder="请填写漏洞名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="flawIp"
                  :rules="[{required: true, message: '请输入关联的资产', trigger: 'blur'}]"
                  label="关联资产"
                >
                  <el-input
                    v-model="RiskAddForm.flawIp"
                    :disabled="editModel"
                    placeholder="请填写漏洞关联资产"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="flawType"
                  :rules="[{required: true, message: '请选择漏洞类型', trigger: 'blur'}]"
                  label="漏洞类型"
                  :disabled="editModel"
                >
                  <el-select v-model="RiskAddForm.flawType" placeholder="请选择漏洞类型">
                    <el-option label="主机漏洞" :value="0"></el-option>
                    <el-option label="应用漏洞" :value="1"></el-option>
                    <el-option label="基线漏洞" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="flawGrade"
                  :rules="[{required: true, message: '请选择漏洞等级', trigger: 'blur'}]"
                  label="漏洞等级"
                >
                  <el-select v-model="RiskAddForm.flawGrade" placeholder="请选择漏洞等级">
                    <el-option label="低危" :value="0"></el-option>
                    <el-option label="中危" :value="1"></el-option>
                    <el-option label="高危" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="漏洞分类"
                  v-if="RiskAddForm.flawType === 1
                || RiskAddForm.flawType === ''"
                >
                  <el-input
                    v-model="RiskAddForm.flawClassification"
                    placeholder="请填写漏洞分类"
                    maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="CVSS分值"
                  v-if="RiskAddForm.flawType === 0
                || RiskAddForm.flawType === 2
                || RiskAddForm.flawType === ''"
                >
                  <el-input
                    v-model="RiskAddForm.flawCvss"
                    :disabled="editModel"
                    placeholder="请填写漏洞CVSS分值"
                    maxlength="10"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="漏洞标识">
                  <el-input
                    v-model="RiskAddForm.flawIdentifying"
                    :disabled="editModel"
                    placeholder="请填写CVE或CNVD漏洞标识"
                    maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="相关端口"
                  v-if="RiskAddForm.flawType === 0
                || RiskAddForm.flawType === 2
                || RiskAddForm.flawType === ''"
                >
                  <el-input
                    v-model="RiskAddForm.flawUrl"
                    :disabled="editModel"
                    placeholder="请填写相关端口"
                    maxlength="10"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="漏洞细节">
                  <el-input
                    v-model="RiskAddForm.flawDetails"
                    type="textarea"
                    :disabled="editModel"
                    placeholder="请填写漏洞细节"
                    maxlength="250"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="漏洞描述">
                  <el-input
                    :disabled="editModel"
                    type="textarea"
                    v-model="RiskAddForm.flawDescription"
                    placeholder="请填写漏洞描述"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="修复建议">
                  <el-input
                    :disabled="editModel"
                    type="textarea"
                    v-model="RiskAddForm.flawSolution"
                    placeholder="请填写修复建议"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="importType === 'shoudong'|| importType === 'moban'"
      >
        <el-button type="primary" @click="addVulData">确 定</el-button>
        <el-button @click="handleCancle">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 资产编辑 -->
    <el-dialog
      title="漏洞信息"
      class="bigDia"
      :visible.sync="RiskdialogVisible"
      width="40%"
      :before-close="RiskhandleClose"
    >
      <span>
        <el-row>
          <el-form label-width="80px" :model="RiskAddForm" ref="RiskAddForm">
            <el-col :span="12">
              <el-form-item
                prop="flawName"
                :rules="[
              {required: true, message: '请输入漏洞名称', trigger: 'blur'}
            ]"
                label="漏洞名称"
              >
                <el-input
                  :disabled="editModel"
                  v-model="RiskAddForm.flawName"
                  maxlength="50"
                  placeholder="请填写漏洞名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="flawIp"
                :rules="[{required: true, message: '请输入关联的资产', trigger: 'blur'}]"
                label="关联资产"
              >
                <el-input
                  v-model="RiskAddForm.flawIp"
                  :disabled="editModel"
                  placeholder="请填写漏洞关联资产"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="flawType"
                :rules="[{required: true, message: '请选择漏洞类型', trigger: 'blur'}]"
                label="漏洞类型"
                :disabled="editModel"
              >
                <el-select v-model="RiskAddForm.flawType" placeholder="请选择漏洞类型">
                  <el-option label="主机漏洞" :value="0"></el-option>
                  <el-option label="应用漏洞" :value="1"></el-option>
                  <el-option label="基线漏洞" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="flawGrade"
                :rules="[{required: true, message: '请选择漏洞等级', trigger: 'blur'}]"
                label="漏洞等级"
              >
                <el-select v-model="RiskAddForm.flawGrade" placeholder="请选择漏洞等级">
                  <el-option label="低危" :value="0"></el-option>
                  <el-option label="中危" :value="1"></el-option>
                  <el-option label="高危" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="漏洞分类"
                v-if="RiskAddForm.flawType === 1
            || RiskAddForm.flawType === ''"
              >
                <el-input
                  v-model="RiskAddForm.flawClassification"
                  placeholder="请填写漏洞分类"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="CVSS分值"
                v-if="RiskAddForm.flawType === 0
            || RiskAddForm.flawType === 2
            || RiskAddForm.flawType === ''"
              >
                <el-input
                  v-model="RiskAddForm.flawCvss"
                  :disabled="editModel"
                  placeholder="请填写漏洞CVSS分值"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="漏洞标识">
                <el-input
                  v-model="RiskAddForm.flawIdentifying"
                  :disabled="editModel"
                  placeholder="请填写CVE或CNVD漏洞标识"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="相关端口"
                v-if="RiskAddForm.flawType === 0
            || RiskAddForm.flawType === 2
            || RiskAddForm.flawType === ''"
              >
                <el-input
                  v-model="RiskAddForm.flawUrl"
                  :disabled="editModel"
                  placeholder="请填写相关端口"
                  maxlength="10"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="漏洞细节"
                v-if="RiskAddForm.flawType === 0
            || RiskAddForm.flawType === 2
            || RiskAddForm.flawType === '漏洞细节'"
              >
                <el-input
                  v-model="RiskAddForm.flawDetails"
                  type="textarea"
                  :disabled="editModel"
                  placeholder="请填写漏洞细节"
                  maxlength="250"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="漏洞描述">
                <el-input
                  :disabled="editModel"
                  type="textarea"
                  v-model="RiskAddForm.flawDescription"
                  placeholder="请填写漏洞描述"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="修复建议">
                <el-input
                  :disabled="editModel"
                  type="textarea"
                  v-model="RiskAddForm.flawSolution"
                  placeholder="请填写修复建议"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editVulSubmit">修 改</el-button>
        <el-button @click="editVulCancle">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="whiteTitle + '加入白名单'"
      :visible.sync="whiteAddShow"
      width="30%"
      :before-close="whiteHandleClose"
    >
      <span>
        <el-form label-width="130px" :model="backup" ref="backup">
          <el-form-item>
            <span class="boxClass">将当前{{ whiteTitle }}漏洞加入到白名单</span>
          </el-form-item>
          <el-form-item class="boxClass" label="类型：">
            <el-radio-group v-model="addModel">
              <el-radio :label="0">例外库</el-radio>
              <el-radio :label="1">报备库</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            prop="reportTimeStr"
            :rules="[{required: true, message: '请输入报备结束时间', trigger: 'blur'}]"
            v-if="addModel === 1"
            class="boxClass"
            label="报备结束时间："
          >
            <el-date-picker
              v-model="backup.reportTimeStr"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择报备结束时间"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="BatchWhiteSub">确 认</el-button>
        <el-button @click="whiteAddShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ConTitle from "@/components/components/ConTitle";
import md5 from "js-md5";
export default {
  name: "VulAdd",
  components: {
    ConTitle,
  },
  created() {
    // 数据初始化
    for (let key in this.display.flawSouceList) {
      if (key !== "manual") {
        this.souceList.push(this.display.flawSouceList[key]);
      }
    }
  },
  data() {
    return {
      checkVulType: [],
      checkVulLv: [],
      titlename: "漏洞添加",
      filter: Vue,
      // 表格数据
      tableTitle: [
        { key: "flawName", label: "漏洞名称", text_algin: "center" },
        {
          key: "flawSource",
          label: "漏洞来源",
          text_algin: "center",
          filter: "RiskSrcFilter",
        },
        {
          key: "flawGrade",
          label: "漏洞等级",
          text_algin: "center",
          filter: "RiskStatusFilter",
          filters: [
            { text: "高危", value: 2 },
            { text: "中危", value: 1 },
            { text: "低危", value: 0 },
          ],
          filterArrName: "lv",
        },
        {
          key: "flawType",
          label: "漏洞类型",
          text_algin: "center",
          filter: "RiskTypeFilter",
          filters: [
            { text: "主机漏洞", value: 0 },
            { text: "应用漏洞", value: 1 },
            { text: "基线漏洞", value: 2 },
          ],
          filterArrName: "type",
        },
        {
          key: "flawIp",
          label: "资产名称",
          text_algin: "center",
          width: "150",
        },
        { key: "importStatus", label: "导入状态", text_algin: "center" },
      ],
      tableData: [],
      pageTotal: 0,
      tableCurPage: 1,
      tableCurPageSize: 10,
      SelectRowList: [],
      // 弹窗数据
      importType: "baogao",
      dialogVisible: false,
      uploadData: {
        keys: ["66244932-3a61-48c5-b847-9a750ba6567e"],
        task_id: "",
        timestamp: new Date().getTime(),
      },
      uploadData2: {
        keys: ["66244932-3a61-48c5-b847-9a750ba6567e"],
        task_id: "",
        timestamp: new Date().getTime(),
      },
      uploadForm: {
        type: "",
        task_id: "",
        filetype: "",
        risktype: "",
      },
      fileList: [],
      tableData2: [],
      filterTableData: [],
      souceList: [],
      risklist: {
        nsfocus: 0,
        nusass: 0,
        tianjin: 1,
        moan: 1,
        nsfocus_web: 1,
      },
      // risklist: [{label: '主机漏洞', value: 0}, {label: '应用漏洞', value: 1}, {label: '基线漏洞', value: 2}],
      // 资产编辑
      RiskAddForm: {
        flawName: "", // 漏洞名称
        flawIp: "", // 资产名称
        flawGrade: "", // 漏洞等级
        flawDetails: "", // 漏洞详情
        flawDescription: "", // 漏洞描述
        flawType: "", // 漏洞类型
        flawSolution: "", // 解决方案
        flawIdentifying: "", // 漏洞标识
        flawCvss: "", // CVSS分值
        flawHazard: "", // 漏洞影响
        flawClassification: "", // 漏洞分类
        flawUrl: "", // 相关端口
        flawSource: "", // 漏洞来源
        deptName: null, // 归属部门
      },
      loading: false,
      whiteMode: "aa",
      backup: {
        reportTimeStr: null,
      },
      RiskSubForm: {},
      RiskdialogVisible: false,
      editModel: true,
      addModel: 0,
      whiteAddShow: false,
      whiteTitle: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  methods: {
    filterHandler(value, row, column) {
      console.log("value", value, "row", row, "column", column);
      const property = column["property"];
      return row[property] === value;
    },
    filterChange(e) {
      // h 10 m 32 l379
      if (e.lv) {
        this.checkVulLv = e.lv;
        this.filterTableData = this.tableData.filter((item) => {
          return (
            item.flawGrade == this.checkVulLv[0] ||
            item.flawGrade == this.checkVulLv[1] ||
            item.flawGrade == this.checkVulLv[2]
          );
        });
      } else {
        this.checkVulType = e.type;
        this.filterTableData = this.tableData.filter((item) => {
          return (
            item.flawType == this.checkVulType[0] ||
            item.flawType == this.checkVulType[1] ||
            item.flawType == this.checkVulType[2]
          );
        });
      }
      if (this.checkVulType.length != 0 && this.checkVulLv.length != 0) {
        this.filterTableData = this.tableData.filter((item) => {
          let isHas =
            (!!(
              item.flawGrade == this.checkVulLv[0] ||
              item.flawGrade == this.checkVulLv[1] ||
              item.flawGrade == this.checkVulLv[2]
            ) &&
              item.flawType == this.checkVulType[0]) ||
            item.flawType == this.checkVulType[1] ||
            item.flawType == this.checkVulType[2];
          return isHas;
        });
      }
      this.pageTotal = this.filterTableData.length;
      this.tableData2 = this.filterTableData.slice(0, 10);
      console.log(this.filterTableData);
      console.log("type", this.checkVulType, "lv", this.checkVulLv);
    },
    // 表格数据
    tableHeaderColor() {
      return "background-color: #F5F5F5";
    },
    addVulData() {
      this.$refs["RiskAddForm"].validate((valid) => {
        if (valid) {
          const url = "/flaw/addFlaw";
          this.RiskAddForm.flawSource = "manual";
          this.axios
            .post(url, this.qs.stringify(this.RiskAddForm))
            .then((Response) => {
              const d = Response.data;
              if (d.code === 200) {
                this.message_box(d.msg);
                this.RiskCancle();
              } else {
                this.$message.error(d.msg);
              }
            });
        }
      });
    },
    editVul(row) {
      this.editModel = true;
      this.RiskAddForm = { ...row };
      this.RiskdialogVisible = true;
    },
    editVulSubmit() {
      let temp = [...this.tableData];

      temp.map(function (d, i, a) {
        if (d.aid === this.RiskAddForm.aid) {
          temp[i] = { ...this.RiskAddForm };
        }
      }, this);
      this.tableData = [];
      this.tableData = [...temp];
      this.message_box("修改成功");
      this.RiskCancle();
    },
    RiskCancle() {
      this.addModel = 0;
      this.RiskSubForm = {};
      this.whiteAddShow = false;
      this.dialogVisible = false;
      this.RiskdialogVisible = false;
      this.RiskAddForm = {
        flawName: "", // 漏洞名称
        flawIp: "", // 资产名称
        flawGrade: "", // 漏洞等级
        flawDetails: "", // 漏洞细节
        flawDescription: "", // 漏洞描述
        flawType: "", // 漏洞类型
        flawSolution: "", // 解决方案
        flawIdentifying: "", // 漏洞标识
        flawCvss: "", // CVSS分值
        flawHazard: "", // 漏洞影响
        flawClassification: "", // 漏洞分类
        flawUrl: "", // 相关端口
        flawSource: "", // 漏洞来源
        deptName: null, // 归属部门
        reportTime: null,
      };
      this.$refs["RiskAddForm"].resetFields();
      this.$refs["backup"].resetFields();
    },
    RiskhandleClose(done) {
      done();
      this.RiskCancle();
    },
    updateTable(aid) {
      console.log(aid);
      let temp = [...this.tableData];
      for (let key in temp) {
        if (aid === temp[key].aid) {
          this.tableData.splice(key, 1);
          break;
        }
      }
      this.pageTotal = this.filterTableData.length;
    },
    addVul(row, mode) {
      this.whiteMode = mode;
      this.$confirm("是否将该漏洞加入到漏洞库中？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = { ...row };
        data.deptName = "";
        delete data.importStatus;
        delete data.flawProtocol;
        delete data.flawService;
        this.addVulSub(data);
      });
    },
    batchImportVul(mode) {
      this.whiteMode = mode;
      let title = "全部";
      if (mode === false) {
        title = "所选";
        if (this.SelectRowList.length === 0) {
          this.$message.error("请选择要操作的漏洞信息");
          return;
        }
      } else {
        if (this.tableData.length === 0) {
          this.$message.error("没有可以操作的漏洞信息");
          return;
        }
      }
      this.$confirm("是否将当前" + title + "漏洞加入漏洞库？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        let url = "/flaw/addFlaw";
        let backup = [...this.tableData];
        if (mode === false) {
          backup = [...this.SelectRowList];
        }
        let success = 0;
        let error = 0;
        for (let i in backup) {
          this.axios
            .post(url, this.qs.stringify(backup[i]))
            .then((Response) => {
              const d = Response.data;
              if (d.code === 200) {
                success += 1;
                this.updateTable(backup[i].aid);
              } else {
                error += 1;
              }
              this.changeImportStatus(backup[i].aid, d.msg);
              if (success + error === backup.length) {
                this.loading = false;
                this.$alert(
                  "成功添加" + success + "条, 失败操作" + error + "条",
                  "导入结果",
                  {
                    confirmButtonText: "确定",
                    type: "info",
                  }
                );
              }
            });
        }
      });
    },
    importTypeChange(row) {
      // this.importType = row._props.name
      console.log(this.importType);
    },
    // 新增漏洞库
    addVulSub(row) {
      this.loading = true;
      const url = "/flaw/addFlaw";
      this.axios.post(url, this.qs.stringify(row)).then((Response) => {
        const d = Response.data;
        if (d.code === 200) {
          this.$alert(d.msg, "操作成功", {
            confirmButtonText: "确定",
            type: "success",
          });
          this.updateTable(row.aid);
        } else {
          this.$alert(d.msg, "操作失败", {
            confirmButtonText: "确定",
            type: "error",
          });
        }
        this.loading = false;
      });
    },
    // 批量添加白名单
    batchAddWhite(mode) {
      this.whiteMode = mode;
      let title = "全部";
      this.whiteTitle = "全部";
      if (mode === "more") {
        title = "所选";
        this.whiteTitle = "批量";
        if (this.SelectRowList.length === 0) {
          this.$message.error("请选择要操作的漏洞信息");
          return;
        }
      } else {
        if (this.tableData.length === 0) {
          this.$message.error("没有可以操作的漏洞信息");
          return;
        }
      }
      // 无问题则显示白名单导入界面
      this.whiteAddShow = true;
    },
    allWhiteSub(rowList) {
      this.$refs["backup"].validate((valid) => {
        if (valid) {
          this.$confirm(
            "白名单漏洞将被过滤，不会进入处置环节，您确定需要加入白名单吗？",
            "二次确认",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          ).then(() => {
            let url = "/flawLibrary/addFlawLib";
            // let formData = {...row}
            // formData.type = this.addModel
            // if (this.addModel === 1) {
            //   formData.reportTimeStr = this.backup.reportTimeStr
            // }
            let success = 0;
            let error = 0;
            for (let i in rowList) {
              this.whiteAddShow = false;
              this.loading = true;
              let formData = { ...rowList[i] };
              formData.type = this.addModel;
              if (this.addModel === 1) {
                formData.reportTimeStr = this.backup.reportTimeStr;
              }
              this.axios
                .post(url, this.qs.stringify(formData))
                .then((Response) => {
                  const d = Response.data;
                  if (d.code === 200) {
                    success += 1;
                  } else {
                    error += 1;
                  }
                  this.changeImportStatus(rowList[i].aid, d.msg);
                  if (error + success === rowList.length) {
                    this.loading = false;
                    this.$alert(
                      "成功添加" + success + "条, 失败操作" + error + "条",
                      "导入结果",
                      {
                        confirmButtonText: "确定",
                        type: "info",
                      }
                    );
                    this.RiskCancle();
                  }
                });
            }
          });
        } else {
          return false;
        }
      });
    },
    changeImportStatus(aid, msg) {
      // let data = [...this.tableData]
      for (let key in this.tableData) {
        if (this.tableData[key]["aid"] === aid) {
          this.tableData[key]["importStatus"] = msg;
        }
      }
    },
    addWhite(row, mode) {
      this.whiteMode = mode;
      this.RiskSubForm = { ...row };
      this.whiteAddShow = true;
    },
    BatchWhiteSub() {
      console.log(this.whiteMode);
      if (this.whiteMode === "aa") {
        this.WhiteSub(this.RiskSubForm);
      } else if (this.whiteMode === "more") {
        this.allWhiteSub(this.SelectRowList);
      } else if (this.whiteMode === "all") {
        this.allWhiteSub(this.tableData);
      }
    },
    WhiteSub(row) {
      this.$refs["backup"].validate((valid) => {
        if (valid) {
          this.$confirm(
            "白名单漏洞将被过滤，不会进入处置环节，您确定需要加入白名单吗？",
            "二次确认",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          ).then(() => {
            let url = "/flawLibrary/addFlawLib";
            let formData = { ...row };
            formData.type = this.addModel;
            if (this.addModel === 1) {
              formData.reportTimeStr = this.backup.reportTimeStr;
            }
            this.axios
              .post(url, this.qs.stringify(formData))
              .then((Response) => {
                const d = Response.data;
                if (d.code === 200) {
                  this.$alert(d.msg, "操作成功", {
                    confirmButtonText: "确定",
                    type: "success",
                  });
                } else {
                  this.$alert(d.msg, "操作失败", {
                    confirmButtonText: "确定",
                    type: "error",
                  });
                }
                this.RiskCancle();
              });
          });
        } else {
          return false;
        }
      });
    },
    whiteHandleClose(done) {
      done();
      this.addModel = 0;
      this.RiskCancle();
    },
    select_change_data(row) {
      console.log(row);
      let SelectRowList = [];
      row.map(function (d, i, a) {
        SelectRowList.push(d);
      });
      this.SelectRowList = SelectRowList;
    },
    page_currentsize_change(val) {
      this.tableCurPageSize = val;
      this.tableData2 = this.filterTableData.slice(
        (this.tableCurPage - 1) * this.tableCurPageSize,
        this.tableCurPage * this.tableCurPageSize
      );
    },
    page_current_change(val) {
      this.tableCurPage = val;
      this.tableData2 = this.filterTableData.slice(
        (this.tableCurPage - 1) * this.tableCurPageSize,
        this.tableCurPage * this.tableCurPageSize
      );
    },
    handleCancle() {
      this.dialogVisible = false;
      this.importType = "baogao";
      this.uploadForm.type = null;
      for (let key in this.RiskAddForm) {
        this.RiskAddForm[key] = null;
      }
    },
    handleClose(done) {
      done();
      this.handleCancle();
    },
    addVulShow() {
      this.editModel = false;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      this.$refs["uploadForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
      });
      this.loading = true;
      this.uploadData.task_id = file.uid;
      this.dialogVisible = false;
    },
    // 模板导入
    mobanBeforeUpload(file) {
      this.loading = true;
      this.uploadData2.task_id = file.uid;
      this.dialogVisible = false;
    },
    mobanUploadSuccess(Response, file, fileList) {
      const formData = {
        task_id: file.uid,
        name: file.name,
        type: "normal",
        filetype: file.raw.type,
      };
      const url =
        "http://103.44.144.41:12120/upload/success?" +
        this.qs.stringify(formData);
      this.axios.get(url).then((Response) => {
        const d = Response.data;
        if (Response.data.code === 0) {
          this.message_box(d.msg);
          this.pageTotal = d.data.length;
          d.data.map(function (dd, ii, aa) {
            d.data[ii]["aid"] = ii;
            // d.data[ii]['assetsId'] = parseInt(new Date().getTime() / 1000)
            d.data[ii]["flawSource"] = "normal";
            d.data[ii]["flawType"] = this.RiskTypeStrNumber(
              d.data[ii]["flawType"]
            );
            // d.data[ii]['flawDetails'] = d.data[ii]['flawDescription']
            // d.data[ii]['flawClassification'] = '--'
            // d.data[ii]['flawHazard'] = '--'
            d.data[ii]["flawGrade"] = this.RiskStrNumber(
              true,
              d.data[ii]["flawGrade"]
            )
              ? this.RiskStrNumber(true, d.data[ii]["flawGrade"])
              : 0;
            d.data[ii]["importStatus"] = "待导入";
          }, this);
          this.tableData = d.data;
          this.handleCancle();
        } else {
          this.$message.error(d.msg);
        }
        this.loading = false;
      });
    },
    RiskStrNumber(mode = false, riskLevel) {
      const RiskLevelList = {
        低危: 0,
        中危: 1,
        高危: 2,
      };
      if (mode) {
        return RiskLevelList[riskLevel];
      } else {
        const RiskNumber = {
          0: "低危",
          1: "中危",
          2: "高危",
        };
        return RiskNumber[riskLevel];
      }
    },
    RiskTypeStrNumber(vulType) {
      const RiskTypeList = {
        主机漏洞: 0,
        应用漏洞: 1,
        基线漏洞: 2,
      };
      return RiskTypeList[vulType];
    },
    // 报告导入
    uploadSuccess(Response, file, fileList) {
      const formData = {
        task_id: file.uid,
        name: file.name,
        type: this.uploadForm.type,
        filetype: file.raw.type,
      };
      const url =
        "http://103.44.144.41:12120/upload/success?" +
        this.qs.stringify(formData);
      this.axios.get(url).then((Response) => {
        const d = Response.data;
        if (Response.data.code === 0) {
          this.message_box(d.msg);
          this.pageTotal = d.data.length;
          d.data.map(function (dd, ii, aa) {
            d.data[ii]["aid"] = ii;
            // d.data[ii]['assetsId'] = parseInt(new Date().getTime() / 1000)
            d.data[ii]["flawSource"] = this.uploadForm.type;
            d.data[ii]["flawType"] = this.display.flawSouceList[
              this.uploadForm.type
            ]["type"];
            d.data[ii]["flawDetails"] = d.data[ii]["flawDetails"]
              ? d.data[ii]["flawDetails"]
              : d.data[ii]["flawDescription"];
            d.data[ii]["flawClassification"] = "--";
            d.data[ii]["flawHazard"] = "--";
            d.data[ii]["flawIdentifying"] =
              d.data[ii]["flawIdentifying"] &&
              d.data[ii]["flawIdentifying"] !== "--"
                ? d.data[ii]["flawIdentifying"]
                : md5(
                    d.data[ii]["flawName"] +
                      d.data[ii]["flawIp"] +
                      d.data[ii]["flawSource"]
                  );
            d.data[ii]["flawGrade"] = this.RiskStrNumber(
              false,
              d.data[ii]["flawGrade"]
            )
              ? d.data[ii]["flawGrade"]
              : 0;
            d.data[ii]["importStatus"] = "待导入";
          }, this);
          this.tableData = d.data;
          this.handleCancle();
        } else {
          this.$message.error(d.msg);
        }
        this.loading = false;
      });
    },
    editVulCancle() {
      this.RiskdialogVisible = false;
      for (let key in this.RiskAddForm) {
        this.RiskAddForm[key] = "";
      }
    },
    message_box(msg, type = "success") {
      this.$message({
        message: msg,
        type: type,
      });
    },
  },
  watch: {
    tableData(newValue, oldValue) {
      console.log("已变化");
      this.filterTableData = this.tableData;
      this.tableData2 = this.filterTableData.slice(
        (this.tableCurPage - 1) * this.tableCurPageSize,
        this.tableCurPage * this.tableCurPageSize
      );
      console.log(233, this.tableData2);
    },
  },
  filterTableData() {
    this.updateTable();
    // console.log('page', this.pageTotal)
  },
};
</script>

<style scoped>
.el-icon-download {
  color: #66b1ff;
}
.importBox {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}
.description {
  font-size: 13px;
  font-weight: 400;
  color: #b3b3b3;
}
.button-box {
  position: relative;
  height: 50px;
  margin-top: -45px;
}
.button-pos {
  position: absolute;
  right: 0px;
}
.button-text {
  color: #0e76d7 !important;
  margin: 5px;
}
.button-text:hover {
  cursor: pointer;
}
.button-line {
  color: #0e76d7;
}
.vuladd >>> .el-dialog__header {
  background-color: #f5f5f5;
  padding-top: 10px !important;
}
.vuladd >>> .el-upload .el-select {
  width: 30% !important;
  min-width: 200px;
}
/* .vuladd >>> .StyleChange .el-input{
  width: 80%;
} */
.vuladd >>> .StyleChange .el-form-item {
  padding: 0px 20px;
}
.vuladd >>> .el-select {
  width: 100%;
}
.vuladd >>> .upload-demo > .el-upload {
  width: 100% !important;
}
.vuladd >>> .upload-demo > .el-upload > .el-upload-dragger {
  width: 100% !important;
}
.vuladd >>> .boxClass {
  font-weight: 650;
  font-size: 16px;
  color: #666;
}
.is_show {
  display: none;
}
.risk-title {
  font-weight: bold;
  font-size: 17px;
}
.risk-title::before {
  content: "";
  display: inline-block;
  position: relative;
  top: 2px;
  width: 6px;
  height: 16px;
  margin-right: 6px;
  background: rgba(41, 85, 195, 1);
}
.vuladd >>> .addVulStyle .el-dialog__body {
  padding: 0px !important;
}
.vuladd >>> .el-tabs--border-card {
  border-bottom: 0px !important;
  box-shadow: none;
}
.vuladd >>> .el-tabs__content {
  padding: 20px !important;
}
</style>

