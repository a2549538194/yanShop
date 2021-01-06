<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色区域 -->
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表区域 -->
    <el-table :data="rolelist" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <!-- 通过 for 循环 嵌套渲染二级权限 -->
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <pre>
              {{scope.row}}
            </pre> -->
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="getShowRule(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeRightById(scope.row.id)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showSetRightDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色列表 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="roleForm"
        :rules="roleFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRule">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改区域 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form
        :model="editRuleForm"
        :rules="editRoleRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <el-tree
        :data="rightslist"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="defKeys"
        :props="treeProps"
        ref="tree"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRightInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      //控制添加用户对话框的隐藏和显示
      addDialogVisible: false,
      roleForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加用户表单验证
      roleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //控制修改用户对话框的隐藏和显示
      editDialogVisible: false,
      editRuleForm: {
        roleName: "",
        roleDesc: "",
      },
      //编辑用户表单验证
      editRoleRules: {
        roleDesc: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      //默认打开
      expandedKeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  mounted() {},
  methods: {
    //获取用户数据列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.rolelist = res.data;
      console.log(this.rolelist);
    },
    //添加角色数据
    addRule() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        //发起添加角色网络请求
        const { data: res } = await this.$http.post("roles", this.roleForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败！");
        }

        this.$message.success("添加角色成功！");
        //隐藏添加角色的对话框
        this.addDialogVisible = false;
        //重新获取角色列表
        this.getRolesList();
      });
    },

    //编辑区域
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //编辑用户区域
    //编辑按钮
    async getShowRule(id) {
      this.roleid = id;
      // console.log(id);
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.message.error("获取角色失败");
      }
      this.editRuleForm = res.data;
      console.log(this.editRuleForm);

      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    async editRoleInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        //发起修改用户信息的请求
        const { data: res } = await this.$http.put("roles/" + this.roleid, {
          roleName: this.editRuleForm.roleName,
          roleDesc: this.editRuleForm.roleDesc,
        });
        console.log(res.meta.status);

        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败！");
        }
        //关闭对话框
        this.editDialogVisible = false;
        //更新数据列表
        this.getRolesList();
        //提示修改成功
        this.$message.success("更新用户信息成功！");
      });
    },

    //删除
    async removeRightById(id) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //如果用户确认删除，则返回值为字符串 confirm
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("roles/" + id);

      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      this.$message.success("删除用户成功！");
      this.getRolesList();
    },
    //打开分配权限，获取初始状态
    async showSetRightDialog(row) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status == 200) {
        this.rightslist = res.data;
        this.expandedKeys = this.getLeafKeys(res.data);
      }
      this.defKeys = this.getLeafKeys(row.children);
      console.log(this.defKeys);
      this.setRightDialogVisible = true;
      this.roleId = row.id;
    },
    //
    async editRightInfo() {
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: this.getLeafKeys(this.$refs.tree.getCheckedNodes()).join(","),
        }
      );
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
        this.setRightDialogVisible = false;
        this.getRolesList();
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    //递归获取权限id
    getLeafKeys(leaf) {
      let keys = [];
      leaf.map((item) => {
        if (item.children) {
          keys = keys.concat(this.getLeafKeys(item.children));
        }
        keys.push(item.id);
      });
      return keys;
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
</style>
