<template>
  <div class="settings-page">
    <div class="settings-container">
      <!-- 左侧导航 -->
      <nav class="settings-nav">
        <button
          v-for="section in sections"
          :key="section.key"
          class="nav-item"
          :class="{ active: activeSection === section.key }"
          @click="activeSection = section.key"
        >
          <component :is="section.icon" :size="18" />
          <span>{{ section.label }}</span>
        </button>
      </nav>

      <!-- 右侧内容 -->
      <div class="settings-content">
        <!-- 基础信息 -->
        <div v-if="activeSection === 'profile'" class="section-card">
          <h3 class="section-title">基础信息</h3>

          <div class="profile-avatar-row">
            <div class="avatar-preview">
              <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="" />
              <User v-else :size="32" />
            </div>
            <button class="btn-outline" @click="onChangeAvatar">
              <Upload :size="15" />
              <span>更换头像</span>
            </button>
          </div>

          <div class="field-row">
            <label>用户名</label>
            <div class="field-control">
              <input
                v-if="editingUsername"
                ref="usernameInput"
                v-model="editForm.username"
                class="input"
                maxlength="20"
                @keyup.enter="saveUsername"
              />
              <span v-else class="field-value">{{ profile.username || '未设置' }}</span>
              <button v-if="!editingUsername" class="btn-text" @click="startEditUsername">
                <Pencil :size="14" /> 编辑
              </button>
              <template v-if="editingUsername">
                <button class="btn-text primary" @click="saveUsername">保存</button>
                <button class="btn-text" @click="editingUsername = false">取消</button>
              </template>
            </div>
          </div>

          <div class="field-row">
            <label>邮箱</label>
            <div class="field-control">
              <input
                v-if="editingEmail"
                ref="emailInput"
                v-model="editForm.email"
                class="input"
                type="email"
                @keyup.enter="saveEmail"
              />
              <span v-else class="field-value">{{ profile.email || '未设置' }}</span>
              <button v-if="!editingEmail" class="btn-text" @click="startEditEmail">
                <Pencil :size="14" /> 修改
              </button>
              <template v-if="editingEmail">
                <button class="btn-text primary" @click="saveEmail">保存</button>
                <button class="btn-text" @click="editingEmail = false">取消</button>
              </template>
            </div>
            <span v-if="emailError" class="field-error">{{ emailError }}</span>
          </div>

          <div class="field-row">
            <label>注册时间</label>
            <span class="field-value">{{ formatDate(profile.created_at) }}</span>
          </div>

          <div v-if="profileMsg" class="msg" :class="profileMsgType">{{ profileMsg }}</div>
        </div>

        <!-- 账号安全 -->
        <div v-if="activeSection === 'security'" class="section-card">
          <h3 class="section-title">修改密码</h3>

          <div class="field-row">
            <label>旧密码</label>
            <input v-model="pwForm.oldPassword" class="input" type="password" />
          </div>

          <div class="field-row">
            <label>新密码</label>
            <input v-model="pwForm.newPassword" class="input" type="password" @input="updatePasswordRules" />
            <div class="password-rules">
              <div v-for="rule in passwordRules" :key="rule.label" class="rule-line" :class="{ pass: rule.pass }">
                <Check v-if="rule.pass" :size="12" />
                <X v-else :size="12" />
                <span>{{ rule.label }}</span>
              </div>
            </div>
          </div>

          <div class="field-row">
            <label>确认新密码</label>
            <input v-model="pwForm.confirmPassword" class="input" type="password" />
            <span v-if="pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword" class="field-error">
              两次密码不一致
            </span>
          </div>

          <button class="btn-primary" :disabled="!canChangePassword" @click="onChangePassword">
            修改密码
          </button>
          <span v-if="pwMsg" class="msg" :class="pwMsgType">{{ pwMsg }}</span>
        </div>

        <!-- 个性化偏好 -->
        <div v-if="activeSection === 'preferences'" class="section-card">
          <h3 class="section-title">主题设置</h3>

          <div class="theme-options">
            <button
              v-for="opt in themeOptions"
              :key="opt.value"
              class="theme-option"
              :class="{ active: themeMode === opt.value }"
              @click="setThemeMode(opt.value)"
            >
              <component :is="opt.icon" :size="20" />
              <span>{{ opt.label }}</span>
            </button>
          </div>

          <div class="divider" />

          <h3 class="section-title">其他偏好</h3>
          <p class="placeholder-text">更多个性化设置即将上线…</p>
        </div>

        <!-- 危险操作区 -->
        <div class="section-card danger-zone">
          <h3 class="section-title danger-title">危险操作</h3>

          <div class="danger-item">
            <div class="danger-info">
              <span class="danger-label">退出登录</span>
              <span class="danger-desc">退出当前账号，返回登录页</span>
            </div>
            <button class="btn-outline danger" @click="onLogout">退出登录</button>
          </div>

          <div class="divider" />

          <div class="danger-item">
            <div class="danger-info">
              <span class="danger-label">注销账号</span>
              <span class="danger-desc">永久删除账号及所有数据，不可恢复</span>
            </div>
            <button class="btn-outline danger" @click="showDeleteModal = true">注销账号</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 注销确认弹窗 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-card">
        <h4 class="modal-title">确认注销账号</h4>
        <p class="modal-desc">此操作不可撤销。请输入 <code>DELETE</code> 确认：</p>
        <input v-model="deleteConfirm" class="input" placeholder="输入 DELETE" />
        <div class="modal-actions">
          <button class="btn-outline" @click="showDeleteModal = false">取消</button>
          <button class="btn-danger" :disabled="deleteConfirm !== 'DELETE'" @click="onDeleteAccount">
            确认注销
          </button>
        </div>
        <span v-if="deleteMsg" class="field-error">{{ deleteMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { User, Upload, Pencil, Check, X, Sun, Moon, Monitor } from 'lucide-vue-next'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'
import { getUserProfile, updateProfile, changePassword } from '../api/modules/user'
import { MOCK_USER_PROFILE } from '../api/mock'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

// ========== 左侧导航 ==========

const sections = [
  { key: 'profile' as const, label: '基础信息', icon: User },
  { key: 'security' as const, label: '账号安全', icon: Check },
  { key: 'preferences' as const, label: '个性化偏好', icon: Monitor },
]
const activeSection = ref<'profile' | 'security' | 'preferences'>('profile')

// ========== 基础信息 ==========

const profile = reactive({ user_id: '', username: '', email: '', avatar_url: '', created_at: '' })
const editingUsername = ref(false)
const editingEmail = ref(false)
const editForm = reactive({ username: '', email: '' })
const emailError = ref('')
const profileMsg = ref('')
const profileMsgType = ref<'success' | 'error'>('success')
const usernameInput = ref<HTMLInputElement>()
const emailInput = ref<HTMLInputElement>()

async function loadProfile() {
  try {
    const res = await getUserProfile()
    Object.assign(profile, res)
  } catch {
    console.warn('⚠️ /api/user/profile 失败，降级 Mock')
    Object.assign(profile, MOCK_USER_PROFILE)
  }
}

function startEditUsername() {
  editForm.username = profile.username
  editingUsername.value = true
  nextTick(() => usernameInput.value?.focus())
}

async function saveUsername() {
  const name = editForm.username.trim()
  if (!name) return
  try {
    const res = await updateProfile({ username: name })
    Object.assign(profile, res)
    editingUsername.value = false
    profileMsg.value = '用户名已更新'
    profileMsgType.value = 'success'
  } catch (e: any) {
    profileMsg.value = e.message || '更新失败'
    profileMsgType.value = 'error'
  }
}

function startEditEmail() {
  editForm.email = profile.email
  emailError.value = ''
  editingEmail.value = true
  nextTick(() => emailInput.value?.focus())
}

function validateEmail(email: string): boolean {
  if (!email) { emailError.value = '邮箱不能为空'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailError.value = '邮箱格式不正确'; return false }
  emailError.value = ''
  return true
}

async function saveEmail() {
  if (!validateEmail(editForm.email.trim())) return
  try {
    const res = await updateProfile({ email: editForm.email.trim() })
    Object.assign(profile, res)
    editingEmail.value = false
    profileMsg.value = '邮箱已更新'
    profileMsgType.value = 'success'
  } catch (e: any) {
    profileMsg.value = e.message || '更新失败'
    profileMsgType.value = 'error'
  }
}

function onChangeAvatar() {
  profileMsg.value = '头像更换功能开发中'
  profileMsgType.value = 'success'
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '未知'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ========== 账号安全 ==========

const pwForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwMsg = ref('')
const pwMsgType = ref<'success' | 'error'>('success')

const passwordRules = computed(() => [
  { label: '至少6个字符', pass: pwForm.newPassword.length >= 6 },
  { label: '包含大写字母', pass: /[A-Z]/.test(pwForm.newPassword) },
  { label: '包含小写字母', pass: /[a-z]/.test(pwForm.newPassword) },
  { label: '包含数字', pass: /[0-9]/.test(pwForm.newPassword) },
])

const isPasswordStrong = computed(() => passwordRules.value.every(r => r.pass))
const passwordsMatch = computed(() => pwForm.newPassword === pwForm.confirmPassword)
const canChangePassword = computed(() =>
  pwForm.oldPassword && isPasswordStrong.value && passwordsMatch.value
)

function updatePasswordRules() { /* reactive, computed handles it */ }

async function onChangePassword() {
  if (!canChangePassword.value) return
  try {
    await changePassword({ old_password: pwForm.oldPassword, new_password: pwForm.newPassword })
    pwForm.oldPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
    pwMsg.value = '密码已修改'
    pwMsgType.value = 'success'
  } catch (e: any) {
    pwMsg.value = e.message || '修改密码失败'
    pwMsgType.value = 'error'
  }
}

// ========== 个性化偏好 ==========

const themeMode = ref<'light' | 'dark' | 'system'>(
  (localStorage.getItem('themeMode') as 'light' | 'dark' | 'system') || 'system'
)

const themeOptions = [
  { value: 'light' as const, label: '浅色', icon: Sun },
  { value: 'dark' as const, label: '深色', icon: Moon },
  { value: 'system' as const, label: '跟随系统', icon: Monitor },
]

function setThemeMode(mode: 'light' | 'dark' | 'system') {
  themeMode.value = mode
  localStorage.setItem('themeMode', mode)
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    themeStore.setTheme(prefersDark ? 'dark' : 'light')
  } else {
    themeStore.setTheme(mode)
  }
}

// 监听系统主题变化（仅当 mode === 'system' 时生效）
watch(themeMode, (mode) => {
  if (mode !== 'system') return
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => themeStore.setTheme(e.matches ? 'dark' : 'light')
  mq.addEventListener('change', handler)
})

// ========== 危险操作 ==========

async function onLogout() {
  await userStore.logout()
  router.push('/login')
}

const showDeleteModal = ref(false)
const deleteConfirm = ref('')
const deleteMsg = ref('')

function onDeleteAccount() {
  showDeleteModal.value = false
  deleteConfirm.value = ''
  profileMsg.value = '功能开发中'
  profileMsgType.value = 'error'
  setTimeout(() => { profileMsg.value = '' }, 3000)
}

onMounted(() => { loadProfile() })
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 64px);
  padding: var(--space-xl);
  display: flex;
  justify-content: center;
}

.settings-container {
  display: flex;
  gap: var(--space-lg);
  width: 100%;
  max-width: 900px;
}

/* 左侧导航 */
.settings-nav {
  flex-shrink: 0;
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px var(--space-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-item.active {
  color: var(--accent-primary);
  background: var(--accent-glow);
  border-left: 3px solid var(--accent-primary);
}

/* 右侧内容 */
.settings-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-width: 0;
}

.section-card {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  transition: border-color 0.3s ease;
}

.section-card:hover {
  border-color: var(--border-secondary);
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-lg);
}

/* 基础信息 - 头像 */
.profile-avatar-row {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.avatar-preview {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 字段行 */
.field-row {
  margin-bottom: var(--space-lg);
}

.field-row label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-control {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.field-value {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.field-error {
  display: block;
  font-size: 0.8rem;
  color: #f87171;
  margin-top: 4px;
}

/* 输入框 */
.input {
  padding: 8px 12px;
  font-size: 0.9rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  outline: none;
  transition: all 0.2s ease;
  width: 260px;
}

.input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* 按钮 */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  color: var(--text-primary);
  border-color: var(--border-secondary);
  background: var(--bg-tertiary);
}

.btn-outline.danger {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.btn-outline.danger:hover {
  background: rgba(248, 113, 113, 0.1);
  border-color: #f87171;
}

.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-text:hover { color: var(--text-primary); }
.btn-text.primary { color: var(--accent-primary); }
.btn-text.primary:hover { color: var(--accent-secondary); }

.btn-danger {
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background: #ef4444;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover:not(:disabled) { background: #dc2626; }
.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

/* 消息提示 */
.msg {
  display: inline-block;
  margin-top: var(--space-sm);
  font-size: 0.85rem;
}

.msg.success { color: #4ade80; }
.msg.error { color: #f87171; }

/* 密码规则 */
.password-rules {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rule-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}

.rule-line.pass { color: #4ade80; }

/* 主题选项 */
.theme-options {
  display: flex;
  gap: var(--space-md);
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.theme-option:hover {
  border-color: var(--border-secondary);
  color: var(--text-primary);
}

.theme-option.active {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--accent-glow);
}

/* 分割线 */
.divider {
  height: 1px;
  margin: var(--space-xl) 0;
  background: var(--border-primary);
}

.placeholder-text {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

/* 危险操作区 */
.danger-zone {
  border-color: rgba(248, 113, 113, 0.2) !important;
}

.danger-title {
  color: #f87171 !important;
}

.danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
}

.danger-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.danger-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.danger-desc {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-card {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  width: 400px;
  max-width: 90vw;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm);
}

.modal-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-lg);
}

.modal-desc code {
  padding: 2px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  border-radius: var(--radius-sm);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.modal-card .input {
  width: 100%;
}
</style>
