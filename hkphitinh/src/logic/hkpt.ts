export type YuanLong = 'thien' | 'dia' | 'nhan'
export type YinYang = 'am' | 'duong'
export type ElementKind = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho'

export type Mountain = {
  key: string
  label: string
  center: number
  start: number
  end: number
  bigDirection:
    | 'bac'
    | 'dong-bac'
    | 'dong'
    | 'dong-nam'
    | 'nam'
    | 'tay-nam'
    | 'tay'
    | 'tay-bac'
  yuan: YuanLong
  yinYang: YinYang
}

export type DirectionKind = 'chinh' | 'kiem' | 'tieu-khong-vong' | 'dai-khong-vong'

export type DirectionInfo = {
  mountain: Mountain
  kind: DirectionKind
  delta: number
}

export type PeriodInfo = { period: number; startYear: number; endYear: number }

export type BoardGrid = number[][]
export type BoardSet = { van: BoardGrid; huong: BoardGrid; son: BoardGrid }

export type Phase = 'vuong' | 'sinh' | 'tien' | 'thoai' | 'tu'

export type CellMeta = {
  key: string
  label: string
  coord: Coord
  son: number
  huong: number
  van: number
  earth: number
  sonPhase: Phase
  huongPhase: Phase
  sonElement: ElementKind
  huongElement: ElementKind
  vanElement: ElementKind
  earthElement: ElementKind
  relation: string
  pairs: string[]
}

export type ThanhMonResult = {
  viTri: string
  loai: 'chinh' | 'phu' | 'ngam'
  cung: string
  note: string
}

export type BoardResult = {
  periodInfo: PeriodInfo
  facing: DirectionInfo
  sitting: DirectionInfo
  nonVoidType?: DirectionKind
  warning: string | null
  boards: BoardSet
  earthGrid: BoardGrid
  cellMeta: CellMeta[]
  alt?: {
    facing: DirectionInfo
    sitting: DirectionInfo
    boards: BoardSet
    cellMeta: CellMeta[]
  }
  thanhMon?: ThanhMonResult | null
}

const TWO_PI = 360

function normalizeDeg(deg: number): number {
  const n = deg % TWO_PI
  return n < 0 ? n + TWO_PI : n
}

type MountainSeed = {
  key: Mountain['key']
  label: string
  center: number
  bigDirection: Mountain['bigDirection']
  yuan: YuanLong
  yinYang: YinYang
}

const mountainSeeds: MountainSeed[] = [
  { key: 'nham', label: 'Nhâm', center: 345, bigDirection: 'bac', yuan: 'dia', yinYang: 'duong' },
  { key: 'ty', label: 'Tý', center: 0, bigDirection: 'bac', yuan: 'thien', yinYang: 'am' },
  { key: 'quy', label: 'Quý', center: 15, bigDirection: 'bac', yuan: 'nhan', yinYang: 'am' },
  { key: 'suu', label: 'Sửu', center: 30, bigDirection: 'dong-bac', yuan: 'dia', yinYang: 'am' },
  { key: 'can', label: 'Cấn', center: 45, bigDirection: 'dong-bac', yuan: 'thien', yinYang: 'duong' },
  { key: 'dan', label: 'Dần', center: 60, bigDirection: 'dong-bac', yuan: 'nhan', yinYang: 'duong' },
  { key: 'giap', label: 'Giáp', center: 75, bigDirection: 'dong', yuan: 'dia', yinYang: 'duong' },
  { key: 'mao', label: 'Mão', center: 90, bigDirection: 'dong', yuan: 'thien', yinYang: 'am' },
  { key: 'at', label: 'Ất', center: 105, bigDirection: 'dong', yuan: 'nhan', yinYang: 'am' },
  { key: 'thin', label: 'Thìn', center: 120, bigDirection: 'dong-nam', yuan: 'dia', yinYang: 'am' },
  { key: 'ton', label: 'Tốn', center: 135, bigDirection: 'dong-nam', yuan: 'thien', yinYang: 'duong' },
  { key: 'ti', label: 'Tỵ', center: 150, bigDirection: 'dong-nam', yuan: 'nhan', yinYang: 'duong' },
  { key: 'binh', label: 'Bính', center: 165, bigDirection: 'nam', yuan: 'dia', yinYang: 'duong' },
  { key: 'ngo', label: 'Ngọ', center: 180, bigDirection: 'nam', yuan: 'thien', yinYang: 'am' },
  { key: 'dinh', label: 'Đinh', center: 195, bigDirection: 'nam', yuan: 'nhan', yinYang: 'am' },
  { key: 'mui', label: 'Mùi', center: 210, bigDirection: 'tay-nam', yuan: 'dia', yinYang: 'am' },
  { key: 'khon', label: 'Khôn', center: 225, bigDirection: 'tay-nam', yuan: 'thien', yinYang: 'duong' },
  { key: 'than', label: 'Thân', center: 240, bigDirection: 'tay-nam', yuan: 'nhan', yinYang: 'duong' },
  { key: 'canh', label: 'Canh', center: 255, bigDirection: 'tay', yuan: 'dia', yinYang: 'duong' },
  { key: 'dau', label: 'Dậu', center: 270, bigDirection: 'tay', yuan: 'thien', yinYang: 'am' },
  { key: 'tan', label: 'Tân', center: 285, bigDirection: 'tay', yuan: 'nhan', yinYang: 'am' },
  { key: 'tuat', label: 'Tuất', center: 300, bigDirection: 'tay-bac', yuan: 'dia', yinYang: 'am' },
  { key: 'can-desc', label: 'Càn', center: 315, bigDirection: 'tay-bac', yuan: 'thien', yinYang: 'duong' },
  { key: 'hoi', label: 'Hợi', center: 330, bigDirection: 'tay-bac', yuan: 'nhan', yinYang: 'duong' },
]

const mountains: Mountain[] = mountainSeeds.map(seed => {
  const start = normalizeDeg(seed.center - 7.5)
  const end = normalizeDeg(seed.center + 7.5)
  return { ...seed, start, end }
})

export function computePeriod(year: number): PeriodInfo {
  const idx = Math.floor((year - 1864) / 20)
  const wrapped = ((idx % 9) + 9) % 9
  const period = wrapped + 1
  const startYear = 1864 + idx * 20
  const endYear = startYear + 19
  return { period, startYear, endYear }
}

function inRange(angle: number, start: number, end: number): boolean {
  const a = normalizeDeg(angle)
  const s = normalizeDeg(start)
  const e = normalizeDeg(end)
  if (s <= e) return a >= s && a < e
  return a >= s || a < e
}

export function findMountainByDeg(angle: number): Mountain {
  const a = normalizeDeg(angle)
  const found = mountains.find(m => inRange(a, m.start, m.end))
  return (found ?? mountains[1]) as Mountain
}

export function classifyDirection(angle: number): DirectionInfo {
  const mountain = findMountainByDeg(angle)
  const absDelta = Math.min(Math.abs(normalizeDeg(angle) - mountain.center), 360 - Math.abs(normalizeDeg(angle) - mountain.center))
  const tkvAnchors = Array.from({ length: 24 }, (_, i) => 7.5 + i * 15)
  const dkvAnchors = Array.from({ length: 8 }, (_, i) => 22.5 + i * 45)
  const nearest = (arr: number[]) =>
    Math.min(...arr.map(a => Math.min(Math.abs(normalizeDeg(angle) - a), 360 - Math.abs(normalizeDeg(angle) - a))))
  const dTkv = nearest(tkvAnchors)
  const dDkv = nearest(dkvAnchors)
  let kind: DirectionKind = 'chinh'
  if (absDelta > 3 && absDelta < 7) kind = 'kiem'
  else if (absDelta >= 7) kind = dDkv <= dTkv ? 'dai-khong-vong' : 'tieu-khong-vong'
  return { mountain, kind, delta: absDelta }
}

type Spin = 'thuan' | 'nghich'

function determineSpin(m: Mountain, seed: number): Spin {
  const even = seed % 2 === 0
  if (m.yuan === 'thien' || m.yuan === 'nhan') return even ? 'thuan' : 'nghich'
  return even ? 'nghich' : 'thuan'
}

// Thế Quái tinh giản: chỉ các sơn cần thế, còn lại "thế mà không thế"
const theQuaiMap: Record<string, number> = {
  giap: 1,
  than: 1,
  nham: 2,
  mao: 2,
  at: 2,
  ton: 6,
  ti: 6,
  suu: 7,
  can: 7,
  binh: 7,
  dinh: 9,
  canh: 9,
}

function applyTheQuai(seed: number, m: Mountain, kind: DirectionKind): number {
  if (kind !== 'kiem') return seed
  return theQuaiMap[m.key] ?? seed
}

type Coord = { row: number; col: number }
type BigDir = Mountain['bigDirection']

const palaceCoords: Record<BigDir | 'trung', Coord> = {
  'tay-bac': { row: 0, col: 0 },
  bac: { row: 0, col: 1 },
  'dong-bac': { row: 0, col: 2 },
  tay: { row: 1, col: 0 },
  trung: { row: 1, col: 1 },
  dong: { row: 1, col: 2 },
  'tay-nam': { row: 2, col: 0 },
  nam: { row: 2, col: 1 },
  'dong-nam': { row: 2, col: 2 },
}

const earthPalaceNumber: Record<BigDir | 'trung', number> = {
  'tay-bac': 6,
  bac: 1,
  'dong-bac': 8,
  tay: 7,
  trung: 5,
  dong: 3,
  'tay-nam': 2,
  nam: 9,
  'dong-nam': 4,
}

const flyOrderThuan: Coord[] = [
  { row: 0, col: 0 }, // Tây Bắc
  { row: 0, col: 1 }, // Bắc
  { row: 0, col: 2 }, // Đông Bắc
  { row: 1, col: 2 }, // Đông
  { row: 2, col: 2 }, // Đông Nam
  { row: 2, col: 1 }, // Nam
  { row: 2, col: 0 }, // Tây Nam
  { row: 1, col: 0 }, // Tây
]

function fly(seed: number, spin: Spin): BoardGrid {
  const grid: BoardGrid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  const setCell = (coord: Coord, value: number) => {
    grid[coord.row]![coord.col] = value
  }
  setCell({ row: 1, col: 1 }, seed)
  const order = spin === 'thuan' ? flyOrderThuan : [...flyOrderThuan].reverse()
  let current = seed
  order.forEach(pos => {
    current -= 1
    if (current === 0) current = 9
    setCell(pos, current)
  })
  return grid
}

export function phaseOfStar(period: number, star: number): Phase {
  if (star === period) return 'vuong'
  const next = period === 9 ? 1 : period + 1
  const next2 = period >= 8 ? period - 7 : period + 2
  const prev = period === 1 ? 9 : period - 1
  if (star === next) return 'sinh'
  if (star === next2) return 'tien'
  if (star === prev) return 'thoai'
  return 'tu'
}

const elementByStar: Record<number, ElementKind> = {
  1: 'thuy',
  2: 'tho',
  3: 'moc',
  4: 'moc',
  5: 'tho',
  6: 'kim',
  7: 'kim',
  8: 'tho',
  9: 'hoa',
}

export function elementRelation(a: number, b: number): string {
  const eA = elementByStar[a]
  const eB = elementByStar[b]
  if (!eA || !eB) return ''
  const cycle = { moc: 'hoa', hoa: 'tho', tho: 'kim', kim: 'thuy', thuy: 'moc' } as const
  const control = { moc: 'tho', tho: 'thuy', thuy: 'hoa', hoa: 'kim', kim: 'moc' } as const
  if (cycle[eA] === eB) return 'sinh'
  if (cycle[eB] === eA) return 'được sinh'
  if (control[eA] === eB) return 'khắc'
  if (control[eB] === eA) return 'bị khắc'
  return 'bình'
}

const pairLabels: Record<string, string> = {
  '2-3': 'Đấu Ngưu Sát (khẩu thiệt, kiện tụng)',
  '6-7': 'Thương/Giao Kiếm Sát (tai nạn, trộm cướp)',
  '3-7': 'Xuyên Tâm Sát (cãi cọ, kiện tụng)',
  '1-6': 'Thủy Tiên Thiên (tài lộc)',
  '2-7': 'Hỏa Tiên Thiên (bệnh tật)',
  '4-9': 'Kim Tiên Thiên (công danh)',
  '3-8': 'Mộc Tiên Thiên (tài lộc)',
  '6-9': 'Hỏa Thiêu Thiên Môn (huyết quang)',
  '2-5': 'Nhị Ngũ Hoàng (hung bệnh)',
}

function detectPairs(son: number, huong: number): string[] {
  const key = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`
  const pairs = [key(son, huong)]
  return pairs.flatMap(p => (pairLabels[p] ? [pairLabels[p]] : []))
}

const earthElementByNum: Record<number, ElementKind> = {
  1: 'thuy',
  2: 'tho',
  3: 'moc',
  4: 'moc',
  5: 'tho',
  6: 'kim',
  7: 'kim',
  8: 'tho',
  9: 'hoa',
}

function buildSet(
  periodInfo: PeriodInfo,
  face: DirectionInfo,
  sit: DirectionInfo,
  earthGrid: BoardGrid,
): { boards: BoardSet; cellMeta: CellMeta[] } {
  const vanBoard = fly(periodInfo.period, 'thuan')
  const facingCoord = palaceCoords[face.mountain.bigDirection] ?? palaceCoords.bac
  const sittingCoord = palaceCoords[sit.mountain.bigDirection] ?? palaceCoords.nam
  const seedHuongRaw = vanBoard[facingCoord.row]?.[facingCoord.col] ?? 0
  const seedSonRaw = vanBoard[sittingCoord.row]?.[sittingCoord.col] ?? 0
  const seedHuong = applyTheQuai(seedHuongRaw, face.mountain, face.kind)
  const seedSon = applyTheQuai(seedSonRaw, sit.mountain, sit.kind)
  const huongBoard = fly(seedHuong, determineSpin(face.mountain, seedHuongRaw))
  const sonBoard = fly(seedSon, determineSpin(sit.mountain, seedSonRaw))

  const cellMeta: CellMeta[] = Object.entries(palaceCoords)
    .filter(([key]) => key !== 'trung')
    .map(([key, coord]) => {
      const son = sonBoard[coord.row]?.[coord.col] ?? 0
      const huong = huongBoard[coord.row]?.[coord.col] ?? 0
      const van = vanBoard[coord.row]?.[coord.col] ?? 0
      const earth = earthGrid[coord.row]?.[coord.col] ?? 0
      return {
        key,
        label: key,
        coord,
        son,
        huong,
        van,
        earth,
        sonPhase: phaseOfStar(periodInfo.period, son),
        huongPhase: phaseOfStar(periodInfo.period, huong),
        sonElement: elementByStar[son],
        huongElement: elementByStar[huong],
        vanElement: elementByStar[van],
        earthElement: earthElementByNum[earth],
        relation: elementRelation(son, huong),
        pairs: detectPairs(son, huong),
      }
    })

  return { boards: { van: vanBoard, huong: huongBoard, son: sonBoard }, cellMeta }
}

function adjacentDirections(dir: BigDir): BigDir[] {
  const order: BigDir[] = ['bac', 'dong-bac', 'dong', 'dong-nam', 'nam', 'tay-nam', 'tay', 'tay-bac']
  const idx = order.indexOf(dir)
  if (idx < 0) return ['dong', 'tay']
  return [order[(idx - 1 + order.length) % order.length], order[(idx + 1) % order.length]]
}

function computeThanhMon(facing: DirectionInfo, period: number, boards: BoardSet): ThanhMonResult | null {
  const [leftDir, rightDir] = adjacentDirections(facing.mountain.bigDirection)
  const dirs = [leftDir, rightDir]
  for (const dir of dirs) {
    const coord = palaceCoords[dir]
    const earthDirNum = earthPalaceNumber[dir]
    const earthFacingNum = earthPalaceNumber[facing.mountain.bigDirection]
    const haDo = ['1-6', '2-7', '3-8', '4-9']
    const pairKey = `${Math.min(earthDirNum, earthFacingNum)}-${Math.max(earthDirNum, earthFacingNum)}`
    const loai: ThanhMonResult['loai'] = haDo.includes(pairKey) ? 'chinh' : 'phu'
    const seed = boards.van[coord.row][coord.col]
    const spin = determineSpin(findMountainByBigDir(dir), seed)
    const tmBoard = fly(seed, spin)
    const landed = tmBoard[coord.row][coord.col]
    if (landed === period) {
      return {
        viTri: dir,
        loai,
        cung: dir,
        note: `Vượng tinh ${period} đáo cung thành môn ${dir} (${loai === 'chinh' ? 'Hà Đồ cặp với hướng chính' : 'phụ'})`,
      }
    }
  }
  return null
}

function findMountainByBigDir(dir: BigDir): Mountain {
  return mountains.find(m => m.bigDirection === dir) ?? mountains[0]
}

export function buildBoards(year: number, facingDeg: number): BoardResult {
  const periodInfo = computePeriod(year)
  const facing = classifyDirection(facingDeg)
  const sitting = classifyDirection(facingDeg + 180)

  const warning =
    facing.kind === 'dai-khong-vong' || facing.kind === 'tieu-khong-vong'
      ? 'Hướng phạm Không Vong (≥7°), nên lập 2 tinh bàn và kiểm tra DKV/TKV.'
      : null

  const earthGrid: BoardGrid = [
    [earthPalaceNumber['tay-bac'], earthPalaceNumber.bac, earthPalaceNumber['dong-bac']],
    [earthPalaceNumber.tay, earthPalaceNumber.trung, earthPalaceNumber.dong],
    [earthPalaceNumber['tay-nam'], earthPalaceNumber.nam, earthPalaceNumber['dong-nam']],
  ]

  const primary = buildSet(periodInfo, facing, sitting, earthGrid)

  let alt: BoardResult['alt']
  if (facing.kind === 'dai-khong-vong' || facing.kind === 'tieu-khong-vong') {
    const idx = mountains.findIndex(m => m.key === facing.mountain.key)
    const next = mountains[(idx + 1 + mountains.length) % mountains.length]
    const prev = mountains[(idx - 1 + mountains.length) % mountains.length]
    const altFacingMountain =
      Math.abs(normalizeDeg(facingDeg - next.center)) < Math.abs(normalizeDeg(facingDeg - prev.center)) ? next : prev
    const altFacing: DirectionInfo = { mountain: altFacingMountain, kind: 'chinh', delta: 0 }
    const sitIdx = mountains.findIndex(m => m.key === sitting.mountain.key)
    const sNext = mountains[(sitIdx + 1 + mountains.length) % mountains.length]
    const sPrev = mountains[(sitIdx - 1 + mountains.length) % mountains.length]
    const altSitMountain =
      Math.abs(normalizeDeg(facingDeg + 180 - sNext.center)) < Math.abs(normalizeDeg(facingDeg + 180 - sPrev.center))
        ? sNext
        : sPrev
    const altSitting: DirectionInfo = { mountain: altSitMountain, kind: 'chinh', delta: 0 }
    const altSet = buildSet(periodInfo, altFacing, altSitting, earthGrid)
    alt = { facing: altFacing, sitting: altSitting, boards: altSet.boards, cellMeta: altSet.cellMeta }
  }

  return {
    periodInfo,
    facing,
    sitting,
    nonVoidType: facing.kind,
    warning,
    boards: primary.boards,
    earthGrid,
    cellMeta: primary.cellMeta,
    alt,
    thanhMon: computeThanhMon(facing, periodInfo.period, primary.boards),
  }
}
