# Node.js 安装步骤

## 1. 下载 Node.js LTS 版本

1. 打开浏览器，访问 Node.js 官方网站：https://nodejs.org/zh-cn/
2. 点击页面上的 "LTS 版本" 下方的 "下载" 按钮（默认适配 Windows 64 位系统）
3. 如果您的系统是 32 位的，请点击页面下方的 "其他下载"，选择对应 32 位的安装包（标注 "x86"）

## 2. 运行 Node.js 安装程序

1. 找到下载完成的安装包（默认保存在 "下载" 文件夹），双击打开
2. 在安装向导中，点击 "Next"（下一步）
3. 勾选 "我接受许可协议中的条款"，点击 "Next"
4. 选择安装路径（建议使用默认路径，如 C:\Program Files\nodejs），点击 "Next"
5. 务必勾选 "Add to PATH"（自动配置环境变量），点击 "Next"
6. 无需勾选额外组件，保持默认即可，点击 "Next"
7. 点击 "Install"（安装），等待安装完成
8. 安装完成后，点击 "Finish"

## 3. 验证 Node.js 和 npm 是否安装成功

1. 按下 Win+R，输入 cmd，打开命令提示符（CMD）
2. 输入命令 `node -v`，按下回车，若显示 Node.js 版本号（如 v20.10.0），说明 Node.js 安装成功
3. 输入命令 `npm -v`，按下回车，若显示 npm 版本号（如 10.2.3），说明 npm 自动安装成功

## 4. 配置 npm 镜像源为淘宝镜像

由于 npm 默认镜像源在国外，下载依赖包可能较慢，建议切换为国内镜像：

```bash
npm config set registry https://registry.npmmirror.com/
```

验证镜像源是否切换成功：

```bash
npm config get registry
```

显示 `https://registry.npmmirror.com/` 即成功。

## 5. 安装项目依赖

1. 打开命令提示符（CMD）
2. 进入项目目录：
   ```bash
   cd d:\前端代码\frontend-vue
   ```
3. 安装依赖：
   ```bash
   npm install
   ```

## 6. 启动开发服务器

安装依赖完成后，启动开发服务器：

```bash
npm run dev
```

服务器启动后，会显示访问地址（如 http://localhost:5173/），在浏览器中打开该地址即可查看前端项目。

## 常见问题解决

1. **命令行提示 "node 不是内部或外部命令"**
   - 原因：环境变量未配置或配置错误
   - 解决：重新检查环境变量 Path 是否包含 Node.js 安装路径，重启命令行工具

2. **npm 下载包时卡住或报错**
   - 原因：网络问题或镜像源错误
   - 解决：确保已切换为淘宝镜像，或检查网络连接

3. **Windows 安装时提示 "权限不足"**
   - 解决：右键安装包，选择「以管理员身份运行」