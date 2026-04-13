import  { useState,useRef } from 'react';
import { toPng } from 'html-to-image';

// --- 1. 30道完整题库 (ALL_QUESTIONS) ---
const ALL_QUESTIONS = [
  { id: 1, title: "周五17:58，钉钉/企业微信突然@全体甩来一篇《吃亏是福》，要求立刻写200字心得，周一早会还要当众分享，你：", options: [{ text: "已读不回，准点关电脑拎包跑路，爱谁谁去死", score: { F: 1 } }, { text: "打开AI三十秒生成，备注‘已深刻领悟领导福报’秒交", score: { B: 1 } }, { text: "在心里把领导祖宗十八代问候到吐血，然后咬牙憋出一篇狗屁", score: { M: 1 } }, { text: "回复：建议公司先降薪一半让我多吃点亏积福吧傻逼", score: { L: 1 } }] },
  { id: 2, title: "跨部门甩锅+阴阳怪气‘这不是常识吗？’发到群里，你：", options: [{ text: "微笑回‘好的，感谢同步，已知会’，内心已死", score: { Z: 1 } }, { text: "截图扔进摸鱼小群，疯狂输出脏话三分钟泄愤", score: { S: 1 } }, { text: "直接@对方老板：麻烦给份SOP和原始需求记录，别他妈甩锅了", score: { F: 1 } }, { text: "默默截图归档，留着以后绩效面谈当呈堂证供", score: { M: 1 } }] },
  { id: 3, title: "老板说‘搬到我办公室门口坐，底薪翻倍，全天360度监控’，你：", options: [{ text: "只要钱到位，我能坐他腿上办公顺便给他捏肩捶腿舔鞋", score: { P: 1 } }, { text: "算了吧，这点钱还不够我看一次心理医生的，谢谢", score: { D: 1 } }, { text: "先答应，回头买最厚的防窥膜+隔音耳塞+假人摆在工位装死", score: { Z: 1 } }, { text: "去应聘那个监控岗位，反向监控他全家祖坟", score: { L: 1 } }] },
  { id: 4, title: "早高峰地铁挤成沙丁鱼罐头，你现在的状态是：", options: [{ text: "眼神死寂，像一具被惯性推着走的行尸走肉", score: { D: 1 } }, { text: "疯狂刷离职暴富帖，幻想明天就提桶跑路", score: { P: 1 } }, { text: "谁挤我我就把谁拉进精神暗杀名单第114514位", score: { M: 1 } }, { text: "利用缝隙改PPT，试图卷死同梯层所有畜生", score: { V: 1 } }] },
  { id: 5, title: "年会老板含泪画大饼‘明年公司一定上市’，全场鼓掌，你：", options: [{ text: "鼓掌最响并大喊‘老板英明’，生怕别人看不见", score: { B: 1 } }, { text: "低头猛吃自助，毕竟这饼还没肘子实在", score: { Z: 1 } }, { text: "当场打开手机查公司负债率和最近三轮裁员名单", score: { M: 1 } }, { text: "举手问：上市后能把我工位换到窗边吗？傻逼", score: { L: 1 } }] },
  { id: 6, title: "公司最豪华、最干净、唯一有香氛的那个马桶隔间被人占了，你：", options: [{ text: "跑去别的楼层，当做是免费健身拉练", score: { Z: 1 } }, { text: "在门外疯狂叹气+跺脚+砸门，用精神攻击施压", score: { M: 1 } }, { text: "回去算这10分钟没带薪拉屎亏了多少钱", score: { P: 1 } }, { text: "从外面直接把隔间灯关掉+门把手反锁+贴纸条‘维修中’", score: { L: 1 } }] },
  { id: 7, title: "下午三点，你已经把今天所有活干完，工位上空空荡荡，你会：", options: [{ text: "对着空白Excel假装沉思，维持‘我在认真工作’人设", score: { Z: 1 } }, { text: "去找领导要新活儿，坚决不能让工时浪费", score: { V: 1 } }, { text: "切屏看股票基金，研究副业暴富路线图", score: { P: 1 } }, { text: "去茶水间把所有零食吃一遍，顺便把咖啡机掏空", score: { S: 1 } }] },
  { id: 8, title: "公司空调冷得像停尸房，冻得你手指发紫还得假装精神饱满，你：", options: [{ text: "心如死灰裹紧小毯子，觉得这就是自己的停尸间", score: { D: 1 } }, { text: "趁没人偷偷把总闸线拔了，让大家一起冻成狗", score: { M: 1 } }, { text: "带取暖器，直到把整层楼搞跳闸停电", score: { L: 1 } }, { text: "立刻在群里发：‘冷气真给力，老板对环境要求真高！’", score: { B: 1 } }] },
  { id: 9, title: "电脑在保存方案前一秒蓝屏，你第一反应是：", options: [{ text: "太好了，老天爷终于让我歇会儿，感恩", score: { Z: 1 } }, { text: "在脑海里把鼠标砸向显示器砸到屏幕碎成渣", score: { M: 1 } }, { text: "冷静重启，庆幸自己是按Ctrl+S的内卷奴隶", score: { V: 1 } }, { text: "直接跟老板说：电脑烧了，我要下班回家等死", score: { F: 1 } }] },
  { id: 10, title: "公司群突然发50块拼手气红包，你抢到0.01元：", options: [{ text: "心里痛骂老板小气到抠脚缝，发表情包‘谢谢老板’", score: { P: 1 } }, { text: "无所谓，只是肌肉记忆在抽搐", score: { Z: 1 } }, { text: "点开看谁抢了最佳，暗暗记仇一辈子", score: { M: 1 } }, { text: "立刻发0.02的红包嘲讽回去，顺便艾特他全家", score: { L: 1 } }] },
  { id: 11, title: "平时工作上才有交集的同事突然发来结婚请柬，你：", options: [{ text: "转200块，随后悄悄屏蔽+取消关注", score: { P: 1 } }, { text: "已读不回，主打一个人间蒸发", score: { S: 1 } }, { text: "回复：那天我要参加一个葬礼，抱歉", score: { M: 1 } }, { text: "发朋友圈祝贺并@老板夸公司文化好凝聚力强", score: { B: 1 } }] },
  { id: 12, title: "新实习生眼睛发光地喊‘我爱上班！好充实！’，你：", options: [{ text: "用看死人的空洞眼神扫了他一眼", score: { D: 1 } }, { text: "高价把你二手防辐射键盘卖给他", score: { P: 1 } }, { text: "立刻拿出自己整理的70页SOP要卷死他", score: { V: 1 } }, { text: "拍他肩膀：好，今晚这锅你来背，欢迎加入牛马群", score: { L: 1 } }] },
  { id: 13, title: "午饭时老板端着盘子突然坐到你对面，你：", options: [{ text: "2倍速狂吃，噎死也要逃离现场", score: { F: 1 } }, { text: "面无表情，当对面坐着个会说话的猕猴桃", score: { Z: 1 } }, { text: "立刻放下筷子，开始深情汇报自己昨晚加班的细节", score: { B: 1 } }, { text: "顺势问：这顿饭能不能走报销？不然我吃不下", score: { P: 1 } }] },
  { id: 14, title: "发现平时比你还能摸鱼的同事年终奖居然比你高，你：", options: [{ text: "立刻更新简历，打开Boss直聘", score: { F: 1 } }, { text: "从明天起精准对标他的工作量，多干一点算我输", score: { Z: 1 } }, { text: "深夜在知乎匿名问‘怎么不动声色举报同事’", score: { M: 1 } }, { text: "在反思是不是自己每天加班到11点还不够努力", score: { V: 1 } }] },
  { id: 15, title: "同事在厕所隔间崩溃大哭，你会：", options: [{ text: "从门缝塞张纸巾，假装自己是幽灵飘过", score: { S: 1 } }, { text: "隔着门说：没事，大家早晚都要死的", score: { D: 1 } }, { text: "直接把猎头微信名片从门缝塞进去", score: { P: 1 } }, { text: "在隔壁隔间也开始哭，顺便逃避下午的会", score: { Z: 1 } }] },
  { id: 16, title: "领导提需求：‘我要一种五彩斑斓的黑’，你：", options: [{ text: "只要钱到位，纯黑里面加彩虹我都给你弄", score: { P: 1 } }, { text: "大喊‘领导这个想法太天才了，打破了行业常规！’", score: { B: 1 } }, { text: "表面答应，背地里把他做成表情包发摸鱼群", score: { S: 1 } }, { text: "直接整爆闪霓虹灯效果，问他够不够斑斓傻逼", score: { L: 1 } }] },
  { id: 17, title: "深夜11:31，领导突然私聊发来一句‘在吗？’，你：", options: [{ text: "秒回‘在的老板’，大脑开始计算加班费", score: { P: 1 } }, { text: "明天早上9点回‘不好意思昨晚睡死过去了’", score: { S: 1 } }, { text: "手机扔一边，在床上阴暗扭动两分钟想死", score: { M: 1 } }, { text: "马上爬起来打开电脑，生怕回复慢了被扣绩效", score: { V: 1 } }] },
  { id: 18, title: "两句话就能说清的事，被拉去开了两小时会，你：", options: [{ text: "自带电脑，会上疯狂敲键盘把其他活全干完", score: { V: 1 } }, { text: "练习睁着眼睛睡觉的神功", score: { Z: 1 } }, { text: "把每句废话都记在小本本上留作呈堂证供", score: { M: 1 } }, { text: "尿遁3次+屎遁2次，物理逃避", score: { F: 1 } }] },
  { id: 19, title: "周末你在深山老林露营，没信号，老板让你紧急处理报表，你：", options: [{ text: "满山找信号处理完，周一拿着截图去找财务要加班费", score: { P: 1 } }, { text: "觉得这就是命，自己本就不配拥有周末", score: { D: 1 } }, { text: "回复‘好的’，然后假装没网一直拖到周一", score: { Z: 1 } }, { text: "找路人录段‘已被黑熊叼走’视频发过去", score: { L: 1 } }] },
  { id: 20, title: "绩效面谈老板说‘给你升职，但目前没有预算涨薪’，你：", options: [{ text: "“只谈理想不谈钱是耍流氓，我不升”", score: { P: 1 } }, { text: "“感恩公司栽培，我一定继续把公司当家！”", score: { B: 1 } }, { text: "接受，然后用新职权把所有活用权限分出去", score: { Z: 1 } }, { text: "“谢谢老板，请问能把这个title刻在我的墓碑上吗”", score: { M: 1 } }] },
  { id: 21, title: "清晨7:00闹钟响起那一刻，你的第一想法是：", options: [{ text: "如果今天出门被创飞，是不是就可以长眠了", score: { D: 1 } }, { text: "挺住，今天的出场费还有2小时到账", score: { P: 1 } }, { text: "满脑子都是昨天没干完的PPT，直接惊醒", score: { V: 1 } }, { text: "对着闹钟进行3分钟恶毒咒骂", score: { M: 1 } }] },
  { id: 22, title: "HR要求每天早上全员在工位前跳广播体操，你会：", options: [{ text: "动作像一只患关节炎的树懒，敷衍到底", score: { Z: 1 } }, { text: "站第一排跳得最用力，努力引起老板注意", score: { B: 1 } }, { text: "用极致夸张的社会摇动作震撼全场", score: { L: 1 } }, { text: "躲在楼梯间刷手机，死无对证", score: { S: 1 } }] },
  { id: 23, title: "你出差垫付50块打车费，财务以‘发票折角’为由拒报，你：", options: [{ text: "站在财务桌前跟她battle两小时", score: { L: 1 } }, { text: "算了，自己掏钱，这就是底层牛马的宿命", score: { D: 1 } }, { text: "每天偷偷从公司带一卷卫生纸，直到回本", score: { P: 1 } }, { text: "每天把这张发票重新提交一次，玩极限拉扯", score: { M: 1 } }] },
  { id: 24, title: "如果你必须拥有一种职场超能力，你会选：", options: [{ text: "“提款机体质”：被骂一句账户自动+100", score: { P: 1 } }, { text: "“真实滤镜”：能看到每个同事内心骂人的弹幕", score: { M: 1 } }, { text: "“闪现回城”：遇到傻X直接瞬移回自己床上", score: { F: 1 } }, { text: "“时间停止”：冻结时间把所有活儿干完拿第一", score: { V: 1 } }] },
  { id: 25, title: "你在公司大群里不小心发出老板最丑的表情包，撤回时间已过，你：", options: [{ text: "光速离职，换城市重新做人", score: { F: 1 } }, { text: "立刻发‘不好意思号被盗了’然后装死到底", score: { S: 1 } }, { text: "立刻连发十个下跪求饶表情包并转账请全群喝奶茶", score: { B: 1 } }, { text: "去问老板这个表情包有没有增加一点亲和力", score: { L: 1 } }] },
  { id: 26, title: "面对‘公司就是家’这种言论，你的态度是：", options: [{ text: "那我今天不穿裤子来上班也没关系吧", score: { L: 1 } }, { text: "确实，这是我素颜待得最久的地方", score: { Z: 1 } }, { text: "谁家每个月只给这点生活费还天天想把我赶出去？", score: { P: 1 } }, { text: "对，我就是公司的亲儿子，誓与公司共存亡", score: { B: 1 } }] },
  { id: 27, title: "下午6点准时下班，走到楼下发现下暴雨，你没带伞：", options: [{ text: "立马转身回去继续卷，绝对不能浪费这加班的大好时机", score: { V: 1 } }, { text: "回工位躺平，用公司电充手机蹭空调", score: { Z: 1 } }, { text: "在门口把老板顺风车直接拦下来", score: { L: 1 } }, { text: "打开打车软件，看到3倍溢价，心在滴血", score: { P: 1 } }] },
  { id: 28, title: "你心目中最完美的离职方式是：", options: [{ text: "被公司N+1辞退，拿着赔偿金快乐消失", score: { P: 1 } }, { text: "静音离职，什么也不说，连夜退出所有群", score: { S: 1 } }, { text: "群发一封全员邮件，把所有人黑料爆一遍", score: { M: 1 } }, { text: "老死在工位上，化作公司永远的地缚灵", score: { D: 1 } }] },
  { id: 29, title: "对自己目前工作的终极愿景是：", options: [{ text: "平安退休，熬死这帮资本家，拿走所有养老金", score: { P: 1 } }, { text: "公司原地倒闭，彻底结束这场精神凌迟", score: { M: 1 } }, { text: "当上老板，让现在的领导每天给我磕头", score: { L: 1 } }, { text: "当上全公司最优秀的劳模，奖状贴满整墙", score: { B: 1 } }] },
  { id: 30, title: "如果生活可以重来，你还会选择现在这个职业吗？", options: [{ text: "会，因为干别的可能更穷更惨", score: { P: 1 } }, { text: "不会，我想去路边摊炸油条或者深山养猪", score: { F: 1 } }, { text: "重来？我希望自己根本不要出生", score: { D: 1 } }, { text: "会，我要从胎教开始卷，争取20岁当上CTO", score: { V: 1 } }] },
  { id: 31, title: "公司宣布取消大小周，工资直接砍15%，但活儿一点没少，你：", options: [{ text: "默默接受，继续996，连反抗的力气都没了", score: { D: 1 } }, { text: "立刻打开Boss直聘，准备提桶", score: { F: 1 } }, { text: "在心里骂街，然后发朋友圈‘终于双休了真好’", score: { S: 1 } }, { text: "跑去老板办公室说：没事，为了公司降薪我也愿意", score: { B: 1 } }] },
  { id: 32, title: "绩效面谈老板说‘给你升职，但预算有限不涨薪’，你：", options: [{ text: "笑眯眯接受，立马把title塞简历找下家", score: { F: 1 } }, { text: "在心里把老板祖宗问候一遍然后点头", score: { M: 1 } }, { text: "直接说‘只谈理想不谈钱是耍流氓’", score: { L: 1 } }, { text: "低头感谢，回家红着眼继续熬夜卷KPI", score: { V: 1 } }] },
  { id: 33, title: "HR突然找你谈话说‘你最近考勤靠后，要注意哦’，你：", options: [{ text: "点头哈腰说下次早点到，晚上继续加班刷好感", score: { B: 1 } }, { text: "表面答应，回家火速更新简历", score: { F: 1 } }, { text: "在心里暗杀HR全家，脸上保持死寂微笑", score: { M: 1 } }, { text: "直接反问：那我每天加班到11点的工时能折算成工资吗？", score: { P: 1 } }] },
  { id: 34, title: "同事说公司平均司龄只有半年，工作两年就是‘活化石’，你：", options: [{ text: "默默算自己还能撑几个月，然后继续摸鱼", score: { Z: 1 } }, { text: "立刻打开招聘软件，准备加入逃亡大军", score: { F: 1 } }, { text: "在心里骂公司畜生，然后继续卷别人", score: { V: 1 } }, { text: "发摸鱼群：哈哈哈哈我已经是个死人了", score: { D: 1 } }] },
  { id: 35, title: "领导要求每天必须发日报体现‘存在感’，你其实啥也没干，你：", options: [{ text: "用AI生成一堆废话，备注‘全心全意为公司服务’", score: { B: 1 } }, { text: "复制粘贴上周内容，闭着眼睛发出去", score: { Z: 1 } }, { text: "在日报里疯狂塞专业黑话，装作做了一个亿的项目", score: { P: 1 } }, { text: "疯狂卷KPI，硬是写出三页纸的排版和饼图", score: { V: 1 } }] },
  { id: 36, title: "周末被强制拉去‘团队建设’爬山，名义上自愿实际扣工资，你：", options: [{ text: "假装很开心，紧跟老板步伐端茶倒水", score: { B: 1 } }, { text: "宁愿扣钱也不去，在家躺尸发霉", score: { Z: 1 } }, { text: "去现场疯狂阴阳怪气，每走一步都要大声叹气", score: { L: 1 } }, { text: "为了不扣钱强行爬山，心里把公司祖坟刨了", score: { M: 1 } }] },
  { id: 37, title: "35岁以上被HR‘婉拒’入职，你已经32岁了，你：", options: [{ text: "焦虑到大把掉头发，每天强迫自己卷到凌晨2点", score: { V: 1 } }, { text: "心如死灰，觉得这辈子已经看到头了，静静等死", score: { D: 1 } }, { text: "直接群里@HR问：我还能活多久？", score: { L: 1 } }, { text: "开始疯狂搞副业，囤积现金流", score: { P: 1 } }] },
  { id: 38, title: "抢会议室成了你一天的最高成就，你：", options: [{ text: "提前半小时占坑，连拉屎都在会议室里解决", score: { V: 1 } }, { text: "抢不到就躺平，在工位发呆", score: { Z: 1 } }, { text: "在摸鱼群吐槽公司抠门到连会议室都不够", score: { S: 1 } }, { text: "直接把领导的会议室占了，假装不知道", score: { M: 1 } }] },
  { id: 39, title: "老板让你‘帮忙带带新人’，其实是把所有活全推给你，你：", options: [{ text: "“收到老板！保证完成任务！”晚上回家加班到哭", score: { B: 1 } }, { text: "表面答应，背地里用精神压迫把活全甩给新人", score: { M: 1 } }, { text: "直接拒绝，说我自己都快死了", score: { L: 1 } }, { text: "把新人卷跑，证明自己才是唯一的神", score: { V: 1 } }] },
  { id: 40, title: "公司一边裁员一边疯狂招聘，你：", options: [{ text: "默默更新简历，准备下一轮被优化", score: { F: 1 } }, { text: "继续疯狂卷KPI，用内卷证明自己的含金量", score: { V: 1 } }, { text: "在心里冷笑，拿着瓜子等着看谁先死", score: { S: 1 } }, { text: "假装不知道，继续跑去领导办公室表忠心", score: { B: 1 } }] },
  { id: 41, title: "领导在群里发‘我们就是一家人’，你：", options: [{ text: "秒回‘感恩公司，家人们真好’，还发了个玫瑰花", score: { B: 1 } }, { text: "已读不回，主打一个人间蒸发", score: { S: 1 } }, { text: "回复：那我能去您家吃饭吗爸爸？", score: { L: 1 } }, { text: "立刻发工作汇报，证明自己是为家操碎心的人", score: { V: 1 } }] },
  { id: 42, title: "你发现自己已经在公司干满一年，成了‘老员工’，你：", options: [{ text: "算算自己还有几个月咽气，然后继续当行尸走肉", score: { D: 1 } }, { text: "开始疯狂卷KPI，怕被比下去被优化", score: { V: 1 } }, { text: "在摸鱼群发：我已经社死一年了", score: { S: 1 } }, { text: "偷偷把所有业务文档拷走，准备提桶", score: { F: 1 } }] },
  { id: 43, title: "HR发全员邮件要求‘拒绝表演式上班’，但KPI一分没少，你：", options: [{ text: "表面答应，私下把表演艺术拔高到奥斯卡级别", score: { V: 1 } }, { text: "直接回复所有人：那能取消打卡吗？", score: { L: 1 } }, { text: "继续僵尸式摸鱼，等着被优化", score: { Z: 1 } }, { text: "去HR面前痛哭流涕说自己一定改过自新", score: { B: 1 } }] },
  { id: 44, title: "钉钉步数排行榜你每天倒数第一，你：", options: [{ text: "假装没看见，我只是个不用走路的废物", score: { D: 1 } }, { text: "买个摇步器疯狂刷步数，绝不落后于人", score: { V: 1 } }, { text: "在群里阴阳‘我这是工位长出蘑菇了’", score: { L: 1 } }, { text: "趁午休把手机绑在公司狗身上跑三圈", score: { M: 1 } }] },
  { id: 45, title: "公司组织‘相亲会’解决单身问题，实际是强制参加，你：", options: [{ text: "积极参加并主动给老板倒茶，当做社交舞台", score: { B: 1 } }, { text: "直接拒绝，说我已经和公司领证了", score: { V: 1 } }, { text: "去现场坐在角落里疯狂记下所有人的黑料", score: { M: 1 } }, { text: "躺平不去，假装自己已经是个死人", score: { Z: 1 } }] }
];

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
  V: {
    type: "V",
    icon: "🏋️‍♂️",
    title: "【卷到秃头的内卷战神】",
    desc: "你不是爱工作，你是怕不卷就被优化。你表面光鲜，晚上回家哭着掉头发。",
    quote: "卷死别人，卷死自己，最后卷死公司，大家一起死。"
  },
  B: {
    type: "B",
    icon: "🐕",
    title: "【舔到骨头里的顶级狗腿子】",
    desc: "你把尊严踩在脚下，只为老板一句‘好样的’。内心早已社死，却还在假笑。",
    quote: "老板放个屁都是香的，我负责闻还要说真香。"
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
  
  const posterRef = useRef<HTMLDivElement>(null); 
  const [posterImage, setPosterImage] = useState<string | null>(null); 
  const [isGenerating, setIsGenerating] = useState(false); 

  const startQuiz = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 15));
    setSelectedAnswers({});
    setResult(null);
    setPosterImage(null);
    setStep(1);
  };

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

 // --- 【优化重点】：接入 V 和 B 属性的记分和指标逻辑 ---
  const calculateResult = (finalAnswers: Record<number, Record<string, number>>) => {
    // 【修改点1】：初始化分数板，加入 V 和 B
    const totalScores: Record<string, number> = { P:0, Z:0, M:0, L:0, S:0, F:0, D:0, V:0, B:0 };
    Object.values(finalAnswers).forEach(scoreRecord => {
      Object.keys(scoreRecord).forEach(key => {
        if(totalScores[key] !== undefined) {
          totalScores[key] += scoreRecord[key];
        }
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

    const resultTemplate = RESULTS[maxKey as keyof typeof RESULTS] || RESULTS.DEFAULT;

    // 【修改点2】：为 V 和 B 配置专属的极致数值
    const getStats = (type: string) => {
      // s1: 摸鱼熟练度, s2: 离职倒计时, s3: 老板 PTSD, s4: 反 PUA 抗性
      const statsMap: Record<string, {s1:number[], s2:number[], s3:number[], s4:number[]}> = {
        P: { s1: [85, 99], s2: [40, 60], s3: [10, 30], s4: [90, 99] }, 
        Z: { s1: [90, 99], s2: [80, 95], s3: [5, 20],  s4: [95, 99] }, 
        M: { s1: [40, 60], s2: [10, 30], s3: [90, 99], s4: [70, 90] }, 
        L: { s1: [20, 40], s2: [1, 10],  s3: [80, 99], s4: [99, 99] }, 
        F: { s1: [60, 80], s2: [1, 5],   s3: [85, 99], s4: [50, 70] }, 
        S: { s1: [70, 90], s2: [40, 60], s3: [60, 80], s4: [40, 60] }, 
        D: { s1: [80, 95], s2: [10, 20], s3: [85, 99], s4: [99, 99] }, 
        // 【新增卷王】：绝不摸鱼，容易被洗脑(抗性低)，处于崩溃边缘(PTSD高)
        V: { s1: [1, 10],  s2: [20, 40], s3: [90, 99], s4: [5, 15]  }, 
        // 【新增狗腿】：毫无底线，死不离职，视老板为神(PTSD极低)
        B: { s1: [10, 30], s2: [1, 5],   s3: [0, 5],   s4: [0, 5]   }, 
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

  // --- 生成海报逻辑 ---
  const generatePoster = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        style: { overflow: 'hidden' }
      });
      setPosterImage(dataUrl);
    } catch (error) {
      console.error("生成海报失败:", error);
      alert("海报生成失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 【新增背景逻辑】：加入 V 和 B 的专属氛围色 ---
  const getBackgroundClass = () => {
    if (step === 0) return "bg-gradient-to-br from-gray-100 to-gray-200"; 
    if (step > 0 && step <= currentQuestions.length) return "bg-gradient-to-br from-slate-200 to-slate-300"; 
    
    if (result) {
      switch(result.type) {
        case 'P': return "bg-gradient-to-br from-emerald-100 to-teal-200"; 
        case 'Z': return "bg-gradient-to-br from-gray-300 to-slate-400"; 
        case 'M': return "bg-gradient-to-br from-red-100 to-rose-200"; 
        case 'L': return "bg-gradient-to-br from-orange-100 to-amber-300"; 
        case 'F': return "bg-gradient-to-br from-sky-100 to-blue-200"; 
        case 'S': return "bg-gradient-to-br from-indigo-100 to-purple-200"; 
        case 'D': return "bg-gradient-to-br from-zinc-300 to-neutral-400"; 
        // 【新增色系】
        case 'V': return "bg-gradient-to-br from-fuchsia-100 to-purple-300"; // 内卷战神：让人焦虑心梗的“脱发紫”
        case 'B': return "bg-gradient-to-br from-yellow-100 to-amber-300"; // 顶级狗腿：谄媚讨好的“金毛黄”
        default: return "bg-gradient-to-br from-stone-100 to-stone-200"; 
      }
    }
    return "bg-gray-50";
  };

  return (
    // 【修改核心】：最外层容器接入动态背景函数，并添加 duration-1000 平滑色彩渐变
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans text-gray-800 transition-colors duration-1000 ease-in-out ${getBackgroundClass()}`}>
      {/* 玻璃拟态卡片背景 */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
        
        {/* --- 步骤 0: 封面 --- */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">2026 打工人职场属性诊断报告</h1>
            <p className="text-gray-500 font-medium">从 15 个致命场景中，测出你的“班味”浓度</p>
            <button onClick={startQuiz} className="mt-8 bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95">
              开始诊断
            </button>
          </div>
        )}

        {/* --- 步骤 1~10: 答题页 (高级毛玻璃悬浮卡片) --- */}
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
                  // 【iOS 终极修复版】：
                  // 1. 彻底删除了 hover:scale 和 active:scale，杜绝苹果系统把文字转成位图模糊
                  // 2. 改用 hover:-translate-y-1 做极其轻微的上浮，安全且有动感
                  // 3. 点击反馈 (active) 改为背景色加深 (active:bg-gray-100) 和边框变色
                  // 4. 移除了 transform-gpu，把字体渲染权交还给原生系统
                  className="w-full text-left p-5 sm:p-6 bg-white/60 border border-white/60 hover:bg-white/95 hover:border-black hover:shadow-xl hover:-translate-y-1 active:bg-gray-100 active:border-gray-300 active:translate-y-0 rounded-xl sm:rounded-2xl transition-all duration-300 group flex items-center justify-between antialiased"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 pr-4">
                    {/* 动态左指示条 */}
                    <div className="h-1 sm:h-0.5 group-hover:h-10 sm:group-hover:h-12 w-1 bg-gray-400 group-hover:bg-black rounded-full transition-all duration-500 ease-out"></div>
                    
                    {/* 选项文本 */}
                    <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-black transition-colors pr-2">
                      {option.text}
                    </span>
                  </div>
                  
                  {/* 滑出箭头 */}
                  <div className="flex-none p-1 sm:p-2 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                     <span className="text-xl sm:text-2xl text-black font-mono leading-none">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- 步骤 11: 结果页 (手机端优先优化) --- */}
        {step > currentQuestions.length && step !== 0 && result && (
  <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10">
    
    {/* 被截图 DOM 区域 */}
    <div ref={posterRef} className="bg-white p-5 sm:p-8 -mx-5 sm:mx-0 rounded-lg relative max-w-[340px] sm:max-w-lg mx-auto overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
      
      {/* SERIAL/TIME */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-400 font-mono pt-3 pb-5 border-b border-gray-100 mb-6 sm:mb-8">
        <span className="truncate">SERIAL: SYBERWORKER-2026-{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
        <span>TIME: {new Date().toLocaleString('zh-CN', { hour12: false, minute: '2-digit', second: '2-digit' }).slice(-8)}</span>
      </div>

      {/* 图片与标题展示区 */}
      <div className="text-center space-y-5 sm:space-y-6">
        <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">—— 打工人精神状态诊断报告 ——</p>
        
        {/* 【尺寸升级】：
           1. 手机端 w-48 (192px)，桌面端 sm:w-64 (256px)。
           2. 维持 rounded-full 或改为 rounded-3xl (大圆角矩形) 也很符合盲盒包装感。
           3. 增加了 ring 装饰边框，增加高级感。
        */}
        <div className="relative inline-block">
          <img 
            src={`results/${result.type}.webp`}
            alt={result.title}
            className="w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-3xl object-cover shadow-2xl ring-8 ring-gray-50 animate-bounce-short"
          />
          {/* 可选：在图片右下角加一个微小的性格水印标识 */}
          {/* <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] px-2 py-1 rounded font-mono shadow-lg">
            TYPE: {result.type}
          </div> */}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black pt-4 text-black leading-tight px-2 tracking-tight">
          {result.title}
        </h1>
      </div>
      
      {/* 描述区域 (增加了 mt-8 留出呼吸感) */}
      <div className="bg-gray-50 mt-10 p-5 sm:p-6 rounded-2xl space-y-4 relative border border-gray-100">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] rotate-12 text-6xl sm:text-7xl font-bold text-black pointer-events-none">
          TOP SECRET
        </div>
        <p className="text-sm sm:text-lg text-gray-800 leading-relaxed font-bold z-10 relative">
          {result.desc}
        </p>
        <blockquote className="border-t border-gray-200 pt-4 mt-4 italic text-gray-500 text-xs sm:text-sm z-10 relative">
          "{result.quote}"
        </blockquote>
      </div>

              {/* 怨气指标区 --- 【手机优化重点：text-xs】 */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100 space-y-4 sm:space-y-5">
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest text-center">怨气指标分布</p>
                
                {result.stats && result.stats.map((item: any) => (
                  <div key={item.label} className="flex items-center gap-3 sm:gap-4">
                    <span className="text-[10px] sm:text-xs text-gray-500 w-20 sm:w-24 text-right font-medium truncate">{item.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-black rounded-full transition-all duration-1000 ease-out absolute left-0" 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-800 font-bold font-mono w-8 sm:w-10 text-right">{item.value}%</span>
                  </div>
                ))}
              </div>

              {/* 底部 --- 【手机优化重点：text-[10px]】 */}
              <div className="mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-dashed border-gray-200 flex justify-between items-end text-[10px] text-gray-400 font-mono">
                <div className="space-y-1">
                  <span>@Silly Big Personality Test</span><br />
                  <span>该测试仅供娱乐,祝各位早日发财</span>
                </div>
                <div className="w-14 h-7 sm:w-16 sm:h-8 bg-gray-100 flex items-center justify-center border border-gray-200 rounded text-[6px] text-gray-300">
                  |||| || | |||| |
                </div>
              </div>
            </div>

            {/* 操作区 (不变) */}
            <div className="space-y-3 pt-4 sm:pt-6">
              <button onClick={generatePoster} disabled={isGenerating} className="w-full bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 hover:shadow-lg transition-colors disabled:bg-gray-400 flex justify-center items-center">
                {isGenerating ? "生成中..." : "生成专属诊断书"}
              </button>
              <button onClick={resetQuiz} className="w-full border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-white transition-colors">
                毁灭吧，重测一次
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* 预览弹窗 - 【手机优化重点：max-w-[280px]】 */}
      {posterImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setPosterImage(null)}>
          <div className="relative w-full max-w-[280px] sm:max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPosterImage(null)} className="absolute -top-12 right-0 text-white p-2 hover:opacity-70">
               ✕
            </button>
            <img src={posterImage} alt="海报" className="w-full rounded-xl shadow-2xl mb-6" />
            <p className="text-white text-center font-medium animate-pulse">↑ 长按图片保存或分享给同事</p>
          </div>
        </div>
      )}
    </div>
  );

}