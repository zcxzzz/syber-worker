import React, { useState,useRef } from 'react';
import { toPng } from 'html-to-image';

// --- 1. 30道完整题库 (ALL_QUESTIONS) ---
const ALL_QUESTIONS = [
  { id: 1, title: "周五17:58，钉钉/企业微信突然@全体甩来一篇《吃亏是福》，要求立刻写200字心得，周一早会还要当众分享，你：", options: [{ text: "已读不回，准点关电脑拎包跑路，爱谁谁去死", score: { Z: 1 } }, { text: "打开AI三十秒生成，备注‘已深刻领悟领导福报’秒交", score: { P: 1 } }, { text: "在心里把领导祖宗十八代问候到吐血，然后咬牙憋出一篇狗屁不通的狗屁", score: { M: 1 } }, { text: "回复：建议公司先降薪一半让我多吃点亏积福吧傻逼", score: { L: 1 } }] },
  { id: 2, title: "跨部门甩锅+阴阳怪气‘这不是常识吗？’发到群里，你：", options: [{ text: "微笑回‘好的，感谢同步，已知会’，内心已死", score: { P: 1 } }, { text: "截图扔进摸鱼小群，疯狂输出脏话三分钟泄愤", score: { S: 1 } }, { text: "直接@对方老板：麻烦给份SOP和原始需求记录，别他妈甩锅了", score: { F: 1 } }, { text: "默默截图归档，留着以后绩效面谈当呈堂证供", score: { M: 1 } }] },
  { id: 3, title: "老板说‘搬到我办公室门口坐，底薪翻倍，全天360度监控’，你：", options: [{ text: "只要钱到位，我能坐他腿上办公顺便给他捏肩捶腿舔鞋", score: { P: 1 } }, { text: "算了吧，这点钱还不够我看一次心理医生的，谢谢", score: { D: 1 } }, { text: "先答应，回头买最厚的防窥膜+隔音耳塞+假人摆在工位装死", score: { Z: 1 } }, { text: "去应聘那个监控岗位，反向监控他全家祖坟", score: { L: 1 } }] },
  { id: 4, title: "早高峰地铁挤成沙丁鱼罐头，你现在的状态是：", options: [{ text: "眼神死寂，像一具被惯性推着走的行尸走肉", score: { Z: 1 } }, { text: "疯狂刷离职暴富帖，幻想明天就提桶跑路", score: { P: 1 } }, { text: "谁挤我我就把谁拉进精神暗杀名单第114514位", score: { M: 1 } }, { text: "利用缝隙改PPT，试图卷死同梯层所有畜生", score: { F: 1 } }] },
  { id: 5, title: "年会老板含泪画大饼‘明年公司一定上市’，全场鼓掌，你：", options: [{ text: "鼓掌最响，内心毫无波澜甚至想当场笑出声", score: { P: 1 } }, { text: "低头猛吃自助，毕竟这饼还没肘子实在", score: { Z: 1 } }, { text: "当场打开手机查公司负债率和最近三轮裁员名单", score: { M: 1 } }, { text: "举手问：上市后能把我工位换到窗边吗？傻逼", score: { L: 1 } }] },
  { id: 6, title: "公司最豪华、最干净、唯一有香氛的那个马桶隔间被人占了，你：", options: [{ text: "跑去别的楼层，当做是免费健身拉练", score: { Z: 1 } }, { text: "在门外疯狂叹气+跺脚+砸门，用精神攻击施压", score: { M: 1 } }, { text: "回去算这10分钟没带薪拉屎亏了多少钱", score: { P: 1 } }, { text: "从外面直接把隔间灯关掉+门把手反锁+贴纸条‘维修中’", score: { L: 1 } }] },
  { id: 7, title: "下午三点，你已经把今天所有活干完，工位上空空荡荡，你会：", options: [{ text: "对着空白Excel假装沉思，维持‘我在认真工作’人设", score: { Z: 1 } }, { text: "把明天的活也干了，方便明天直接跑路", score: { F: 1 } }, { text: "切屏看股票基金，研究副业暴富路线图", score: { P: 1 } }, { text: "去茶水间把所有零食吃一遍，顺便把咖啡机掏空", score: { L: 1 } }] },
  { id: 8, title: "公司空调冷得像停尸房，冻得你手指发紫还得假装精神饱满，你：", options: [{ text: "裹紧小毯子，打字速度直接腰斩50%", score: { Z: 1 } }, { text: "趁没人偷偷把总闸线拔了，让大家一起冻成狗", score: { M: 1 } }, { text: "带取暖器，直到把整层楼搞跳闸停电", score: { L: 1 } }, { text: "忍着，在群里夸后勤‘冷气真给力，降温效果一级棒’", score: { S: 1 } }] },
  { id: 9, title: "电脑在保存方案前一秒蓝屏，你第一反应是：", options: [{ text: "太好了，老天爷终于让我歇会儿，感恩", score: { Z: 1 } }, { text: "在脑海里把鼠标砸向显示器砸到屏幕碎成渣", score: { M: 1 } }, { text: "冷静重启，庆幸自己是按Ctrl+S的赛博奴隶", score: { F: 1 } }, { text: "直接跟老板说：电脑烧了，我要下班回家等死", score: { L: 1 } }] },
  { id: 10, title: "公司群突然发50块拼手气红包，你抢到0.01元：", options: [{ text: "心里痛骂老板小气到抠脚缝，发表情包‘谢谢老板’", score: { P: 1 } }, { text: "无所谓，只是肌肉记忆在抽搐", score: { Z: 1 } }, { text: "点开看谁抢了最佳，暗暗记仇一辈子", score: { M: 1 } }, { text: "立刻发0.02的红包嘲讽回去，顺便艾特他全家", score: { L: 1 } }] },
  { id: 11, title: "平时工作上才有交集的同事突然发来结婚请柬，你：", options: [{ text: "转200块，随后悄悄屏蔽+取消关注", score: { P: 1 } }, { text: "已读不回，主打一个人间蒸发", score: { S: 1 } }, { text: "回复：那天我要参加一个葬礼，抱歉", score: { M: 1 } }, { text: "必须去吃回本，还要打包三份外带", score: { L: 1 } }] },
  { id: 12, title: "新实习生眼睛发光地喊‘我爱上班！好充实！’，你：", options: [{ text: "用看死人的空洞眼神扫了他一眼", score: { Z: 1 } }, { text: "高价把你二手防辐射键盘卖给他", score: { P: 1 } }, { text: "凑到他耳边轻声说：快逃，还来得及，别重蹈覆辙", score: { D: 1 } }, { text: "拍他肩膀：好，今晚这锅你来背，欢迎加入牛马群", score: { L: 1 } }] },
  { id: 13, title: "午饭时老板端着盘子突然坐到你对面，你：", options: [{ text: "2倍速狂吃，噎死也要逃离现场", score: { F: 1 } }, { text: "面无表情，当对面坐着个会说话的猕猴桃", score: { Z: 1 } }, { text: "疯狂汇报最无聊的项目细节直到他吃不下去", score: { M: 1 } }, { text: "顺势问：这顿饭能不能走报销？不然我吃不下", score: { P: 1 } }] },
  { id: 14, title: "平时比你还能摸鱼的同事年终奖居然比你高，你：", options: [{ text: "立刻更新简历，打开Boss直聘", score: { F: 1 } }, { text: "从明天起精准对标他的工作量，多干一点算我输", score: { Z: 1 } }, { text: "深夜在知乎匿名问‘怎么不动声色举报同事’", score: { M: 1 } }, { text: "祝福他，希望他拿这笔钱多买点降压药", score: { L: 1 } }] },
  { id: 15, title: "同事在厕所隔间崩溃大哭，你会：", options: [{ text: "从门缝塞张纸巾，假装自己是幽灵飘过", score: { S: 1 } }, { text: "隔着门说：没事，大家早晚都要死的", score: { Z: 1 } }, { text: "直接把猎头微信名片从门缝塞进去", score: { F: 1 } }, { text: "在隔壁隔间也开始哭，顺便逃下午会", score: { L: 1 } }] },
  { id: 16, title: "领导提需求：‘我要一种五彩斑斓的黑’，你：", options: [{ text: "报一个惊人加班费，说可以试试", score: { P: 1 } }, { text: "好的收到，过两天交一坨纯黑给他", score: { Z: 1 } }, { text: "表面答应，背地里把他做成表情包发摸鱼群", score: { S: 1 } }, { text: "直接整爆闪霓虹灯效果，问他够不够斑斓傻逼", score: { L: 1 } }] },
  { id: 17, title: "深夜11:31，领导突然私聊发来一句‘在吗？’，你：", options: [{ text: "秒回‘在的老板’，大脑开始计算加班费", score: { P: 1 } }, { text: "明天早上9点回‘不好意思昨晚睡死过去了’", score: { S: 1 } }, { text: "手机扔一边，在床上阴暗扭动两分钟想死", score: { M: 1 } }, { text: "回一个‘？’，看谁的心理素质先崩", score: { L: 1 } }] },
  { id: 18, title: "两句话就能说清的事，被拉去开了两小时会，你：", options: [{ text: "自带电脑，会上把其他活全干完", score: { F: 1 } }, { text: "练习睁着眼睛睡觉的神功", score: { Z: 1 } }, { text: "把每句废话都记在小本本上留作呈堂证供", score: { M: 1 } }, { text: "尿遁3次+屎遁2次，物理逃避", score: { L: 1 } }] },
  { id: 19, title: "周末你在深山老林露营，信号都没有，老板让你紧急处理个报表，你：", options: [{ text: "发一张‘无信号’截图然后直接关机", score: { S: 1 } }, { text: "到处找信号处理完，周一申请调休", score: { P: 1 } }, { text: "回复‘好的’，然后假装发错了消息一直拖", score: { Z: 1 } }, { text: "找路人录段‘已被黑熊叼走’视频发过去", score: { L: 1 } }] },
  { id: 20, title: "绩效面谈老板说‘给你升职，但目前没有预算涨薪’，你：", options: [{ text: "“只谈理想不谈钱是耍流氓，我不升”", score: { P: 1 } }, { text: "笑眯眯接受，立马把新title塞进简历找下家", score: { F: 1 } }, { text: "接受，然后用新职权把所有活用权限分出去", score: { Z: 1 } }, { text: "“谢谢老板，请问能把这个title刻在我的墓碑上吗”", score: { L: 1 } }] },
  { id: 21, title: "清晨7:00闹钟响起那一刻，你的第一想法是：", options: [{ text: "如果今天出门被电动车创飞，是不是就不用去上班了", score: { D: 1 } }, { text: "挺住，今天的出场费还有2小时到账", score: { P: 1 } }, { text: "盯着天花板灵魂出窍10分钟，怀疑人生", score: { Z: 1 } }, { text: "对着闹钟进行3分钟恶毒咒骂", score: { M: 1 } }] },
  { id: 22, title: "HR要求每天早上全员在工位前跳广播体操，你会：", options: [{ text: "动作像一只患关节炎的树懒，敷衍到底", score: { Z: 1 } }, { text: "跳跃运动时故意踩前面同事的脚", score: { M: 1 } }, { text: "用极致夸张的社会摇动作震撼全场", score: { L: 1 } }, { text: "躲在楼梯间刷手机，死无对证", score: { S: 1 } }] },
  { id: 23, title: "你出差垫付50块打车费，财务以‘发票折角’为由拒报，你：", options: [{ text: "站在财务桌前跟她battle两小时", score: { M: 1 } }, { text: "算了，自己掏钱，懒得生气伤肝", score: { Z: 1 } }, { text: "每天偷偷从公司带一卷卫生纸，直到回本", score: { P: 1 } }, { text: "每天把这张发票重新提交一次，玩极限拉扯", score: { S: 1 } }] },
  { id: 24, title: "如果你必须拥有一种职场超能力，你会选：", options: [{ text: "“一键让老板失忆”：每次他布置完任务就忘", score: { Z: 1 } }, { text: "“提款机体质”：被骂一句账户自动+100", score: { P: 1 } }, { text: "“真实滤镜”：能看到每个同事内心骂人的弹幕", score: { M: 1 } }, { text: "“闪现回城”：遇到傻X直接瞬移回自己床上", score: { F: 1 } }] },
  { id: 25, title: "你在公司大群里不小心发出老板最丑的表情包，撤回时间已过，你：", options: [{ text: "光速离职，换城市重新做人", score: { F: 1 } }, { text: "立刻发‘不好意思号被盗了’然后装死到底", score: { S: 1 } }, { text: "索性再发三张更丑的，说这是‘企业文化大赏’", score: { L: 1 } }, { text: "去问老板这个表情包有没有增加一点亲和力", score: { M: 1 } }] },
  { id: 26, title: "面对‘公司就是家’这种言论，你的态度是：", options: [{ text: "那我今天不穿裤子来上班也没关系吧", score: { L: 1 } }, { text: "确实，这是我素颜待得最久的地方", score: { Z: 1 } }, { text: "谁家每个月只给这点生活费还天天想把我赶出去？", score: { P: 1 } }, { text: "建议把公司资产过户给我，我也是家里一份子", score: { M: 1 } }] },
  { id: 27, title: "下午6点准时下班，走到楼下发现下暴雨，你没带伞：", options: [{ text: "回去加班？不可能，宁愿淋死在雨里", score: { F: 1 } }, { text: "回工位躺平，用公司电充手机蹭空调", score: { Z: 1 } }, { text: "在门口把老板顺风车直接拦下来", score: { L: 1 } }, { text: "打开打车软件，看到3倍溢价，心在滴血", score: { P: 1 } }] },
  { id: 28, title: "你心目中最完美的离职方式是：", options: [{ text: "被公司N+1辞退，拿着赔偿金快乐消失", score: { P: 1 } }, { text: "静音离职，什么也不说，连夜退出所有群", score: { S: 1 } }, { text: "群发一封全员邮件，把所有人黑料爆一遍", score: { M: 1 } }, { text: "年会上突然抢过麦克风宣布老子不干了", score: { L: 1 } }] },
  { id: 29, title: "对自己目前工作的终极愿景是：", options: [{ text: "平安退休，熬死这帮资本家，拿走所有养老金", score: { P: 1 } }, { text: "公司原地倒闭，彻底结束这场精神凌迟", score: { M: 1 } }, { text: "搞个靠谱副业，从此把上班当成来演戏", score: { Z: 1 } }, { text: "当上老板，让现在的领导每天写200字感悟", score: { L: 1 } }] },
  { id: 30, title: "如果生活可以重来，你还会选择现在这个职业吗？", options: [{ text: "会，因为干别的可能更穷更惨", score: { P: 1 } }, { text: "不会，我想去路边摊炸油条或者深山养猪", score: { D: 1 } }, { text: "重来？我希望自己根本不要出生", score: { Z: 1 } }, { text: "无所谓，在哪都是赛博牛马", score: { L: 1 } }] }
];

// --- 结果映射表（已彻底狠化+小红书深夜吐槽味）---
const RESULTS = {
  P: {
    type: "P",
    icon: "📈",
    title: "【带薪理财的野生巴菲特】",
    desc: "你把所有温良恭俭让都拿去换年终奖和基金定投了。公司只是你赚钱的临时ATM，老板画的饼你当饭吃，灵魂早已出卖给K线图。",
    quote: "只要公司不倒闭，我能陪这帮傻逼演戏到2077年。"
  },
  Z: {
    type: "Z",
    icon: "🧟",
    title: "【开机失败的赛博僵尸】",
    desc: "身体每天准时打卡，灵魂三年前就死在了某个加班夜。你是公司最省电、最听话、最没有存在感的耗材。",
    quote: "别问我在不在，我只是一串没有感情的‘收到’代码。"
  },
  M: {
    type: "M",
    icon: "🔪",
    title: "【暗杀名单常驻记录员】",
    desc: "你表面乖巧，内心已经给全公司建好了精神陵园。别人以为你在记会议纪要，其实你在写血书和墓志铭。",
    quote: "我的微笑不是礼貌，是杀意还在加载中。"
  },
  L: {
    type: "L",
    icon: "🔥",
    title: "【职场整顿办挂名主任】",
    desc: "你天生反骨，最擅长用最客气的语气把老板和HR送进ICU。HR看到你就头秃，老板看到你就血压180。",
    quote: "生活已经够苦了，不发疯难道还要发财吗？"
  },
  F: {
    type: "F",
    icon: "🏃",
    title: "【随时准备跑路的提桶战神】",
    desc: "你干活飞快，不是因为热爱工作，而是为了早点提桶。简历永远最新版，每一次努力都是在为下一次逃离蓄力。",
    quote: "我努力工作，就是为了有一天不用再看见你们这群畜生。"
  },
  S: {
    type: "S",
    icon: "🤫",
    title: "【职场静音包/朋友圈暴君】",
    desc: "你在公司是透明人，在摸鱼群里你是战神。已读不回和屏蔽老板技术点满，活在自己的小世界里。",
    quote: "只要我不尴尬，尴尬的就是整个公司。"
  },
  D: {
    type: "D",
    icon: "💀",
    title: "【灵魂已飞的职场亡灵】",
    desc: "你每天脑内辞职100次，现实却还在刷卡打工。你不是在上班，你是在等死前最后一份工资和那口烧烤。",
    quote: "我不是社畜，我只是还没死透的幽灵。"
  },
  DEFAULT: {
    type: "DEFAULT",
    icon: "🏖️",
    title: "【看破红尘的职场体验官】",
    desc: "你已经去过大理或东南亚，回来只是为了赚点生活费。上班就是为了报复被花光的存款和那颗早已死掉的心。",
    quote: "梦想？不存在的，我只相信下班后的那口烧烤和啤酒。"
  }
};

// --- 3. 主组件 ---
export default function WorkplaceQuiz() {
const [step, setStep] = useState(0); 
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, Record<string, number>>>({});

// --- 【新增】：海报生成相关的状态和引用 ---
  const posterRef = useRef<HTMLDivElement>(null); // 指向需要被截图的 DOM
  const [posterImage, setPosterImage] = useState<string | null>(null); // 存放生成的 Base64 图片
  const [isGenerating, setIsGenerating] = useState(false); // 生成中的 Loading 状态

  const startQuiz = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 12));
    setSelectedAnswers({});
    setResult(null);
    setPosterImage(null); // 开始新测试时清空旧海报
    setStep(1);
  };
  // 选择答案
const handleOptionClick = (scoreRecord: Record<string, number>) => {
    const newAnswers = { ...selectedAnswers, [step]: scoreRecord };
    setSelectedAnswers(newAnswers);
    if (step < currentQuestions.length) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

const calculateResult = (finalAnswers: Record<number, Record<string, number>>) => {
    const totalScores: Record<string, number> = { P:0, Z:0, M:0, L:0, S:0, F:0, D:0 };
    Object.values(finalAnswers).forEach(scoreRecord => {
      Object.keys(scoreRecord).forEach(key => {
        totalScores[key] += scoreRecord[key];
      });
    });

    let maxKey = 'DEFAULT';
    let maxVal = 0;
    Object.entries(totalScores).forEach(([key, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    });

    // 1. 获取对应的结果模板（不修改它）
    const resultTemplate = RESULTS[maxKey as keyof typeof RESULTS] || RESULTS.DEFAULT;

    // 2. 根据 type 动态计算怨气指标
    const getStats = (type: string) => {
      const statsMap: Record<string, {s1:number[], s2:number[], s3:number[], s4:number[]}> = {
        P: { s1: [85, 99], s2: [40, 60], s3: [10, 30], s4: [90, 99] }, 
        Z: { s1: [90, 99], s2: [80, 95], s3: [5, 20],  s4: [95, 99] }, 
        M: { s1: [40, 60], s2: [10, 30], s3: [90, 99], s4: [70, 90] }, 
        L: { s1: [20, 40], s2: [1, 10],  s3: [80, 99], s4: [99, 99] }, 
        F: { s1: [60, 80], s2: [1, 5],   s3: [85, 99], s4: [50, 70] }, 
        S: { s1: [70, 90], s2: [40, 60], s3: [60, 80], s4: [40, 60] }, 
        D: { s1: [80, 95], s2: [10, 20], s3: [85, 99], s4: [99, 99] }, 
        DEFAULT: { s1: [50, 70], s2: [50, 70], s3: [50, 70], s4: [50, 70] }
      };
      
      const bounds = statsMap[type] || statsMap.DEFAULT;
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      
      return [
        { label: "摸鱼熟练度", value: rand(bounds.s1[0], bounds.s1[1]) },
        { label: "离职倒计时", value: rand(bounds.s2[0], bounds.s2[1]) },
        { label: "老板 PTSD 值", value: rand(bounds.s3[0], bounds.s3[1]) },
        { label: "反 PUA 抗性", value: rand(bounds.s4[0], bounds.s4[1]) },
      ];
    };

    // 3. 【修复重点】：直接将模板和新计算的 stats 合并成一个新对象传给 setResult
    setResult({
      ...resultTemplate,
      stats: getStats(resultTemplate.type)
    });
    
    setStep(currentQuestions.length + 1);
  };

const resetQuiz = () => {
    setStep(0);
    setCurrentQuestions([]);
    setSelectedAnswers({});
    setResult(null);
    setPosterImage(null);
  };

  // --- 【新增】：生成海报的核心逻辑 ---
const generatePoster = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    
    try {
      // 稍微延迟一下，确保 React 渲染完全就绪
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // 使用 html-to-image 生成图片
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2, // 提高两倍清晰度
        backgroundColor: '#ffffff', // 强制白底
        style: {
          // 防止某些诡异的滚动条被截进去
          overflow: 'hidden'
        }
      });
      
      setPosterImage(dataUrl);
    } catch (error) {
      console.error("生成海报失败:", error);
      alert("海报生成失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

// --- 【新增背景逻辑】：统一管理颜色氛围 ---
  const getBackgroundClass = () => {
    // 封面页：极简高级灰渐变
    if (step === 0) return "bg-gradient-to-br from-gray-100 to-gray-200"; 
    
    // 【核心美化】：答题中（Question 1-10）：专属的冷灰蓝背景，让人冷静、专注
    if (step > 0 && step <= currentQuestions.length) return "bg-gradient-to-br from-slate-200 to-slate-300"; 
    
    // 结果页：根据不同人格渲染专属氛围色
    if (result) {
      switch(result.type) {
        case 'P': return "bg-gradient-to-br from-emerald-100 to-teal-200"; 
        case 'Z': return "bg-gradient-to-br from-gray-300 to-slate-400"; 
        case 'M': return "bg-gradient-to-br from-red-100 to-rose-200"; 
        case 'L': return "bg-gradient-to-br from-orange-100 to-amber-300"; 
        case 'F': return "bg-gradient-to-br from-sky-100 to-blue-200"; 
        case 'S': return "bg-gradient-to-br from-indigo-100 to-purple-200"; 
        case 'D': return "bg-gradient-to-br from-zinc-300 to-neutral-neutral"; // 亡灵色
        default: return "bg-gradient-to-br from-stone-100 to-stone-200"; 
      }
    }
    return "bg-gray-50";
  };

return (
    // 【修改 1】：最外层容器接入动态背景函数，并添加 duration-1000 实现极其平滑的色彩渐变
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans text-gray-800 transition-colors duration-1000 ease-in-out ${getBackgroundClass()}`}>
      
      {/* 【修改 2】：中间卡片改为半透明白 (bg-white/80) + 背景模糊 (backdrop-blur-xl)，形成高级的毛玻璃效果 */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
        
        {/* --- 步骤 0: 封面 --- */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">2026 打工人职场属性状态诊断报告</h1>
            <p className="text-gray-500 font-medium">从 12 个致命场景中，测出你的“班味”浓度</p>
            <button onClick={startQuiz} className="mt-8 bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95">
              开始诊断
            </button>
          </div>
        )}

        {/* --- 步骤 1~10: 答题页 (全方位视觉升级) --- */}
        {step > 0 && step <= currentQuestions.length && (
          <div className="space-y-6 animate-fade-in relative z-10">
             <div className="flex items-center justify-between text-sm text-gray-500 font-mono border-b border-gray-200/50 pb-4">
              {step > 1 ? (
                <button onClick={handlePrevious} className="flex items-center hover:text-black transition-colors">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  上一题
                </button>
              ) : ( <span>Question {step}</span> )}
              <span>{step} / {currentQuestions.length}</span>
            </div>
            
            <h2 className="text-xl font-semibold leading-relaxed text-gray-900 pt-2 pb-2">
              {currentQuestions[step - 1].title}
            </h2>
            
            <div className="space-y-4 pt-4">
              {currentQuestions[step - 1].options.map((option: any, index: number) => (
                <button 
                  key={index} 
                  onClick={() => handleOptionClick(option.score)} 
                  // 【UI终极美化】：增加左指示条占位、增加悬浮时整体的 elevate 效果和旋转
                  className="w-full text-left p-6 bg-white/40 backdrop-blur-sm border border-white/60 hover:bg-white/90 hover:border-black hover:shadow-2xl hover:scale-105 hover:rotate-1 rounded-2xl transition-all duration-300 active:scale-[0.98] group flex items-center justify-between"
                >
                  {/* 选项文本和指示条 */}
                  <div className="flex items-center gap-4 flex-1 pr-4">
                    {/* 【新增】：动态左侧装饰条 - 悬浮时高度长，其余时间高0.5 */}
                    <div className="h-0.5 group-hover:h-12 w-1 bg-black rounded-full transition-all duration-500 ease-out"></div>
                    
                    {/* 文本：悬浮时更黑、更重 */}
                    <span className="text-gray-700 font-semibold group-hover:text-black transition-colors pr-2">
                      {option.text}
                    </span>
                  </div>
                  
                  {/* 【新增美化版】：箭头: 增加黑底白箭头，并且增加滑动和透明度动效 */}
                  <div className="flex-none p-2 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                     <span className="text-2xl text-black font-mono">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- 步骤 11: 结果页 --- */}
        {step > currentQuestions.length && step !== 0 && result && (
          <div className="space-y-8 animate-fade-in">
            
            <div ref={posterRef} className="bg-white p-6 -mx-6 sm:mx-0 rounded-lg relative">
              <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
              <div className="flex justify-between items-center text-xs text-gray-400 font-mono pt-3 pb-6 border-b border-gray-100 mb-8">
                <span>SERIAL: SYBERWORKER-2026-{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                <span>TIME: {new Date().toLocaleString('zh-CN', { hour12: false })}</span>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">—— 2026 精神状态诊断结果 ——</p>
                <div className="text-6xl pt-4 animate-bounce-short">{result.icon}</div>
                <h1 className="text-2xl font-bold pt-2 text-black">
                  {result.title}
                </h1>
              </div>
              
              <div className="bg-gray-50 mt-10 p-6 rounded-lg space-y-4 relative border border-gray-100">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] rotate-12 text-6xl font-bold text-black pointer-events-none">
                  CONFIDENTIAL
                </div>
                <p className="text-gray-700 leading-relaxed font-medium z-10 relative">
                  {result.desc}
                </p>
                <blockquote className="border-t border-gray-200 pt-4 mt-4 italic text-gray-500 text-sm z-10 relative">
                  "{result.quote}"
                </blockquote>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 space-y-5">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">怨气指标分布</p>
                
                {/* 遍历渲染专属动态分数 */}
                {result.stats && result.stats.map((item: any) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 w-24 text-right font-medium">{item.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-black rounded-full transition-all duration-1000 ease-out absolute left-0" 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-800 font-bold font-mono w-10 text-right">{item.value}%</span>
                  </div>
                ))}

              </div>

              <div className="mt-12 pt-6 border-t border-dashed border-gray-200 flex justify-between items-end text-xs text-gray-400 font-mono">
                <div className="space-y-1">
                  <span>@Silly Big Personality Test</span><br />
                  <span>该测试仅供娱乐,祝各位早日发财</span>
                </div>
                <div className="w-16 h-8 bg-gray-100 flex items-center justify-center border border-gray-200 rounded text-[6px] text-gray-300">
                  |||| || | |||| |
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button onClick={generatePoster} disabled={isGenerating} className="w-full bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex justify-center items-center">
                {isGenerating ? "生成中..." : "生成专属诊断书"}
              </button>
              <button onClick={resetQuiz} className="w-full border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-white transition-colors">
                毁灭吧，重测一次
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* 预览弹窗 */}
      {posterImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setPosterImage(null)}>
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPosterImage(null)} className="absolute -top-12 right-0 text-white p-2 hover:opacity-70">✕</button>
            <img src={posterImage} alt="海报" className="w-full rounded-xl shadow-2xl mb-6" />
            <p className="text-white text-center font-medium animate-pulse">↑ 长按图片保存或分享给同事</p>
          </div>
        </div>
      )}

    </div>
  );

}