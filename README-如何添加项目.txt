合并版作品集 · 项目添加说明

一、新增一个项目
1. 打开 assets/portfolio.js，找到顶部的 SECTIONS。
2. 在对应分类（industry / research / data / consulting）的 projects 数组里加入新项目的 id。
3. 在同一文件的 PROJECTS 里复制一个项目对象，修改：
   id、section、title、client、year、tags、summary、metrics、tabs。
   可选 fullTitle（分类卡与选择器的全名）、kind（选择器小字，如“个人项目”）、short（详情右上切换按钮短名）。
4. 保存后刷新页面。分类卡片上的项目数量、项目选择器、详情页的切换器会自动更新。

二、一个分类里有多个项目时
- 分类卡片会显示项目数量；点击卡片先弹出项目选择面板，选完再进详情。
- 详情页顶部会出现项目切换按钮，可以在同一分类的项目之间切换。

三、项目详情的内容块
tabs 里每个页签的 blocks 支持以下类型：
- {type:'lead', text:'…'}                     导语
- {type:'text', title:'…', text:'…'}          小标题 + 段落
- {type:'bullets', items:[{b:'标签',t:'内容'}]} 左侧标签行
- {type:'steps', items:[{b:'步骤 1',t:'做什么',s:'产出：…'}]} 四步卡片（自动带鼠标光效）
- {type:'pairs', items:[{b:'风险名',r:'风险说明',t:'对策说明'}]} 两两配对的卡片（默认两列，窄屏一列）
- {type:'table', head:[…], rows:[[…]], caption:'表题'}  表题显示在表格上方，不写“表 1”
- {type:'image', src:'assets/shots/x.png', alt:'…', caption:'…'}
- {type:'chart', id:'olistMonthly', title:'…', sub:'…', caption:'…', cls:'chart--tall'}
- {type:'note', text:'…'}                     紫色提示条
- {type:'logic', items:['第一步','第二步',…]}  概览里的逻辑主线（紫色描边胶囊 + 箭头，序号自动生成）
- {type:'link', href:'files/xxx.pdf', label:'…'}   文字版 PDF / 外部链接（新标签打开）
  PDF 放在根目录 files/，文件名用英文短名（如 qidian-industry.pdf、garena-market.pdf、internet.pdf）。
  三份新个人项目按页签各挂对应报告；Olist 概览与品类页签另挂 olist-category.pdf；旧项目只在概览挂一份正文+参考文献版；甘肃不放。

四、图片
- 放在 assets/shots/，用相对路径引用，例如 assets/shots/new-project.png。
- 首页循环作品带在 portfolio.js 顶部的 SHOTS 数组里维护，加一项 {src,label} 即可。

五、图表
- Olist 可用 id：olistMonthly、olistDelay、olistHeat、olistRfm、olistRace、olistCatMix、olistCatTrend、olistCatRisk。
- 企点可用 id：qdCompete、qdCycles、qdWaterfall、qdLeaves。
- 甘肃咨询可用 id：gsEnergy、gsMix、gsCarbon、gsIndustry。
- 市调可用 id：svPref、svPotential；统计建模可用 id：mdCompare、mdPollutants、mdForecast。
- Olist 的 RFM 图例 13px、窄屏改为底部 12px；品类赛跑图上方居中显示当前年月，播完循环播放；x 轴标签保留一位小数。
- 数据在 assets/olist-data.js，图表配置与初始化在 assets/olist-charts.js。
- 如果要加新图表，在 olist-charts.js 里加一个 option 函数，并在 init 的 if/else 里接上。
- 详情里的 bullets、steps、table、chart、note、metrics 自动带鼠标跟随的紫色光斑，不用额外处理。

六、战略与政策研究
- 第四分类 projects 现有 gansu（甘肃省政策决策咨询课题）与 dachuang（减污降碳协同支持绿色高质量发展）。
- 新增咨询项目同样在 consulting.projects 里加 id，并在 PROJECTS 里建对象；卡片会自动显示项目短名，点击后弹出项目选择器。

七、调试
- 地址后加 ?static=1 关闭动效和入场加载，便于截图/检查版式。
- 直接打开 index.html 即可，无构建步骤、无外部依赖。
