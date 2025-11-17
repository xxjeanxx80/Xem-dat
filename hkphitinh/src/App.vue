<script setup lang="ts">
import { computed, reactive } from 'vue'
import { buildBoards, classifyDirection, type DirectionInfo } from './logic/hkpt'

type HouseType = 'duong-trach' | 'am-trach'

const palaces = [
  { key: 'dong-nam', label: 'Dong Nam', row: 2, col: 2 },
  { key: 'nam', label: 'Nam', row: 2, col: 1 },
  { key: 'tay-nam', label: 'Tay Nam', row: 2, col: 0 },
  { key: 'dong', label: 'Dong', row: 1, col: 2 },
  { key: 'trung', label: 'Trung cung', row: 1, col: 1 },
  { key: 'tay', label: 'Tay', row: 1, col: 0 },
  { key: 'dong-bac', label: 'Dong Bac', row: 0, col: 2 },
  { key: 'bac', label: 'Bac', row: 0, col: 1 },
  { key: 'tay-bac', label: 'Tay Bac', row: 0, col: 0 },
]

const form = reactive({
  houseType: 'duong-trach' as HouseType,
  enterYear: `${new Date().getFullYear()}`,
  viewYear: `${new Date().getFullYear()}`,
  degree: 95,
})

const facingInfo = computed<DirectionInfo>(() => classifyDirection(form.degree))
const sittingInfo = computed<DirectionInfo>(() => classifyDirection(form.degree + 180))

const boards = computed<ReturnType<typeof buildBoards> | null>(() => {
  const year = Number.parseInt(form.enterYear, 10)
  if (Number.isNaN(year)) return null
  return buildBoards(year, form.degree)
})

type CellView = {
  key: string
  label: string
  row: number
  col: number
  son: number
  van: number
  huong: number
  earth: number
  sonPhase: string
  huongPhase: string
  relation: string
  pairs: string[]
  altSon?: number
  altHuong?: number
}

const combinedBoard = computed<CellView[]>(() => {
  const b = boards.value
  if (!b) return []
  const grid = b.boards
  return palaces.map(p => ({
    ...p,
    son: grid.son[p.row]?.[p.col] ?? 0,
    van: grid.van[p.row]?.[p.col] ?? 0,
    huong: grid.huong[p.row]?.[p.col] ?? 0,
    earth: b.earthGrid[p.row]?.[p.col] ?? 0,
    sonPhase: b.cellMeta.find(c => c.key === p.key)?.sonPhase ?? 'tu',
    huongPhase: b.cellMeta.find(c => c.key === p.key)?.huongPhase ?? 'tu',
    relation: b.cellMeta.find(c => c.key === p.key)?.relation ?? '',
    pairs: b.cellMeta.find(c => c.key === p.key)?.pairs ?? [],
    altSon: b.alt?.boards.son[p.row]?.[p.col],
    altHuong: b.alt?.boards.huong[p.row]?.[p.col],
  }))
})

const warnings = computed(() => {
  const notes: string[] = []
  if (boards.value?.warning) notes.push(boards.value.warning)
  if (facingInfo.value.kind === 'kiem') notes.push('Kiêm hướng (lệch 3–7°): cần xem Thế Quái.')
  if (sittingInfo.value.kind === 'kiem') notes.push('Tọa kiêm: cân nhắc Thế Quái cho Sơn bàn.')
  if (boards.value?.nonVoidType === 'dai-khong-vong') notes.push('Đại Không Vong: tuyến giữa 2 hướng lớn, tạp khí mạnh.')
  if (boards.value?.nonVoidType === 'tieu-khong-vong') notes.push('Tiểu Không Vong: giữa 2 sơn cùng hướng, cần thận trọng.')
  notes.push('Thuật toán cần đối chiếu tài liệu HKPT để đảm bảo chính xác.')
  return notes
})

const phanPhucWarnings = computed(() => {
  const b = boards.value
  if (!b) return []
  const notes: string[] = []
  b.cellMeta.forEach(c => {
    if (c.son === c.earth || c.huong === c.earth) {
      notes.push(`Phục ngâm tại ${c.label}: sao trùng địa bàn ${c.earth}`)
    }
    if (c.son + c.earth === 10 || c.huong + c.earth === 10) {
      notes.push(`Phản ngâm tại ${c.label}: sao + địa bàn = 10`)
    }
  })
  const centerHuong = b.boards.huong[1]?.[1]
  if (centerHuong === b.periodInfo.period && centerHuong !== 5) {
    notes.push('Nhập tù: Hướng tinh đương vận ở trung cung (cần hóa giải bằng cầu thang trung cung/cửa phương nguyên thủy)')
  }
  return notes
})

const phaseClasses: Record<string, string> = {
  vuong: 'text-emerald-300',
  sinh: 'text-blue-300',
  tien: 'text-cyan-200',
  thoai: 'text-amber-300',
  tu: 'text-slate-300',
}

const thanhMon = computed(() => boards.value?.thanhMon ?? null)
</script>

<template>
  <main class="min-h-screen bg-slate-900 text-slate-100">
    <header class="mx-auto max-w-6xl px-6 pt-10 text-center">
      <h1 class="text-3xl font-extrabold text-sky-400 md:text-4xl">Huyền Không Phi Tinh</h1>
      <p class="mt-1 text-sm text-slate-300">Tam Nguyên Cửu Vận · giao diện xanh dương</p>
      <div class="mt-4 flex items-center justify-center gap-3">
        <button class="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500">
          Phan Tich Moi
        </button>
        <button class="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-sky-500">
          In / Xuat PDF
        </button>
      </div>
    </header>

    <section class="mx-auto mt-8 max-w-6xl space-y-6 px-6 pb-14">
      <div class="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-xl">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-sky-200">
              <span class="text-lg font-semibold">Nhập thông tin nhà</span>
              <span class="h-px flex-1 bg-sky-600/50"></span>
            </div>

            <div class="grid gap-4">
              <div>
                <label class="text-sm text-slate-300">Loại trạch</label>
                <div class="mt-2 flex items-center gap-4 text-sm">
                  <label class="flex items-center gap-2">
                    <input v-model="form.houseType" type="radio" value="duong-trach" class="text-sky-500" />
                    <span>Dương trạch</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input v-model="form.houseType" type="radio" value="am-trach" class="text-sky-500" />
                    <span>Âm trạch</span>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-slate-300">Năm nhập trạch / xây</label>
                  <input
                    v-model="form.enterYear"
                    type="number"
                    min="1800"
                    max="2100"
                    class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-sm text-slate-300">Năm xét</label>
                  <input
                    v-model="form.viewYear"
                    type="number"
                    min="1800"
                    max="2100"
                    class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label class="text-sm text-slate-300">Độ số hướng (0° - 360°)</label>
                <div class="mt-2 flex items-center justify-between gap-2 text-sm text-slate-200">
                  <input
                    v-model.number="form.degree"
                    type="number"
                    min="0"
                    max="359"
                    class="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-right text-slate-100 focus:border-sky-500 focus:outline-none"
                  />
                  <span class="rounded-full bg-sky-600/20 px-3 py-1 text-xs font-semibold text-sky-200">
                    {{ facingInfo.mountain.label }} ({{ facingInfo.mountain.bigDirection }})
                  </span>
                  <span class="rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-semibold text-indigo-200">
                    Toa: {{ sittingInfo.mountain.label }}
                  </span>
                </div>
                <input
                  v-model.number="form.degree"
                  type="range"
                  min="0"
                  max="359"
                  class="mt-3 w-full accent-sky-400"
                />
                <p class="mt-1 text-xs text-slate-400">
                  Chính hướng: lệch ≤ 3°. Kiêm hướng: 3–7°. Lệch > 7° có thể phải lập 2 tinh bàn.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-2 text-sky-200">
              <span class="text-lg font-semibold">Thông tin xác định</span>
              <span class="h-px flex-1 bg-sky-600/50"></span>
            </div>
            <div class="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-inner space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-slate-300">Nguyên vận</span>
                <span class="rounded-full bg-sky-600/20 px-3 py-1 text-xs font-semibold text-sky-200">
                  Van {{ boards?.periodInfo.period ?? '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-300">Hướng</span>
                <span class="text-slate-100 font-semibold">
                  {{ facingInfo.mountain.label }} · {{ facingInfo.kind.toUpperCase() }} (±{{ facingInfo.delta.toFixed(1) }}°)
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-300">Tọa</span>
                <span class="text-slate-100 font-semibold">
                  {{ sittingInfo.mountain.label }} · {{ sittingInfo.kind.toUpperCase() }}
                </span>
              </div>
              <div class="rounded-lg border border-sky-700/40 bg-sky-900/30 px-3 py-2 text-xs text-slate-200">
                Ghi chu: Thuan/Nghich phi dua tren am duong son/huong va chan le sao. Can doi chieu Luong Thien Xich.
              </div>
            </div>
            <button
              class="w-full rounded-lg bg-sky-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-800/50 transition hover:bg-sky-500"
            >
              Phân tích
            </button>
          </div>
        </div>
      </div>

      <div v-if="boards" class="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-xl space-y-6">
        <div class="flex flex-wrap items-center gap-3 text-slate-200">
          <div class="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm">
            <span class="text-sky-300">Hướng</span>
            <span class="font-semibold">{{ boards.facing.mountain.label }} ({{ boards.facing.mountain.bigDirection }})</span>
          </div>
          <div class="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm">
            <span class="text-sky-300">Tọa</span>
            <span class="font-semibold">{{ boards.sitting.mountain.label }} ({{ boards.sitting.mountain.bigDirection }})</span>
          </div>
          <div class="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm">
            <span class="text-sky-300">Vận</span>
            <span class="font-semibold">Vận {{ boards.periodInfo.period }}</span>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <div class="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <h3 class="text-lg font-semibold text-sky-200">Phi tinh bàn & lưu niên</h3>
            <p class="mt-1 text-xs text-slate-400">
              Mỗi ô: Sơn / Vận / Hướng. Nếu phạm Không Vong (≥7°), hiển thị thêm bàn phụ (alt) để thấy khí hỗn.
            </p>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm font-semibold">
              <div
                v-for="cell in combinedBoard"
                :key="cell.key"
                class="rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-3"
              >
                <div class="text-sky-300 text-xs">{{ cell.label }} · Địa {{ cell.earth }}</div>
                <div class="mt-1 text-lg text-white">
                  <span :class="phaseClasses[cell.sonPhase]">{{ cell.son }}</span>
                  /
                  <span class="text-slate-200">{{ cell.van }}</span>
                  /
                  <span :class="phaseClasses[cell.huongPhase]">{{ cell.huong }}</span>
                </div>
                <div v-if="cell.altSon || cell.altHuong" class="mt-1 text-sm text-amber-200">
                  Bàn phụ: S{{ cell.altSon ?? '–' }} / H{{ cell.altHuong ?? '–' }}
                </div>
                <div class="text-[11px] text-slate-400">Sơn / Vận / Hướng (màu pha Vượng/Sinh/Tiến/Thoái/Tử)</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <h3 class="text-lg font-semibold text-sky-200">Phân tích 9 cung (khung mẫu)</h3>
            <div class="mt-3 grid gap-3 md:grid-cols-2">
              <div
                v-for="cell in combinedBoard"
                :key="cell.key + '-analysis'"
                class="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-slate-200"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-sky-300">{{ cell.label }}</span>
                  <span class="text-xs text-slate-400">S{{ cell.son }} · V{{ cell.van }} · H{{ cell.huong }}</span>
                </div>
                <p class="mt-2 text-slate-300">
                  Quan hệ ngũ hành: {{ cell.relation || '—' }}. Cặp hung/cát: {{ cell.pairs.join('; ') || '—' }}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <h3 class="text-lg font-semibold text-sky-200">Tổng kết & nhắc nhở</h3>
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
            <li v-for="note in warnings" :key="note">{{ note }}</li>
            <li v-for="note in phanPhucWarnings" :key="note + 'p'">{{ note }}</li>
            <li>Kiểm tra Phản/Phục ngâm, Không Vong, Thành Môn, Tam Cát 1-6-8.</li>
            <li>Loan đầu quyết định cát/hung: cần xét thủy/sơn, đường, thoáng.</li>
          </ul>
          <p v-if="thanhMon" class="mt-2 text-sm text-emerald-300">
            Thành Môn: {{ thanhMon.viTri }} ({{ thanhMon.loai }}). {{ thanhMon.note }}
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
