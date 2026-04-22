import { loadStoredConfig, initGitHub, writeSession, hasToken, GitHubError } from './github.js';

const exercises = {
  ankle: [
    {
      name: "半跪姿踝背屈活动", sets: "2组 × 15次", badge: "5x/周",
      timerType: "reps", reps: 15, sets_n: 2,
      brief: "前腿半跪，膝盖过脚尖，感受踝前拉伸",
      setup: "右腿在前、左膝跪地的半跪姿。前脚掌完全平放地面，脚跟踩实；后腿膝盖在髋部正下方。双手放在前膝上辅助稳定。",
      steps: [
        "双手按在前膝（右膝）上",
        "前膝缓慢向前推，让膝盖越过脚尖方向",
        "感受踝关节前方（胫骨前侧）的\"打开\"感和跟腱拉伸",
        "停留1秒，然后膝盖收回起始位——这是1次 pump",
        "共做15次，然后换另一侧做15次"
      ],
      cues: [
        "脚跟始终不离地——脚跟一抬，拉伸立刻失效",
        "膝盖朝脚尖方向走，不要内扣或外翻",
        "上身保持直立，不要前倾或后仰",
        "正常范围：膝盖能推到脚尖前方 5–10cm"
      ],
      breath: "膝前推时呼气，回位时吸气"
    },
    {
      name: "双侧提踵", sets: "3组 × 10次", badge: "5x/周",
      timerType: "reps", reps: 10, sets_n: 3,
      brief: "扶椅背站立，踮起脚尖再慢慢落下",
      setup: "站在椅背或台面边可扶的位置，双脚与髋同宽，脚尖朝前。手扶支撑物仅作平衡，不借力向下压。",
      steps: [
        "脚掌向下推地作为发力起点",
        "缓慢踮起脚跟（2–3秒抬起）",
        "最高点保持1秒——顶住，感受小腿充血紧绷",
        "缓慢落下（2–3秒），脚跟轻触地面即止",
        "不要完全放松——保持\"持续张力\"效果翻倍"
      ],
      cues: [
        "膝盖全程伸直但不锁死",
        "脚踝不要向外倒（重心不要偏到小拇指侧）",
        "慢 > 快——速度越慢，小腿激活越深",
        "如果感觉太轻松：改做单腿版本，或手持5lb哑铃"
      ],
      breath: "抬起呼气，落下吸气"
    },
    {
      name: "足弓强化 Foot Dome", sets: "2组 × 10次", badge: "踝稳定",
      timerType: "reps", reps: 10, sets_n: 2,
      brief: "脚趾抓地，足弓主动向上\"拱起\"",
      setup: "站立在 Airex 软垫或折叠毛巾上（不稳定面效果更好）；赤脚最佳；体重均匀分布在两脚。",
      steps: [
        "脚趾保持在原地不动——这是这个动作的灵魂",
        "想象用脚心把地面\"吸\"起来——足弓主动向上拱",
        "大拇指根（第一跖骨头）必须保持贴地压实",
        "感受足弓下方形成一个小穹顶/拱门",
        "保持2秒后放松，完成1次"
      ],
      cues: [
        "脚趾不要卷起来！很多人会下意识屈趾，那是错的",
        "不是用蛮力，是激活足底深层小肌肉（足内在肌）",
        "做不出来时：先在坐姿下找感觉，感觉建立后再站起来",
        "成功标志：能清楚看到足弓下的空隙变大"
      ],
      breath: "上拱时呼气（激活更深层的核心联动）"
    },
    {
      name: "踝关节内外翻 AROM", sets: "2组 × 10次", badge: "活动度",
      timerType: "reps", reps: 10, sets_n: 2,
      brief: "仰卧，脚踝放泡沫轴上，脚尖转内转外",
      setup: "仰卧垫上，弯曲一侧膝盖（非训练腿）；训练侧腿伸直，小腿末端（跟腱上方）放在泡沫轴上，脚踝悬空——这样踝关节可以完全自由活动。",
      steps: [
        "脚尖先向内翻转到最大范围——像拧毛巾的方向",
        "感受踝关节外侧（腓骨长肌）在拉伸",
        "短暂停顿在极限位置",
        "脚尖再向外翻转到最大范围",
        "感受踝关节内侧（胫骨后肌）在拉伸",
        "一内一外算1次，共10次，换边"
      ],
      cues: [
        "只动踝关节——大腿和骨盆完全不动",
        "动作要慢，专注于活动度极限",
        "扭伤后若某方向有刺痛：减少那个方向的幅度，不要硬推",
        "目标：左右脚活动范围逐渐对称"
      ],
      breath: "自然呼吸，不要憋气"
    },
    {
      name: "弹力带踝背屈（半跪）", sets: "2组 × 10次", badge: "扭伤修复",
      timerType: "reps", reps: 10, sets_n: 2,
      brief: "半跪 + 弹力带套脚背，膝盖前推",
      setup: "弹力带一端固定在身后墙角或重物；弹力带套在踝关节前方（靠近脚背根部），张力调到有明显向后拉的感觉；进入半跪姿，训练腿在前。",
      steps: [
        "前脚掌完全平贴地面，脚跟踩实",
        "双手放在前膝上辅助稳定",
        "膝盖向前推过脚尖方向——弹力带会把胫骨向后拉",
        "感受踝关节前方\"打开\"的深层拉伸",
        "前后\"泵\"10次，换边"
      ],
      cues: [
        "脚跟压地！脚跟一抬就白做了",
        "弹力带的关键作用：把胫骨向后拉，让距骨\"滑进\"踝臼——比单纯拉伸有效得多",
        "正常活动度：膝盖能超过脚尖 10cm 以上",
        "这个动作对扭伤后踝背屈的恢复特别关键"
      ],
      breath: "向前推时呼气，回位吸气"
    },
    {
      name: "单腿站立平衡", sets: "3组 × 30秒", badge: "本体感觉",
      timerType: "hold", duration: 30, sets_n: 3,
      brief: "右腿单腿站，眼睛盯固定视觉锚点",
      setup: "赤脚或穿薄底鞋，站在稳定地板上；选择 1.5–2 米外一个固定的点作为视觉锚点；身旁留有椅背或墙面作为紧急扶手。",
      steps: [
        "右腿单腿站立，左脚离地约 10cm",
        "双手自然下垂或轻扶髋部",
        "脚趾主动抓地——想象脚趾像\"树根\"扎入地面",
        "感受脚踝的微小调整和震颤——这些都是对的",
        "保持30秒，然后换边"
      ],
      cues: [
        "视觉锚点不能动——这是平衡的基础",
        "膝盖微屈，不要锁死",
        "骨盆保持水平——不要让抬起侧的髋塌下去",
        "进阶路径：睁眼 → 闭眼 → 站软垫 → 加手臂摆动扰动"
      ],
      breath: "缓慢鼻吸鼻呼，不要憋气"
    },
    {
      name: "负重登箱 + 单腿90°悬停", sets: "3组 × 每侧15次", badge: "⭐ PT进阶",
      timerType: "reps", reps: 15, sets_n: 3,
      brief: "手持10lb哑铃 × 10\"跳箱 × 对侧腿屈髋90°悬停",
      variants: [
        { label: "Lv.1 · PT硬台阶", detail: "在PT gym踩坚硬台阶（你已跨过）" },
        { label: "Lv.2 · 10\"跳箱软面", detail: "你当前级别 · 跳箱表面有缓冲，需要更多踝稳定" },
        { label: "Lv.3 · 跳箱 + Airex垫", detail: "在跳箱上加软垫，本体感受挑战加倍" },
        { label: "Lv.4 · 哑铃加到15lb", detail: "负重递增，需要核心更强参与" },
      ],
      setup: "站在10\"跳箱前约一小步距离。双手各持10lb哑铃，自然垂于体侧。右脚完整踩上跳箱（脚掌90%以上接触），左脚保留在地面。",
      steps: [
        "【起步】右脚踩稳跳箱——脚趾和脚跟都压实",
        "【登上】用右腿臀部和股四头肌发力，把身体推上跳箱——不是靠左脚蹬地",
        "【悬停】登上后，左腿屈髋90°向前悬空——大腿与躯干成直角",
        "【稳定】⭐ 关键：保持右腿独立支撑2秒，骨盆水平，哑铃不晃",
        "【下放】左脚缓慢回落地面，身体跟着下降",
        "【换边】右脚离开跳箱回到起始——此为1次",
        "右侧15次完成后换左侧支撑，同样15次"
      ],
      cues: [
        "⭐ 右踝不能向外倒——脚踝中线与膝盖中线对齐",
        "⭐ 悬空瞬间观察骨盆：不能让悬空侧的髋掉下去（臀中肌测试）",
        "跳箱软面 vs PT硬台阶：软面让踝关节需要更多微调，所以虽然同样15次，难度其实进阶了",
        "哑铃别代偿——如果用手臂摆动找平衡，说明核心松了",
        "第二组后可加变式：登箱后直接做单腿RDL（见下个动作）"
      ],
      breath: "登上时呼气（发力），悬停时自然呼吸，下放时吸气"
    },
    {
      name: "单腿 RDL 触箱变式", sets: "可选 × 每侧10次", badge: "⭐ 髋铰链",
      timerType: "reps", reps: 10, sets_n: 2,
      brief: "跳箱上单腿支撑，哑铃下放触跳箱表面",
      setup: "前一个动作的延续——站在10\"跳箱上，右腿单腿支撑（膝微屈）。双手各持10lb哑铃自然下垂。左腿向后自然延伸准备。",
      steps: [
        "【起始】右腿单腿站在跳箱上，左腿自然悬于身后",
        "【下放】身体向前倾，同时左腿向后抬——像一个「T字」",
        "【铰链】重点是髋铰链——屁股向后推，不是弯腰",
        "【触箱】哑铃缓慢下放触碰跳箱表面——这是目标低点",
        "【感受】右腿腘绳肌和臀部应有明显拉伸感",
        "【起身】臀部向前顶，站直回到起始——此为1次",
        "右侧10次后换左侧支撑"
      ],
      cues: [
        "⭐ 髋铰链 vs 弯腰：想象屁股向后去关一扇门——这才是髋铰链",
        "⭐ 支撑腿膝盖保持微屈——不要锁死",
        "脊柱全程保持中立，不要含胸驼背",
        "后抬腿和躯干成一条直线——不要乱晃",
        "做完登箱 + 悬停后，这个动作能把同样的支撑腿推到力竭——一石二鸟"
      ],
      breath: "下放时吸气，起身时呼气"
    },
  ],
  spine: [
    {
      name: "猫牛式", sets: "2组 × 40秒", badge: "脊柱热身",
      timerType: "hold", duration: 40, sets_n: 2,
      brief: "四足跪，配合呼吸做脊柱前后流动",
      setup: "四足跪姿：双手撑地在肩膀正下方，十指张开分散压力；双膝在髋关节正下方；小腿平放、脚背贴地。",
      steps: [
        "起始位：脊柱自然中立",
        "【牛式】吸气时：腹部下沉，尾骨上翘，抬头看前上方——整条脊柱像下沉的 U",
        "【猫式】呼气时：拱背、低头看肚脐，尾骨内卷——整条脊柱像拱起的桥",
        "随呼吸节奏慢流动——每次呼吸1个完整循环"
      ],
      cues: [
        "手不要打滑——指节和指尖都用力抓地",
        "不是快速前后甩动，而是每一节椎骨逐一卷动",
        "感受：胸椎是不是比腰椎更\"难动\"？那就是你的限制",
        "颈椎跟着走：牛式抬头、猫式低头"
      ],
      breath: "牛式吸气 · 猫式呼气——严格配合"
    },
    {
      name: "跪姿胸椎旋转", sets: "3组 × 每侧8次", badge: "⭐ 胸椎核心",
      timerType: "reps", reps: 8, sets_n: 3,
      brief: "四足跪 + 单手抱头，手肘画半圆",
      setup: "进入四足跪姿：双手在肩正下方，双膝在髋正下方。以训练右侧为例：右手离开地面、掌心贴后脑勺，右肘关节自然向外张开——像在做\"我思考\"的姿势。这就是起始位。",
      steps: [
        "起始：四足跪姿 + 右手放脑后，右肘向外指",
        "【向下】保持左手撑地、骨盆不动；右肘开始向下、向内旋转——目标让右肘尖去\"碰\"左手手腕内侧",
        "此时身体向左扭转，感受右侧胸廓和肩胛被挤压",
        "【向上】然后反向：右肘向外、向上旋转，最终指向天花板",
        "整个胸廓打开，感受右侧胸椎扭转到最大——眼睛全程跟着右肘看",
        "最高点保持3秒，配合呼气让胸椎再多打开一点",
        "缓慢回到起始，算1次。每侧8次（右侧多做2次、停留5秒）"
      ],
      cues: [
        "⭐ 最关键：只转胸椎、不转腰椎——想象腰被\"冻结\"。如果感到腰在扭，说明骨盆动了，减少幅度",
        "⭐ 骨盆水平：想象骨盆上放了一杯水，整个过程不能洒出来",
        "⭐ 手肘引导：视觉聚焦在肘尖，肩膀只是跟随——不要用肩膀主动发力",
        "手不能离开头——肘与躯干的相对角度全程保持",
        "右侧（你的弱侧）：做10次、每次停留5秒——而不是标准的8次×3秒"
      ],
      breath: "肘向上旋转时呼气——呼气时肋骨笼缩小，能多争取 5–10 度旋转角度"
    },
    {
      name: "猫牛侧屈变式", sets: "2组 × 每侧8次", badge: "侧链",
      timerType: "reps", reps: 8, sets_n: 2,
      brief: "四足跪，脊柱向一侧弯成香蕉形",
      setup: "四足跪姿起始，与猫牛式相同；这次不做前后方向，而是把脊柱向侧面弯曲。",
      steps: [
        "起始位：稳定的四足跪",
        "呼气时，整条脊柱向右弯曲——右肋挤压向右髋",
        "同时眼睛看向右侧脚跟（头也跟着转过去）",
        "身体形成一个侧向的 C 或香蕉形",
        "保持1–2秒，感受左侧腰部和肋间充分延长",
        "吸气时回到中立，换边——左右各算1次"
      ],
      cues: [
        "整条脊柱均匀弯曲，不是只在腰部弯",
        "骨盆保持水平——不要让一侧塌下去",
        "发现哪侧更紧？在那一侧多停留 2 个呼吸周期",
        "对你而言：右侧通常更紧（胸椎旋转受限那侧）"
      ],
      breath: "呼气时加深弯曲，吸气时把气\"吸向\"拉长的那一侧"
    },
    {
      name: "泡沫轴胸椎伸展", sets: "3组 × 30秒", badge: "T4–T8",
      timerType: "hold", duration: 30, sets_n: 3,
      brief: "泡沫轴横放胸背下，向后伸展打开胸椎",
      setup: "泡沫轴横放地板；仰卧使泡沫轴在肩胛骨下缘（T8–T12 之间）位置；双脚踩地、膝盖弯曲；双手抱头、肘关节并拢向上指（支撑颈椎）。",
      steps: [
        "起始位：臀部在地，泡沫轴在背中部",
        "缓慢让上半身向后弯——胸椎以泡沫轴为支点向后伸展",
        "感受胸椎被\"拗\"开、肋骨笼打开",
        "伸展到舒适极限时保持5秒——不要挤压腰椎！",
        "慢慢起身回到起始位",
        "每组结束后移动泡沫轴位置：下段（T10–T12）→ 中段（T7–T9）→ 上段（T4–T6）"
      ],
      cues: [
        "⭐ 每次泡沫轴只能活动 3–4 节胸椎，所以必须换位置",
        "腰不能参与——感觉腰在压就是错了，用手撑一下臀部",
        "头不要后仰过度——颈椎也不要\"挤\"到泡沫轴上",
        "做完立刻测试旋转角度——通常会立即增加 5–10 度"
      ],
      breath: "向后伸展时呼气，回位吸气"
    },
    {
      name: "髋屈肌拉伸（弓步）", sets: "每侧 × 30秒", badge: "髋链",
      timerType: "hold", duration: 30, sets_n: 3,
      brief: "低弓步，骨盆像\"抽屉\"向前滑",
      setup: "低弓步：右腿在前，膝盖弯 90度；左膝跪地在髋后方，左小腿平放；前脚与后膝距离约 50–60cm；上身直立，双手放前膝或轻扶髋部。",
      steps: [
        "稳定下身——前脚踩实、后膝不滑动",
        "骨盆缓慢向前推——不是上身前倾，是骨盆像抽屉向前滑",
        "同时尾骨内卷（臀部向下收）",
        "感受左侧前髋（髂腰肌 Psoas 区域）的深层拉伸",
        "保持30秒，换边"
      ],
      cues: [
        "⭐ 骨盆前推 + 尾骨内卷要同时做——这是关键组合",
        "如果感觉腰酸：说明你在塌腰代偿，立即收紧核心",
        "上身始终直立——不要前倾身体",
        "进阶：前推时同侧手臂向上伸展，增加侧链拉伸"
      ],
      breath: "持续深呼吸，每次呼气时让髋再往前推一点点"
    },
    {
      name: "90/90 髋关节拉伸", sets: "每侧 × 45秒", badge: "髋灵活",
      timerType: "hold", duration: 45, sets_n: 2,
      brief: "坐姿，两腿各成90度，身体前倾",
      setup: "坐在垫子上：右腿在前，屈膝90度、小腿朝前（像瑜伽坐姿）；左腿在后，屈膝90度、小腿朝侧面；双手撑地辅助。前腿大腿外侧应贴地。",
      steps: [
        "调整姿势：骨盆水平，两个坐骨都触地",
        "双手放在前腿前方地面支撑",
        "上身缓慢向前倾，沿着前腿方向压下去",
        "感受前腿臀部（臀中肌、梨状肌）的深层拉伸",
        "保持45秒，调整腿的位置换边"
      ],
      cues: [
        "⭐ 核心：保持骨盆水平——不能让后侧屁股抬起",
        "如果前腿膝盖或髋外侧疼：减少前倾幅度，不要硬压",
        "进阶：用肘支撑深度前倾",
        "同时也能拉伸到后腿内侧的髋屈肌"
      ],
      breath: "每次呼气时加深前倾"
    },
  ],
  upper: [
    {
      name: "Active Hang 主动悬挂", sets: "6组 × 20秒", badge: "右肩修复",
      timerType: "hold", duration: 20, sets_n: 6,
      brief: "主动下沉肩胛骨、背阔肌撑住（不是被动挂）",
      variants: [
        { label: "Lv.1 · 脚尖踩跳箱", detail: "你当前级别 · 卸掉大部分体重，脚尖在跳箱上辅助承重" },
        { label: "Lv.2 · 弹力带辅助", detail: "粗弹力带套在单杠上，单脚踩弹力带，减重约 50–70%" },
        { label: "Lv.3 · 完全悬空", detail: "双脚离地，承担全部体重——中期目标" },
        { label: "Lv.4 · 单臂主动悬挂", detail: "单臂主导，另一手轻握——长期目标" },
      ],
      setup: "站在单杠正下方；双手与肩同宽，正握（掌心朝前）。根据当前级别选择承重方式：Lv.1 脚尖轻踩跳箱、Lv.2 踩弹力带、Lv.3 完全悬空。",
      steps: [
        "握杠后，身体先呈\"被动悬挂\"状态——肩膀耸到耳朵那里（感受一下这是错的状态）",
        "⭐【关键动作】用背阔肌主动\"下拉\"——肩胛骨向下、向后滑动",
        "结果：肩膀离开耳朵，胸廓向上抬起，身体整体\"升高\"1–2cm",
        "保持这个姿态 20秒——整个过程都是肩胛骨主动\"挂住\"身体",
        "完成后休息，重复6组"
      ],
      cues: [
        "⭐ 被动 vs 主动的区别：被动=肩膀耸到耳朵；主动=肩胛下沉、胸挺起",
        "【右肩警戒】如果有疼痛或明显弹响——立刻停止。压力感、酸胀感是对的",
        "【进阶时机】Lv.1 能稳定做足 6组×20s 后，尝试 Lv.2",
        "【最常见错误】手紧握但肩膀完全放松——这反而加重肩峰撞击",
        "目的：为右肩关节腔撑开空间，给冈上肌创造减压时间"
      ],
      breath: "均匀鼻吸鼻呼，不要憋气"
    },
    {
      name: "肩袖外旋激活（弹力带）", sets: "3组 × 15次", badge: "右肩",
      timerType: "reps", reps: 15, sets_n: 3,
      brief: "肘贴身侧，前臂像开门一样向外旋",
      setup: "弹力带一端固定在门把手或重物上（与肘同高）；站立侧对固定点，训练侧手握弹力带；肘关节屈曲90度、紧贴身侧肋骨——可以在腋下夹一条毛巾保持肘不离身。",
      steps: [
        "起始位：前臂横在身前，手指朝向固定点方向",
        "⭐ 保持肘贴身（毛巾不能掉）",
        "前臂缓慢向外旋转——像开门那样",
        "感受后肩胛（冈下肌、小圆肌）在发力",
        "到达最大外旋时短暂停顿",
        "缓慢回到起始位，1次完成。共15次，换边"
      ],
      cues: [
        "⭐ 肘必须全程贴身——毛巾不能掉",
        "动作要慢：2秒外旋、2秒回位",
        "不要耸肩——保持肩膀下沉",
        "感受点应在肩胛骨后面（冈下肌区域），而不是手臂外侧"
      ],
      breath: "外旋时呼气，回位吸气"
    },
    {
      name: "鸟狗式 Bird Dog", sets: "3组 × 每侧10次", badge: "核心链",
      timerType: "reps", reps: 10, sets_n: 3,
      brief: "四足跪，对侧手脚同时伸直成一线",
      setup: "四足跪姿：双手在肩正下方，双膝在髋正下方；脊柱中立（不塌腰不拱背）；核心激活——肚脐\"拉向\"脊柱。",
      steps: [
        "起始位：稳定的四足跪",
        "同时抬起：右手向前伸直（与地面平行）+ 左腿向后伸直（与地面平行）",
        "手脚都伸到最长，形成指尖到脚跟的一条直线",
        "⭐ 脊柱保持绝对中立——不要旋转、不要塌腰",
        "保持1秒，然后慢慢收回；换对侧（左手 + 右腿）",
        "左右各一次算1次，每侧10次"
      ],
      cues: [
        "⭐ 骨盆不能旋转——想象骨盆上有一杯水",
        "⭐ 核心全程收紧防塌腰",
        "抬腿不要超过水平——高过水平会拱腰",
        "手脚伸直但肘膝微微不锁死",
        "进阶：手肘和对侧膝盖在身下相碰后再次伸展"
      ],
      breath: "伸展时呼气，回位吸气"
    },
    {
      name: "KB / 哑铃地板推", sets: "4组 × 8次（15lb）", badge: "⭐ 推力链",
      timerType: "reps", reps: 8, sets_n: 4,
      brief: "仰卧地板推，3秒离心下放",
      setup: "仰卧在地板上（不是卧推凳——这是重点）；双膝弯曲、双脚踩地；双手持15lb哑铃，起始位举在胸部正上方、手臂伸直但肘微屈。",
      steps: [
        "吸气，开始缓慢下放——数3秒（离心阶段）",
        "肘关节下放时向外打开约 45 度角（不要完全贴身）",
        "肘关节碰到地板时——这就是底部，地板限制你继续向下、保护肩关节",
        "短暂停顿，不反弹",
        "呼气发力推起——推起阶段可以快一些（1–2秒）",
        "顶部伸直但不锁肘，1次完成。共8次/组，4组"
      ],
      cues: [
        "⭐ 右肩关键：地板的作用是限制肩关节外展——这是你现在最安全的推力入口",
        "⭐ 离心控制：3秒下放——重建神经通路的核心",
        "肘角度约 45 度（不是90度贴身，也不是完全垂直）",
        "如果右肩有疼痛：减重到 10lb，继续做离心控制",
        "进阶指标：能稳定做 4组×8次 @ 15lb 后，加到 20lb"
      ],
      breath: "下放吸气，推起呼气"
    },
    {
      name: "胸椎旋转整合（站姿）", sets: "3组 × 每侧10次", badge: "整合",
      timerType: "reps", reps: 10, sets_n: 3,
      brief: "十字站姿，上身像风车一样旋转",
      setup: "站立，双脚与髋同宽；膝盖微屈；核心激活；双臂水平向两侧展开（呈十字）；肩膀下沉、不耸起。",
      steps: [
        "起始位：十字站姿",
        "⭐ 骨盆和双腿完全锁定——不能动",
        "上半身缓慢向右旋转——旋转来自胸椎和肩胛带",
        "双臂跟随身体旋转，但不主动发力",
        "旋转到最大时，眼睛跟着向右看到身后",
        "慢慢回到中立，然后向左旋转——左右各一次算1次",
        "每侧10次，共3组"
      ],
      cues: [
        "⭐ 只动胸椎，不动骨盆——可以对着镜子观察髋部是否保持不动",
        "想象：下半身是\"支柱\"，上半身是\"风车\"",
        "整合了之前所有胸椎激活的成果",
        "动作节奏：控制性慢速，不要用惯性甩"
      ],
      breath: "旋转时呼气，回位吸气"
    },
  ]
};

const rewards = [
  { cat: "anatomy", name_en: "Peroneus Longus", name_zh: "腓骨长肌", category: "踝关节外翻 · 足弓支撑", body: "走行于小腿外侧，肌腱绕过外踝后方，穿越足底止于第一跖骨基底。是踝关节外翻和纵向足弓支撑的关键——长期薄弱会导致\"反复扭伤\"循环。✦ 关联你当下的右踝修复：弹力带抗阻外翻正是针对它。" },
  { cat: "anatomy", name_en: "Vastus Medialis Obliquus (VMO)", name_zh: "股内侧斜肌", category: "膝关节内侧 · 髌骨轨迹控制", body: "大腿内侧那块\"泪滴形\"的肌肉。任何膝关节损伤后，它是第一个萎缩的肌肉，也是最后一个自然恢复的。髌骨轨迹偏移的根源几乎都在这里。✦ 激活方式：深蹲最后15度的主动挤压。" },
  { cat: "anatomy", name_en: "Serratus Anterior", name_zh: "前锯肌", category: "肩胛稳定 · 拳击手的肌肉", body: "俗称\"拳击手肌\"——出拳伸展时让肩胛骨前推的动力源。薄弱会导致\"翼状肩胛\"和肩峰撞击综合征。你做 Active Hang 的核心激活对象，也是修复右肩的隐形主角。" },
  { cat: "anatomy", name_en: "Multifidus", name_zh: "多裂肌", category: "脊柱深层稳定 · 节段控制", body: "脊柱最深层的分段稳定肌，每一节只跨2-4节椎体。下背痛发作后24小时内就开始萎缩，而且——不会自动恢复。必须通过专项激活（如鸟狗式）重新\"唤醒\"。" },
  { cat: "anatomy", name_en: "Transverse Abdominis (TvA)", name_zh: "腹横肌", category: "核心最深层 · 天然紧身衣", body: "腹部最深的那层肌肉，呈水平方向环绕躯干。正常情况下它会在任何肢体动作发生前30毫秒预先激活——像个内置的保险带。你的360°腹式呼吸训练的正是它。" },
  { cat: "anatomy", name_en: "Gluteus Medius", name_zh: "臀中肌", category: "单腿稳定 · 骨盆水平", body: "骨盆侧面的\"水平仪\"。每次单腿支撑（走路、跑步、单腿 RDL）都靠它维持骨盆不塌。薄弱会层层传导到膝外翻、踝内翻——你的右踝问题上游，它脱不了干系。" },
  { cat: "anatomy", name_en: "Piriformis", name_zh: "梨状肌", category: "髋外旋 · 坐骨神经近邻", body: "髋关节深层外旋肌。坐骨神经从它下方（或穿越而过，15%人群）通过——这就是为什么\"梨状肌综合征\"会被误诊成椎间盘突出。久坐人群的隐形杀手。" },
  { cat: "anatomy", name_en: "Psoas Major", name_zh: "腰大肌", category: "髋屈肌 · 脊柱-腿唯一连接", body: "唯一一条直接连接脊柱和股骨的肌肉。久坐会让它持续缩短，拉扯腰椎形成前倾。在身心疗法里它被称为\"灵魂肌肉\"——紧张焦虑时会下意识收缩。" },
  { cat: "anatomy", name_en: "Rotator Cuff · SITS", name_zh: "肩袖 · 冈上/冈下/小圆/肩胛下肌", category: "肩盂动态稳定 · 四人团队", body: "四块肌肉组成的动态稳定环。冈上肌（Supraspinatus）穿过肩峰下狭窄空间，是最常撕裂的一块——也是你右肩\"撞击综合征\"的受害者。Active Hang 为它创造减压空间。" },
  { cat: "anatomy", name_en: "Gastrocnemius vs Soleus", name_zh: "腓肠肌 vs 比目鱼肌", category: "小腿双肌 · 不同战场", body: "两块都是小腿后侧肌肉，但功能分工截然不同：腓肠肌跨过膝关节，快肌纤维主导，负责跳跃爆发；比目鱼肌不跨膝，慢肌纤维主导，负责站立姿势维持。拉伸必须分别做：直腿 vs 屈腿。" },
  { cat: "anatomy", name_en: "Tibialis Anterior", name_zh: "胫骨前肌", category: "踝背屈 · 小腿前侧", body: "小腿前侧那条一运动就鼓起的肌肉。负责踝背屈（脚尖上抬）。薄弱会导致\"拍地步态\"（foot slap）和胫前疼痛（shin splints）。你 HEP 里的踝背屈活动动作，它是主角。" },
  { cat: "anatomy", name_en: "Quadratus Lumborum (QL)", name_zh: "腰方肌", category: "侧链稳定 · 低腰痛惯犯", body: "腰部两侧的\"单侧提髋肌\"，连接髂嵴和第12肋。一侧紧张会造成骨盆侧倾、长短腿错觉。久坐 + 单侧背包习惯的人，它几乎永远是紧的。" },
  { cat: "anatomy", name_en: "Thoracolumbar Fascia", name_zh: "胸腰筋膜", category: "背部菱形筋膜 · 力量中转站", body: "腰背部那块巨大的菱形筋膜，把对侧肩膀和对侧髋关节连成一条\"后斜吊索\"（Posterior Oblique Sling）。跑步、投掷、挥拍的力量都靠它斜向传递。" },
  { cat: "anatomy", name_en: "Achilles Tendon", name_zh: "跟腱", category: "最强肌腱 · 最弱血供", body: "人体最强的肌腱，跑步时承受10倍体重的冲击。但它的血液供应很差——损伤后要6-12个月才能愈合。名字来自希腊英雄阿基里斯，他的唯一弱点。" },
  { cat: "anatomy", name_en: "Golgi Tendon Organ (GTO)", name_zh: "高尔基腱器", category: "腱内张力感受器", body: "埋在肌腱里的\"张力传感器\"。当它感知到持续张力，会触发\"自源性抑制\"——让肌肉主动放松。这就是为什么静态拉伸要保持30秒以上——前10秒都在\"说服\"GTO。" },
  { cat: "anatomy", name_en: "Muscle Spindle", name_zh: "肌梭", category: "拉伸感受器 · 弹振反射", body: "埋在肌纤维中的\"拉伸速度感应器\"。突然快速拉伸会触发保护性收缩反射（牵张反射）——这就是为什么弹振式拉伸（bouncing）反而让肌肉更紧。慢 > 快。" },
  { cat: "anatomy", name_en: "Proprioception", name_zh: "本体感觉", category: "关节位置感 · 内置GPS", body: "关节囊、韧带、肌腱里的机械感受器提供的空间感知。踝关节扭伤会损伤这些感受器——这就是为什么\"扭过的踝\"即使力量恢复后仍然觉得\"不稳\"。平衡训练（闭眼单腿站）就是在重建这张GPS地图。" },
  { cat: "anatomy", name_en: "DOMS · Delayed Onset Muscle Soreness", name_zh: "延迟性肌肉酸痛", category: "训练后24-72h", body: "训练后第二天最酸。成因是离心收缩造成的肌纤维微撕裂 + 炎症反应——和乳酸一毛钱关系都没有。\"乳酸堆积导致酸痛\"这个说法在1980年代已被证伪。" },
  { cat: "anatomy", name_en: "Myonuclei · Muscle Memory", name_zh: "肌核 · 肌肉记忆", category: "训练的永久馈赠", body: "训练时肌纤维会吸收额外的\"肌核\"——即使几个月不练肌肉萎缩，这些肌核依然保留。重新训练时肌肉增长会远快于从零开始。一旦建造过，永远更容易重建。" },
  { cat: "anatomy", name_en: "Wolff's Law", name_zh: "沃尔夫定律", category: "骨骼重塑原理", body: "1892年德国解剖学家Wolff提出：骨骼会沿着受力方向重塑加密。7天制动（打石膏）= 1-2%骨密度流失。反之，负重训练会让骨骼在承重线上变厚——这就是为什么\"动\"本身就是骨骼的营养。" },
  { cat: "anatomy", name_en: "Scapulohumeral Rhythm", name_zh: "肩肱节律", category: "手臂上举 · 2:1黄金比", body: "手臂向上抬的每3度动作中，肱骨贡献2度、肩胛骨贡献1度。这个比例一旦被打破（比如肩胛不动只靠肱骨），肩峰下空间会被挤压 → 导致撞击综合征。你右肩的故事就写在这个节律里。" },
  { cat: "anatomy", name_en: "Fascial Lines · Thomas Myers", name_zh: "筋膜链 · 解剖列车", body: "Thomas Myers 提出的12条肌筋膜连线。\"浅背线\"（Superficial Back Line）从额头开始，经后颈、脊柱、腘绳肌，一直连到脚底——所以腘绳肌紧绷真的可以通过牵拉眉弓筋膜而松解。" },

  { cat: "quote_en", category: "Marcus Aurelius · Meditations", quote_en: "The impediment to action advances action. What stands in the way becomes the way.", body: "挡在路上的，就是那条路。右脚踝的这次伤，正在把你带向更完整的身体地图。" },
  { cat: "quote_en", category: "Rumi · 13世纪波斯诗人", quote_en: "The wound is the place\nwhere the Light enters you.", body: "伤口，正是光照进身体的地方。" },
  { cat: "quote_en", category: "Hemingway · 永别了武器", quote_en: "The world breaks everyone, and afterward, many are strong at the broken places.", body: "世界总会击垮每个人。但之后，许多人恰恰在破碎之处变得更强。" },
  { cat: "quote_en", category: "Albert Camus · 反抗者", quote_en: "In the depth of winter, I finally learned that within me there lay an invincible summer.", body: "在严冬的深处我终于发现——我心中藏着一个无法战胜的夏天。" },
  { cat: "quote_en", category: "Leonard Cohen · Anthem", quote_en: "There is a crack in everything.\nThat's how the light gets in.", body: "万物皆有裂缝，那是光照进来的方式。" },
  { cat: "quote_en", category: "Seneca · 书信集", quote_en: "We suffer more often in imagination than in reality.", body: "我们在想象中承受的痛苦，远远多于现实。今天你走过来了。" },
  { cat: "quote_en", category: "Epictetus · Enchiridion", quote_en: "It's not what happens to you, but how you react to it that matters.", body: "发生什么并不重要，重要的是你如何回应。扭伤发生了，你选择了康复。" },
  { cat: "quote_en", category: "Thoreau · 瓦尔登湖", quote_en: "Go confidently in the direction of your dreams. Live the life you have imagined.", body: "朝你梦想的方向自信前行。你想成为的样子，正被今天的你一点点塑造。" },
  { cat: "quote_en", category: "Nietzsche · 查拉图斯特拉如是说", quote_en: "One must still have chaos in oneself to give birth to a dancing star.", body: "一个人必须内心还有混沌，才能生出一颗会舞蹈的星星。" },
  { cat: "quote_en", category: "Emerson", quote_en: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", body: "身后之事与前路之事都微不足道，与你内在所藏相比。" },

  { cat: "monument", category: "🏯 敦煌莫高窟 · 公元366年", body: "735个洞窟中最古老的那座，凿于公元366年——也就是罗马帝国还未分裂时。窟内飞天壁画超过4500身，没有任何两身的姿势或飘带完全相同。" },
  { cat: "monument", category: "🗿 复活节岛 · 摩艾石像", body: "岛上的887尊石像并不是都面朝大海——几乎所有都面朝内陆，凝视着村庄。它们不是守望外敌，而是守护族人。" },
  { cat: "monument", category: "🏛 罗马万神殿 · 公元125年", body: "这个直径43.3米的混凝土穹顶，两千年来一直是世界上最大的无钢筋混凝土穹顶。古罗马人用浮石（火山岩）做顶部材料，让穹顶向上越来越轻。" },
  { cat: "monument", category: "🧱 秦始皇兵马俑", body: "最初每个士兵都有彩绘——甲片是朱砂红、面庞是粉色、眼睛是黑色。但颜料接触空气后会在15秒内氧化脱落。考古学家后来研发了保湿保护技术才保住了新出土的色彩。" },
  { cat: "monument", category: "🗻 秘鲁 · Machu Picchu", body: "海拔2430米。印加人用\"干砌法\"建造，石块之间连一张纸都塞不进。令人惊叹的是，整座城市完全没有车轮和铁器的参与。" },
  { cat: "monument", category: "🕋 约旦 · Petra 佩特拉", body: "那座标志性的\"宝藏殿\"（Treasury）正面雕刻进岩石，但内部其实是空的——它是一座陵墓。纳巴泰人通过精妙的水利系统让这座沙漠城市养活了两万人。" },
  { cat: "monument", category: "🏯 京都 · 清水寺", body: "整座木结构舞台伸出山崖，由139根巨大的榉木柱子支撑，全程没有使用一根钉子。这座建筑历经17次火灾后重建，当前结构已屹立近400年。" },
  { cat: "monument", category: "⛩ 西藏 · 布达拉宫", body: "海拔3700米，由红宫和白宫构成。宫殿的地基是被夯实的阿嘎土（一种当地特有的黏土），据说混入了藏红花和牛奶，硬度至今难以复制。" },
  { cat: "monument", category: "🔺 埃及金字塔", body: "胡夫金字塔的建造者并非奴隶，而是受人尊敬的工匠。考古学家在他们的营地发现了食物配给记录：每天4.5公斤面包、2罐啤酒、大量牛肉。" },
  { cat: "monument", category: "🪨 英国 · Stonehenge", body: "中心的蓝石重达4吨，来自250公里外的威尔士普雷塞利山。新石器时代的人是如何将这些石头运过大半个不列颠岛的，至今仍是谜。" },
  { cat: "monument", category: "🏯 紫禁城 · 1406年", body: "传说共有9999间半房间——因为天上玉皇大帝的宫殿有10000间，人间帝王不能超过。实际统计是8886间，但\"九千九百九十九间半\"的传说流传至今。" },
  { cat: "monument", category: "🕌 印度 · 泰姬陵", body: "白色大理石会在不同时辰呈现不同色彩：清晨粉红、正午纯白、月下金色。建造它的沙贾汗后来被儿子囚禁，只能从阿格拉堡的窗口远望妻子的陵墓。" },

  { cat: "nature", category: "🐙 章鱼 · Octopus", body: "拥有三颗心脏和蓝色的血液（以铜为基础的血蓝蛋白，而非铁）。更惊人的是：它身上2/3的神经元分布在八条腕足里，每条腕都能独立\"思考\"、决策，甚至在与本体分离后还能捕食。" },
  { cat: "nature", category: "🦠 水熊虫 · Tardigrade", body: "体长0.5毫米的小生物。能在以下环境存活：150°C高温、-272°C接近绝对零度、10倍致死剂量辐射、太空真空、30年无水。2019年以色列月球探测器坠毁时，一批水熊虫被散落在月球表面——它们可能还活着。" },
  { cat: "nature", category: "🦈 格陵兰鲨 · Greenland Shark", body: "地球上最长寿的脊椎动物。2016年研究显示一只格陵兰鲨已存活400年——它出生时莎士比亚还活着。更慢的是：它们要到150岁才能达到性成熟。" },
  { cat: "nature", category: "🍄 菌丝网络 · Mycelium Web", body: "森林地下的真菌网络（菌根）连接着几乎所有树木。健康的大树会通过真菌\"互联网\"向生病的邻居输送糖分和营养——科学家称之为\"树木互联网\"（Wood Wide Web），1997年才首次测绘。" },
  { cat: "nature", category: "🌊 波多黎各 · 生物发光海湾", body: "Mosquito Bay 拥有地球上最高浓度的发光甲藻（每加仑70万只）。任何搅动都会引发蓝绿色光浪——划过的桨、跃起的鱼、你的手指。晴夜从国际空间站能看见海湾的光晕。" },
  { cat: "nature", category: "🌳 银杏 · Ginkgo biloba", body: "2亿7千万年前就已存在的活化石，侏罗纪恐龙吃过的植物。1945年广岛原子弹爆炸中心2公里内，6棵银杏树在一片焦土中独自存活，次年春天重新发芽。它们至今还活着。" },
  { cat: "nature", category: "🌲 海岸红杉 · Coast Redwood", body: "地球上最高的树，可达115米、活3000年以上。它们通过针叶从海岸雾气中直接吸水——一棵红杉的树顶可以生机勃勃，而根部土壤完全干旱。雾气贡献了它40%的年水量。" },
  { cat: "nature", category: "🦀 雀尾螳螂虾 · Mantis Shrimp", body: "拥有16种色彩感受器（人类只有3种），能看到紫外线和偏振光。出拳速度达23米/秒——相当于子弹初速的1/10，在水中制造\"空化气泡\"，瞬间产生4700°C高温和声波。" },
  { cat: "nature", category: "🕊 北极燕鸥 · Arctic Tern", body: "每年在北极和南极之间往返70000公里——相当于地球周长的1.75倍。一生的飞行距离等于往返月球3次。因为追逐两个夏天，它们比地球上任何生物都见过更多的日光。" },
  { cat: "nature", category: "✨ 萤火虫 · Firefly", body: "萤火虫的发光效率接近100%（白炽灯10%，LED约90%）——几乎所有的化学能都转化为光，不产生废热。科学家至今无法完全复制这种\"冷光\"反应。" },
  { cat: "nature", category: "💎 墨西哥 · 水晶洞", body: "Naica矿井深处有长达12米、重55吨的透石膏巨型晶体。洞内58°C、99%湿度，人类无防护只能停留10分钟。晶体在50万年恒定环境下缓慢生长，2000年才被矿工偶然发现。" },
  { cat: "nature", category: "🎵 鸣沙 · Singing Sands", body: "全球35个沙漠会\"唱歌\"——当沙粒在特定条件下滑动，会发出105Hz左右的低频音调，像远处的飞机或大提琴。敦煌鸣沙山的音频已被物理学家记录，但确切成因至今仍有争议。" },
  { cat: "nature", category: "🧠 黏菌 · Slime Mold", body: "没有大脑、没有神经系统，却能解决迷宫。日本科学家把黏菌放在东京地图上、食物放在各大车站位置——它最终长出的网络，比人类工程师设计的地铁系统更高效。" },
  { cat: "nature", category: "🎤 琴鸟 · Lyrebird", body: "澳大利亚的\"模仿大师\"。能完美复刻：电锯声、相机快门声、汽车警报、20种其他鸟的完整鸣叫。幼年时要花6-7年向父亲学习独特的\"曲目单\"。发情季雄鸟会完整表演30分钟不重样。" },
  { cat: "nature", category: "🕸 蜘蛛丝 · Spider Silk", body: "相同重量下强度是钢的5倍、弹性超过橡胶。一根铅笔粗的蜘蛛丝理论上能拦停一架喷气客机。科学家研究了几十年，仍无法工业化合成真正的蜘蛛丝。" },
  { cat: "nature", category: "🐸 玻璃蛙 · Glass Frog", body: "中南美洲雨林特有。腹部皮肤完全透明——你能看见它的心脏在实时跳动、肠道蠕动、血液循环。它们白天\"消失\"的秘密：睡眠时把92%的红细胞储存到肝脏里，让身体变得几乎完全透明。" },
  { cat: "nature", category: "🪼 灯塔水母 · Immortal Jellyfish", body: "地球上唯一\"永生\"的动物。受伤或老化时，它能把自己的细胞重新编程回到水螅期——相当于人类衰老时变回婴儿。理论上可无限循环，是目前科学已知唯一能逆转生命周期的生物。" },
  { cat: "nature", category: "🎨 园丁鸟 · Bowerbird", body: "澳洲雄园丁鸟会搭建复杂的\"求偶亭\"，只收集特定颜色的物品（通常是蓝色）：花瓣、贝壳、瓶盖。还会按大小排列形成\"强制透视\"——让自己看起来更大。是人类之外唯一为美而创作的动物。" },
];

let state = {
  completedToday: new Set(),
  setsPartial: {},
  streak: 0,
  lastCheckinDate: null,
  checkinHistory: [],
};

function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function getTodayKey() { return getDateKey(new Date()); }
function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateKey(d);
}

function loadState() {
  try {
    const raw = localStorage.getItem('rehab_state_v1');
    if (raw) {
      const loaded = JSON.parse(raw);
      state.streak = loaded.streak || 0;
      state.lastCheckinDate = loaded.lastCheckinDate || null;
      state.checkinHistory = loaded.checkinHistory || [];

      if (loaded.completedDate === getTodayKey()) {
        state.completedToday = new Set(loaded.completedToday || []);
        state.setsPartial = loaded.setsPartial || {};
      }

      if (state.lastCheckinDate && state.lastCheckinDate !== getTodayKey() && state.lastCheckinDate !== getYesterdayKey()) {
        state.streak = 0;
      }
    }
  } catch(e) { console.log('Load err', e); }
}

function saveState() {
  try {
    localStorage.setItem('rehab_state_v1', JSON.stringify({
      streak: state.streak,
      lastCheckinDate: state.lastCheckinDate,
      checkinHistory: state.checkinHistory,
      completedToday: Array.from(state.completedToday),
      setsPartial: state.setsPartial,
      completedDate: getTodayKey(),
    }));
  } catch(e) { console.log('Save err', e); }
}

let currentEx = null;
let timerInterval = null;
let countdownInterval = null;
let timeLeft = 0;
let totalTime = 0;
let currentSet = 1;
let isRunning = false;

function init() {
  loadState();
  loadStoredConfig();

  const savedTheme = localStorage.getItem('rehab_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').textContent = '🌙';
  }

  const now = new Date();
  document.getElementById('dateDisplay').textContent =
    now.toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'long' });

  renderSection('ankle');
  renderSection('spine');
  renderSection('upper');
  updateProgress();
  updateStreak();
  updateCheckinButton();

  if (!hasToken()) {
    document.getElementById('tokenNotice').style.display = 'block';
  }
}

function getAllExercises(type) {
  const builtIn = exercises[type] || [];
  const custom = loadCustomExercises()[type] || [];
  return [...builtIn, ...custom];
}

function loadCustomExercises() {
  try {
    const raw = localStorage.getItem('rehab_custom_ex_v1');
    return raw ? JSON.parse(raw) : { ankle: [], spine: [], upper: [] };
  } catch(e) { return { ankle: [], spine: [], upper: [] }; }
}

function saveCustomExercises(data) {
  localStorage.setItem('rehab_custom_ex_v1', JSON.stringify(data));
}

function renderSection(type) {
  const container = document.getElementById(`section-${type}`);
  const exList = getAllExercises(type);
  const sectionTitle =
    type === 'ankle' ? '右踝康复 · HEP处方' :
    type === 'spine' ? '胸腰椎拉伸 · 灵活度恢复' : '上肢激活 · 肩袖修复';

  container.innerHTML = `
    <div class="section-header">
      <span>${sectionTitle}</span>
      <button class="add-btn" onclick="openAddExercise('${type}')">+ 添加动作</button>
    </div>
  `;

  exList.forEach((ex, i) => {
    const key = `${type}-${i}`;
    const isDone = state.completedToday.has(key);
    const isPartial = !isDone && state.setsPartial[key] > 0;
    const isCustom = ex.custom;
    const card = document.createElement('div');
    card.className = `ex-card ${type}${isDone ? ' completed' : ''}${isPartial ? ' partial' : ''}${isCustom ? ' custom' : ''}`;
    card.id = `card-${key}`;
    card.innerHTML = `
      <div class="ex-top">
        <div class="ex-name">${ex.name}</div>
        <div class="ex-badge">${ex.badge || ''}</div>
      </div>
      <div class="ex-sets">${ex.sets}${isPartial ? ` <span class="partial-label">· 已完成 ${state.setsPartial[key]} 组</span>` : ''}</div>
      <div class="ex-cue">${ex.brief || ex.cue || ''}</div>
      <div class="ex-check">✓</div>
    `;
    card.onclick = () => openTimer(ex, key, type);
    // Long-press on custom exercise to edit
    if (isCustom) {
      let pressTimer = null;
      const startPress = (e) => {
        pressTimer = setTimeout(() => {
          e.preventDefault();
          const customIdx = exList.slice(0, i).filter(x => x.custom).length;
          openAddExercise(type, customIdx);
          pressTimer = null;
        }, 500);
      };
      const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
      card.addEventListener('touchstart', startPress, { passive: true });
      card.addEventListener('touchend', cancelPress);
      card.addEventListener('touchmove', cancelPress);
      card.addEventListener('mousedown', startPress);
      card.addEventListener('mouseup', cancelPress);
      card.addEventListener('mouseleave', cancelPress);
    }
    container.appendChild(card);
  });
}

function showSection(type, tab) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.getElementById(`section-${type}`).style.display = 'block';
  document.querySelectorAll('.tab').forEach(t => { t.className = 'tab'; });
  tab.className = `tab active-${type}`;
}

function openTimer(ex, key, type) {
  currentEx = { ex, key, type };
  currentSet = 1;
  isRunning = false;

  const colors = { ankle: '#38BDF8', spine: '#F97316', upper: '#A78BFA' };
  const sectionNames = { ankle: '右踝康复', spine: '胸腰椎拉伸', upper: '上肢激活' };

  document.getElementById('timerSection').textContent = sectionNames[type];
  document.getElementById('timerName').textContent = ex.name;
  document.getElementById('timerSetsInfo').textContent = ex.sets;
  document.getElementById('timerCue').textContent = '';
  document.getElementById('timerRing').style.stroke = colors[type];

  // Render variants picker if present
  const variantsWrap = document.getElementById('variantsWrap');
  const variantsList = document.getElementById('variantsList');
  if (ex.variants && ex.variants.length) {
    variantsWrap.style.display = 'block';
    variantsList.innerHTML = '';
    // Load saved variant or default to first (current level)
    const savedKey = `variant_${key}`;
    let selectedIdx = parseInt(localStorage.getItem(savedKey) || '0', 10);
    if (isNaN(selectedIdx) || selectedIdx >= ex.variants.length) selectedIdx = 0;

    ex.variants.forEach((v, i) => {
      const opt = document.createElement('div');
      opt.className = 'variant-option' + (i === selectedIdx ? ' selected' : '');
      opt.innerHTML = `
        <div class="variant-option-label">${v.label}</div>
        <div class="variant-option-detail">${v.detail}</div>
      `;
      opt.onclick = () => {
        localStorage.setItem(savedKey, i);
        document.querySelectorAll('.variant-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      };
      variantsList.appendChild(opt);
    });
  } else {
    variantsWrap.style.display = 'none';
  }

  // Render structured instructions
  const panel = document.getElementById('instructionsPanel');
  let html = '';
  if (ex.setup) {
    html += `
      <div class="instr-block instr-block-setup">
        <div class="instr-label">📍 起始姿势</div>
        <div class="instr-setup-text">${ex.setup}</div>
      </div>
    `;
  }
  if (ex.steps && ex.steps.length) {
    html += `
      <div class="instr-block instr-block-steps">
        <div class="instr-label">🔄 动作步骤</div>
        <ol class="instr-steps">
          ${ex.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    `;
  }
  if (ex.cues && ex.cues.length) {
    html += `
      <div class="instr-block instr-block-cues">
        <div class="instr-label">⚠️ 关键提示</div>
        <ul class="instr-cues">
          ${ex.cues.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  if (ex.breath) {
    html += `
      <div class="instr-block instr-block-breath">
        <div class="instr-label">🌬️ 呼吸配合</div>
        <div class="instr-breath">${ex.breath}</div>
      </div>
    `;
  }
  // Fallback for old format
  if (!html && ex.cue) {
    html = `<div class="instr-block"><div class="instr-setup-text">${ex.cue}</div></div>`;
  }
  panel.innerHTML = html;

  renderSetDots();
  resetTimerDisplay();
  document.getElementById('timerMainBtn').textContent = ex.timerType === 'reps' ? '完成本组' : '开始';
  document.getElementById('timerOverlay').classList.add('visible');
  // Scroll to top when opening
  document.getElementById('timerOverlay').scrollTop = 0;
}

function renderSetDots() {
  const ex = currentEx.ex;
  const counter = document.getElementById('setCounter');
  counter.innerHTML = '';
  for (let i = 1; i <= ex.sets_n; i++) {
    const dot = document.createElement('div');
    dot.className = `set-dot${i < currentSet ? ' done' : i === currentSet ? ' current' : ''}`;
    counter.appendChild(dot);
  }
}

function resetTimerDisplay() {
  const ex = currentEx.ex;
  if (ex.timerType === 'hold') {
    timeLeft = ex.duration;
    totalTime = ex.duration;
    document.getElementById('timerNum').textContent = ex.duration;
    document.getElementById('timerUnitLabel').textContent = '秒';
  } else {
    timeLeft = ex.reps;
    totalTime = ex.reps;
    document.getElementById('timerNum').textContent = ex.reps;
    document.getElementById('timerUnitLabel').textContent = '次';
  }
  document.getElementById('timerRing').style.strokeDashoffset = '0';
}

function toggleTimer() {
  const ex = currentEx.ex;
  if (ex.timerType === 'reps') {
    completeSet();
    return;
  }
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById('timerMainBtn').textContent = '继续';
  } else {
    startCountdown();
  }
}

function startCountdown() {
  let n = 3;
  const overlay = document.getElementById('countdownOverlay');
  const numEl = document.getElementById('countdownNum');
  numEl.textContent = n;
  overlay.classList.add('visible');

  countdownInterval = setInterval(() => {
    n--;
    if (n <= 0) {
      skipCountdown();
    } else {
      numEl.textContent = n;
    }
  }, 1000);
}

function skipCountdown() {
  clearInterval(countdownInterval);
  document.getElementById('countdownOverlay').classList.remove('visible');
  isRunning = true;
  document.getElementById('timerMainBtn').textContent = '暂停';
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timerNum').textContent = timeLeft;
    const pct = 1 - (timeLeft / totalTime);
    document.getElementById('timerRing').style.strokeDashoffset = pct * 553;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      completeSet();
    }
  }, 1000);
}

function completeSet() {
  const ex = currentEx.ex;
  if (currentSet >= ex.sets_n) {
    markExDone();
    closeTimer();
  } else {
    currentSet++;
    renderSetDots();
    resetTimerDisplay();
    isRunning = false;
    document.getElementById('timerMainBtn').textContent = ex.timerType === 'reps' ? '完成本组' : '开始';
    document.getElementById('timerCue').textContent = `✓ 第${currentSet-1}组完成！休息一下再开始第${currentSet}组`;
  }
}

function markExDone() {
  state.completedToday.add(currentEx.key);
  const card = document.getElementById(`card-${currentEx.key}`);
  if (card) card.classList.add('completed');
  saveState();
  updateProgress();
  updateCheckinButton();
}

function closeTimer() {
  clearInterval(timerInterval);
  clearInterval(countdownInterval);
  document.getElementById('countdownOverlay').classList.remove('visible');
  isRunning = false;

  const ex = currentEx.ex;
  const setsCompleted = currentSet - 1;
  if (setsCompleted > 0 && currentSet <= ex.sets_n) {
    document.getElementById('exitPopupBody').textContent = `你完成了 ${setsCompleted} 组 · 共 ${ex.sets_n} 组`;
    document.getElementById('exitSaveBtn').textContent = `保存 ${setsCompleted} 组`;
    document.getElementById('exitPopupBackdrop').classList.add('visible');
    return;
  }

  document.getElementById('timerOverlay').classList.remove('visible');
  renderSetDots();
}

function exitContinue() {
  document.getElementById('exitPopupBackdrop').classList.remove('visible');
}

function exitDiscard() {
  document.getElementById('exitPopupBackdrop').classList.remove('visible');
  document.getElementById('timerOverlay').classList.remove('visible');
  renderSetDots();
}

function exitSave() {
  const ex = currentEx.ex;
  const setsCompleted = currentSet - 1;
  state.setsPartial[currentEx.key] = setsCompleted;
  delete state.completedToday[currentEx.key];
  saveState();
  renderSection(currentEx.type);
  updateProgress();
  updateCheckinButton();
  document.getElementById('exitPopupBackdrop').classList.remove('visible');
  document.getElementById('timerOverlay').classList.remove('visible');
  renderSetDots();
}

function getTotalExerciseCount() {
  const builtIn = Object.values(exercises).reduce((a, b) => a + b.length, 0);
  const custom = Object.values(loadCustomExercises()).reduce((a, b) => a + b.length, 0);
  return builtIn + custom;
}

function updateProgress() {
  const total = getTotalExerciseCount();
  const done = state.completedToday.size;
  document.getElementById('progressBar').style.width = `${(done/total)*100}%`;
}

function updateStreak() {
  document.getElementById('streakNum').textContent = state.streak;
}

function updateCheckinButton() {
  const btn = document.getElementById('checkinBtn');
  const sub = document.getElementById('checkinSub');
  const done = state.completedToday.size;
  const total = getTotalExerciseCount();

  btn.disabled = false;

  if (state.lastCheckinDate === getTodayKey()) {
    btn.className = 'checkin-btn done';
    btn.textContent = '✓ 今日已打卡 · 查看惊喜';
    sub.textContent = `已完成 ${done}/${total} 个动作 · 连续 ${state.streak} 天`;
  } else if (done === 0) {
    btn.textContent = '完成任意一个动作即可打卡';
    btn.disabled = true;
    btn.className = 'checkin-btn';
    sub.textContent = '不需要全部做完 —— 动起来就算数';
  } else {
    btn.className = 'checkin-btn';
    btn.textContent = `今日打卡 · 领取惊喜（${done}/${total}）`;
    sub.textContent = done < 3 ? '再多一个动作，一天就完整了 💪' : '今天做得不错，去领奖吧';
  }
}

async function doCheckin() {
  const today = getTodayKey();
  const done = state.completedToday.size;

  if (state.lastCheckinDate === today) {
    const todayEntry = state.checkinHistory.find(h => h.date === today);
    if (todayEntry) showReward(todayEntry.rewardIdx, true);
    return;
  }

  if (done === 0) return;

  if (state.lastCheckinDate === getYesterdayKey()) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastCheckinDate = today;

  const recentIndices = state.checkinHistory.slice(-15).map(h => h.rewardIdx);
  const available = rewards.map((_, i) => i).filter(i => !recentIndices.includes(i));
  const pool = available.length > 0 ? available : rewards.map((_, i) => i);
  const rewardIdx = pool[Math.floor(Math.random() * pool.length)];

  state.checkinHistory.push({ date: today, rewardIdx });
  saveState();
  updateStreak();
  updateCheckinButton();
  showReward(rewardIdx, false);

  if (hasToken()) {
    showSaveToast('saving');
    try {
      const sessionData = buildSessionData(today);
      await writeSession(today, sessionData);
      showSaveToast('success', today);
    } catch (err) {
      if (err instanceof GitHubError && err.requiresReauth) {
        showSaveToast('error', null, 'Token 无效，请重新设置');
        document.getElementById('tokenNotice').style.display = 'block';
      } else {
        showSaveToast('error', null, err.message || '保存失败，请检查网络');
      }
    }
  }
}

function buildSessionData(date) {
  const exerciseResults = [];
  ['ankle', 'spine', 'upper'].forEach(type => {
    getAllExercises(type).forEach((ex, i) => {
      const key = `${type}-${i}`;
      if (state.completedToday.has(key)) {
        exerciseResults.push({ key, name: ex.name, sets_completed: ex.sets_n, sets_planned: ex.sets_n, complete: true });
      } else if (state.setsPartial[key] > 0) {
        exerciseResults.push({ key, name: ex.name, sets_completed: state.setsPartial[key], sets_planned: ex.sets_n, complete: false });
      }
    });
  });
  return { date, checkin_time: new Date().toISOString(), streak: state.streak, exercises: exerciseResults };
}

function showSaveToast(status, date, errorMsg) {
  const toast = document.getElementById('saveToast');
  const text = document.getElementById('saveToastText');
  const link = document.getElementById('saveToastLink');
  const retry = document.getElementById('saveToastRetry');

  toast.className = 'save-toast visible ' + status;

  if (status === 'saving') {
    text.textContent = '正在保存到 GitHub…';
    link.style.display = 'none';
    retry.style.display = 'none';
  } else if (status === 'success') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    text.textContent = `✓ 已保存 · ${time}`;
    link.href = `https://github.com/ohchocolate/rehab/blob/main/data/sessions/${date}.json`;
    link.style.display = 'inline';
    retry.style.display = 'none';
    setTimeout(() => toast.classList.remove('visible'), 5000);
  } else {
    text.textContent = `✗ ${errorMsg || '保存失败'}`;
    link.style.display = 'none';
    retry.style.display = 'inline';
  }
}

function showReward(idx, isRevisit) {
  const r = rewards[idx];
  const catLabel = {
    anatomy: '✦ 运动解剖学',
    quote_en: '✦ 西方经典',
    monument: '✦ 古迹冷知识',
    nature: '✦ 自然奇观',
  }[r.cat] || '✦ 惊喜';

  document.getElementById('rewardCategory').textContent = catLabel + ' · ' + r.category;
  document.getElementById('rewardStreakLabel').textContent = `连续打卡 · 第 ${state.streak} 天`;

  let html = '';
  if (r.cat === 'anatomy') {
    html = `
      <div style="text-align:center; margin-bottom: 20px;">
        <div style="font-family:'DM Mono', monospace; font-size: 20px; color: #E8DBC0; letter-spacing: 0.5px; font-weight: 500; line-height: 1.3; margin-bottom: 10px;">${r.name_en}</div>
        <div style="height: 1px; width: 40px; background: #D4AF7A66; margin: 0 auto 10px;"></div>
        <div style="font-family:'Ma Shan Zheng', serif; font-size: 28px; color: #D4AF7A; letter-spacing: 3px;">${r.name_zh}</div>
      </div>
      <div class="reward-body" style="text-align:left; line-height:1.9; color:#D8C9A8;">${r.body}</div>
    `;
  } else if (r.quote) {
    html = `<div class="reward-quote">${r.quote.replace(/\n/g, '<br>')}</div>`;
    if (r.body) html += `<div class="reward-body">${r.body}</div>`;
  } else if (r.quote_en) {
    html = `<div class="reward-quote-en">"${r.quote_en.replace(/\n/g, '<br>')}"</div>`;
    if (r.body) html += `<div class="reward-body">${r.body}</div>`;
  } else {
    html = `<div class="reward-body" style="font-size:15px; text-align:left; color:#D8C9A8; line-height:1.9;">${r.body}</div>`;
  }

  document.getElementById('rewardContent').innerHTML = html;
  document.getElementById('rewardNote').textContent = isRevisit
    ? '今日已打卡 · 明日再见'
    : `你的第 ${state.checkinHistory.length} 次打卡 · 已收藏`;

  document.getElementById('rewardOverlay').classList.add('visible');
}

function closeReward() {
  document.getElementById('rewardOverlay').classList.remove('visible');
}

function openHistory() {
  closeReward();
  const list = document.getElementById('historyList');
  const stats = document.getElementById('historyStatsText');

  stats.textContent = `${state.checkinHistory.length} 天 · ${state.checkinHistory.length} 份惊喜 · 当前连续 ${state.streak} 天`;

  const cal = document.getElementById('calendarDots');
  cal.innerHTML = '';
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const done = state.checkinHistory.some(h => h.date === key);
    const isToday = i === 0;
    const dot = document.createElement('div');
    dot.className = `cal-dot${done ? ' done' : ''}${isToday ? ' today' : ''}`;
    dot.textContent = d.getDate();
    cal.appendChild(dot);
  }

  if (state.checkinHistory.length === 0) {
    list.innerHTML = `<div class="empty-history">还没有打卡记录<br><br>完成任意动作后点击"今日打卡"开始收集吧</div>`;
  } else {
    list.innerHTML = '';
    [...state.checkinHistory].reverse().forEach(h => {
      const r = rewards[h.rewardIdx];
      if (!r) return;
      const catEmoji = { anatomy: '🦴', quote_en: '📖', monument: '🏛', nature: '🌿' }[r.cat] || '✦';
      const preview = r.cat === 'anatomy' ? `${r.name_en} · ${r.name_zh}` :
                     r.quote ? r.quote.split('\n')[0] + '…' :
                     r.quote_en ? '"' + r.quote_en.slice(0, 60) + '…"' :
                     r.body.slice(0, 60) + '…';
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <div class="history-date">${h.date} <span class="history-cat">${catEmoji} ${r.category}</span></div>
        <div class="history-preview">${preview}</div>
      `;
      item.onclick = () => {
        closeHistory();
        showReward(h.rewardIdx, true);
      };
      list.appendChild(item);
    });
  }

  document.getElementById('historyOverlay').classList.add('visible');
}

function closeHistory() {
  document.getElementById('historyOverlay').classList.remove('visible');
}

/* ============ ADD/EDIT CUSTOM EXERCISES ============ */
let formState = { editingType: null, editingIdx: null };

function openAddExercise(type, editIdx) {
  // Reset form
  formState = { editingType: type, editingIdx: editIdx !== undefined ? editIdx : null };

  document.getElementById('formTitle').textContent = editIdx !== undefined ? '编辑动作' : '添加动作';
  document.getElementById('formSub').textContent = editIdx !== undefined ? '长按动作卡可重新打开此页' : '自定义你的康复动作';
  document.getElementById('formDeleteBtn').style.display = editIdx !== undefined ? 'block' : 'none';

  // Module selector
  document.querySelectorAll('#formModuleRow .form-radio').forEach(el => {
    el.classList.toggle('selected', el.dataset.mod === type);
    el.onclick = () => {
      document.querySelectorAll('#formModuleRow .form-radio').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
    };
  });

  // Timer type selector
  document.querySelectorAll('#formTimerTypeRow .form-radio').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('#formTimerTypeRow .form-radio').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      document.getElementById('formAmountLabel').textContent = el.dataset.type === 'reps' ? '每组次数' : '每组秒数';
    };
  });

  // Load data if editing
  if (editIdx !== undefined) {
    const custom = loadCustomExercises()[type] || [];
    const ex = custom[editIdx];
    if (ex) {
      document.getElementById('formName').value = ex.name || '';
      document.getElementById('formBrief').value = ex.brief || '';
      document.getElementById('formBadge').value = ex.badge || '';
      document.getElementById('formSetup').value = ex.setup || '';
      document.getElementById('formSteps').value = (ex.steps || []).join('\n');
      document.getElementById('formCues').value = (ex.cues || []).join('\n');
      document.getElementById('formBreath').value = ex.breath || '';
      document.getElementById('formSets').value = ex.sets_n || 3;
      document.getElementById('formAmount').value = ex.timerType === 'reps' ? (ex.reps || 10) : (ex.duration || 30);

      // Select timer type
      document.querySelectorAll('#formTimerTypeRow .form-radio').forEach(el => {
        const match = el.dataset.type === ex.timerType;
        el.classList.toggle('selected', match);
        if (match) {
          document.getElementById('formAmountLabel').textContent = ex.timerType === 'reps' ? '每组次数' : '每组秒数';
        }
      });
    }
  } else {
    // Clear form for new exercise
    ['formName', 'formBrief', 'formBadge', 'formSetup', 'formSteps', 'formCues', 'formBreath'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('formSets').value = '3';
    document.getElementById('formAmount').value = '10';
    // Default to reps
    document.querySelectorAll('#formTimerTypeRow .form-radio').forEach(el => {
      el.classList.toggle('selected', el.dataset.type === 'reps');
    });
    document.getElementById('formAmountLabel').textContent = '每组次数';
  }

  document.getElementById('addExerciseOverlay').classList.add('visible');
  document.getElementById('addExerciseOverlay').scrollTop = 0;
}

function closeAddExercise() {
  document.getElementById('addExerciseOverlay').classList.remove('visible');
}

function saveCustomExercise() {
  const selectedMod = document.querySelector('#formModuleRow .form-radio.selected');
  const selectedType = document.querySelector('#formTimerTypeRow .form-radio.selected');
  const name = document.getElementById('formName').value.trim();
  const amount = parseInt(document.getElementById('formAmount').value);
  const setsN = parseInt(document.getElementById('formSets').value);

  if (!selectedMod) { alert('请选择归入的模块'); return; }
  if (!selectedType) { alert('请选择计时方式'); return; }
  if (!name) { alert('请输入动作名称'); return; }
  if (!amount || amount < 1) { alert('请输入有效的每组次数/秒数'); return; }
  if (!setsN || setsN < 1) { alert('请输入有效的组数'); return; }

  const mod = selectedMod.dataset.mod;
  const timerType = selectedType.dataset.type;

  const brief = document.getElementById('formBrief').value.trim();
  const badge = document.getElementById('formBadge').value.trim() || '自定义';
  const setup = document.getElementById('formSetup').value.trim();
  const steps = document.getElementById('formSteps').value.trim().split('\n').map(s => s.trim()).filter(Boolean);
  const cues = document.getElementById('formCues').value.trim().split('\n').map(s => s.trim()).filter(Boolean);
  const breath = document.getElementById('formBreath').value.trim();

  const newEx = {
    custom: true,
    name,
    brief,
    badge,
    sets: timerType === 'reps' ? `${setsN}组 × ${amount}次` : `${setsN}组 × ${amount}秒`,
    timerType,
    sets_n: setsN,
    ...(timerType === 'reps' ? { reps: amount } : { duration: amount }),
    ...(setup ? { setup } : {}),
    ...(steps.length ? { steps } : {}),
    ...(cues.length ? { cues } : {}),
    ...(breath ? { breath } : {}),
  };

  const customData = loadCustomExercises();

  // If editing, remove from old location and save to new location
  if (formState.editingIdx !== null && formState.editingType) {
    const oldType = formState.editingType;
    customData[oldType] = customData[oldType] || [];
    customData[oldType].splice(formState.editingIdx, 1);
  }

  customData[mod] = customData[mod] || [];
  if (formState.editingIdx !== null && formState.editingType === mod) {
    customData[mod].splice(formState.editingIdx, 0, newEx);
  } else {
    customData[mod].push(newEx);
  }

  saveCustomExercises(customData);

  // Re-render all sections and close
  renderSection('ankle');
  renderSection('spine');
  renderSection('upper');
  updateProgress();
  updateCheckinButton();
  closeAddExercise();
}

function deleteCustomExercise() {
  if (formState.editingIdx === null || !formState.editingType) return;
  if (!confirm('确定删除这个动作吗？此操作不可撤销。')) return;

  const customData = loadCustomExercises();
  const type = formState.editingType;
  if (customData[type] && customData[type][formState.editingIdx]) {
    customData[type].splice(formState.editingIdx, 1);
    saveCustomExercises(customData);
  }

  renderSection('ankle');
  renderSection('spine');
  renderSection('upper');
  updateProgress();
  updateCheckinButton();
  closeAddExercise();
}

/* ============ THEME ============ */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('rehab_theme', isLight ? 'light' : 'dark');
  document.getElementById('themeToggle').textContent = isLight ? '🌙' : '☀';
}

/* ============ TOKEN SETUP ============ */
function openTokenSetup() {
  document.getElementById('tokenSetupOverlay').classList.add('visible');
  document.getElementById('tokenSetupOverlay').scrollTop = 0;
}

function closeTokenSetup() {
  document.getElementById('tokenSetupOverlay').classList.remove('visible');
}

function saveTokenSetup() {
  const token = document.getElementById('tokenInput').value.trim();
  if (!token) { alert('请输入 GitHub Token'); return; }
  initGitHub(token, 'ohchocolate', 'rehab');
  document.getElementById('tokenNotice').style.display = 'none';
  closeTokenSetup();
  showSaveToast('success_token');
}

function clearTokenAndReset() {
  if (!confirm('确定清除 Token？打卡数据将不再同步到 GitHub。')) return;
  localStorage.removeItem('gh_token');
  localStorage.removeItem('gh_owner');
  localStorage.removeItem('gh_repo');
  document.getElementById('tokenNotice').style.display = 'block';
  closeTokenSetup();
}

function retryCheckinSave() {
  const today = getTodayKey();
  document.getElementById('saveToast').classList.remove('visible');
  if (hasToken()) {
    showSaveToast('saving');
    const sessionData = buildSessionData(today);
    writeSession(today, sessionData)
      .then(() => showSaveToast('success', today))
      .catch(err => showSaveToast('error', null, err.message || '保存失败'));
  }
}

/* ============ WINDOW EXPOSURE (required for inline onclick in HTML) ============ */
Object.assign(window, {
  showSection, openTimer, closeTimer, toggleTimer, skipCountdown,
  exitContinue, exitDiscard, exitSave,
  doCheckin, closeReward, openHistory, closeHistory,
  openAddExercise, closeAddExercise, saveCustomExercise, deleteCustomExercise,
  toggleTheme, openTokenSetup, closeTokenSetup, saveTokenSetup, clearTokenAndReset,
  retryCheckinSave,
});

init();
