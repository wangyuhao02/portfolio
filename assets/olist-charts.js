/* Olist 图表：沿用原分析页的数据与动效 */
(function(){
  'use strict';
  var D = window.OLIST_DATA || null;
  var GS = {
    years:['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024'],
    energy:[4631.59,4884.56,5362.84,5538.21,5926.5,5816.78,5667.42,5749.1,6107.42,6394.63,6729.39,7033.91,7778.97,8758.66,9489.66],
    mix:{
      coal:[68.4,64.6,60.3,55.5,54.6,52,51.9,45.2,40.8,39.5,39.2,40.5,44.3,44.1,42.9],
      oil:[11.8,14.7,16.8,18.3,18.6,20.1,20.2,20.6,20.1,20.2,20.6,20.9,20.1,19,18.9],
      gas:[0.3,0.2,0.3,0.3,0.3,0.3,0.2,0.4,0.5,0.3,0.7,0.7,0.8,1,1.2],
      power:[19.6,20.4,22.6,26,26.5,27.6,27.7,33.9,38.7,40,39.6,37.9,34.8,35.8,37.1]
    },
    carbon:[15360.71,17176.98,17601.17,18242.31,18041.62,17970.64,17775.49,18495.14,19059.59,19412.53,19882.64,21033.92,20877.65,22488.14,23235.64],
    industry:{
      second:[48.44,47.51,46.23,44.46,43.31,38.21,35.95,34.29,34.08,32.83,31.46,33.75,35.32,34.4,34.12],
      third:[39.58,41.58,42.81,44.6,46.01,50.6,52.46,53.99,54.5,55.02,55.31,52.9,51.19,51.77,53.41]
    }
  };
  var CH = {}, TIMERS = {};
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /static=1/.test(location.search);
  var C = {cobalt:'#1F3BFF', red:'#C2412C', slate:'#2E454E', muted:'#8A9299'};
  var MONO = 'IBM Plex Mono, Consolas, monospace';
  var SANS = 'Inter, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif';
  var CAT = {health_beauty:'健康美容',watches_gifts:'手表礼品',bed_bath_table:'床品家纺',sports_leisure:'运动休闲',computers_accessories:'电脑配件',furniture_decor:'家具装饰',housewares:'家居用品',cool_stuff:'酷玩礼品'};
  var CATCOL = {'health_beauty':'#1F3BFF','watches_gifts':'#4A66FF','bed_bath_table':'#7C8BFF','sports_leisure':'#2E454E','computers_accessories':'#5E7783','furniture_decor':'#6E5BD6','housewares':'#8A9299','cool_stuff':'#C9D3DF'};
  var rfmNames = {'1':'核心高价值','2':'高价值流失风险','3':'新客或潜力','4':'低价值沉睡','5':'一般成长'};
  var rfmColors = {'1':'#111015','2':'#C2412C','3':'#6C4DFF','4':'#D3D7DB','5':'#1F3BFF'};
  var delayNames = ['准时','延迟 1–3 天','延迟 4–7 天','延迟 ≥7 天'];

  function fmt(n){ return Number(n).toLocaleString('en-US'); }
  function pct(n){ return Number(n).toFixed(2); }
  function wan(n){ return (Number(n)/10000).toFixed(1); }
  function tip(extra){
    return Object.assign({
      backgroundColor:'#FFFFFF', borderColor:'#D3D7DB', borderWidth:1, padding:[10,12],
      textStyle:{color:'#232527', fontFamily:SANS, fontSize:13},
      extraCssText:'box-shadow:0 10px 28px rgba(16,17,19,.10);border-radius:2px;'
    }, extra||{});
  }
  function axis(extra){
    return Object.assign({
      axisLine:{lineStyle:{color:'#D3D7DB'}}, axisTick:{show:false},
      axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:11},
      splitLine:{lineStyle:{color:'#E7EAED'}}
    }, extra||{});
  }

  function monthly(){
    var months = D.monthly.map(function(m){return m.m;});
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:14,top:46,bottom:54,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'line',lineStyle:{color:'#8A9299',type:'dashed'}},formatter:function(ps){
        var d=D.monthly[ps[0].dataIndex];
        return '<b>'+d.m+'</b><br>收入 R$ '+fmt(Math.round(d.revenue))+'<br>有效订单 '+fmt(d.orders)+' 笔<br>延迟率 '+pct(d.late)+'% · 差评率 '+pct(d.bad)+'%';
      }}),
      legend:{right:0,top:0,itemWidth:10,itemHeight:10,textStyle:{color:'#5F656B',fontSize:12}},
      xAxis:{type:'category',data:months,axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,interval:2},axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false}},
      yAxis:[
        axis({type:'value',name:'收入 · 万雷亚尔',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:function(v){return (v/10000).toFixed(0)+'万';}}}),
        axis({type:'value',name:'比例 %',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},min:0,max:function(v){return Math.ceil(v.max*1.2);},splitLine:{show:false},axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}})
      ],
      dataZoom:[
        {type:'inside',xAxisIndex:0,start:0,end:100},
        {type:'slider',xAxisIndex:0,start:0,end:100,height:18,bottom:8,borderColor:'#D3D7DB',fillerColor:'rgba(31,59,255,.08)',
          handleStyle:{color:'#FFFFFF',borderColor:'#1F3BFF'},moveHandleStyle:{color:'#1F3BFF'},textStyle:{color:'#5F656B',fontFamily:MONO,fontSize:10},dataBackground:{lineStyle:{color:'#B9C0C6'},areaStyle:{color:'#EDF1FF'}}}
      ],
      series:[
        {name:'收入',type:'line',symbol:'none',data:D.monthly.map(function(m){return m.revenue;}),lineStyle:{width:2,color:C.cobalt},
          areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(31,59,255,.20)'},{offset:1,color:'rgba(31,59,255,0)'}])}},
        {name:'延迟率',type:'line',yAxisIndex:1,symbol:'circle',symbolSize:5,data:D.monthly.map(function(m){return m.late;}),lineStyle:{width:2,color:C.red},itemStyle:{color:C.red}},
        {name:'差评率',type:'line',yAxisIndex:1,symbol:'circle',symbolSize:4,data:D.monthly.map(function(m){return m.bad;}),lineStyle:{width:1.5,color:C.slate,type:'dashed'},itemStyle:{color:C.slate}}
      ]
    };
  }

  function delay(){
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:16,top:44,bottom:8,containLabel:true},
      tooltip:tip({trigger:'axis',formatter:function(ps){
        var d=D.delay[ps[0].dataIndex];
        return '<b>'+delayNames[ps[0].dataIndex]+'</b><br>订单 '+fmt(d.orders)+' 笔<br>差评率 '+pct(d.bad)+'% · 评分 '+d.score.toFixed(2);
      }}),
      legend:{right:0,top:0,itemWidth:10,itemHeight:10,textStyle:{color:'#5F656B',fontSize:12}},
      xAxis:{type:'category',data:delayNames,axisLabel:{color:'#232527',fontSize:12,interval:0},axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false}},
      yAxis:[
        axis({type:'value',name:'差评率 %',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},max:100,axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:11,formatter:'{value}%'}}),
        axis({type:'value',name:'平均评分',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},min:0,max:5,splitLine:{show:false},axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:11}})
      ],
      series:[
        {name:'差评率',type:'bar',barWidth:'44%',data:D.delay.map(function(d){return d.bad;}),itemStyle:{color:C.cobalt},label:{show:true,position:'top',formatter:'{c}%',color:'#5F656B',fontFamily:MONO,fontSize:11}},
        {name:'平均评分',type:'line',yAxisIndex:1,data:D.delay.map(function(d){return d.score;}),symbolSize:7,lineStyle:{width:2,color:C.red},itemStyle:{color:C.red}}
      ]
    };
  }

  function heat(){
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      tooltip:tip({trigger:'item',formatter:function(p){return '<b>'+p.data[0]+'</b><br>有效订单 '+fmt(p.data[1])+' 笔';}}),
      calendar:{range:['2017-01-01','2018-08-31'],left:44,right:16,top:26,bottom:42,cellSize:['auto',13],splitLine:{show:false},itemStyle:{borderWidth:2,borderColor:'#FFFFFF'},
        dayLabel:{firstDay:1,nameMap:['日','一','二','三','四','五','六'],color:'#5F656B',fontFamily:MONO,fontSize:10},
        monthLabel:{nameMap:'cn',color:'#5F656B',fontFamily:MONO,fontSize:10},yearLabel:{show:false}},
      visualMap:{type:'piecewise',orient:'horizontal',left:'center',bottom:0,itemWidth:11,itemHeight:11,textStyle:{color:'#5F656B',fontFamily:MONO,fontSize:10},
        pieces:[{min:350,label:'350+',color:'#1F3BFF'},{min:220,max:349,label:'220–349',color:'#4A66FF'},{min:150,max:219,label:'150–219',color:'#8FA2FF'},{min:80,max:149,label:'80–149',color:'#C9D3FF'},{max:79,label:'<80',color:'#EDF1FF'}]},
      series:[{type:'heatmap',coordinateSystem:'calendar',data:D.daily}]
    };
  }

  function rfm(){
    var order=['5','3','2','1','4'];
    var narrow=window.innerWidth<700;
    var data=order.map(function(code){
      var d=D.rfm.filter(function(x){return x.code===code;})[0];
      return {name:rfmNames[code],value:d?d.share:0,itemStyle:{color:rfmColors[code]},code:code};
    });
    var legendFmt=function(name){var it=data.filter(function(d){return d.name===name;})[0];return name+'  '+(it?it.value.toFixed(2):'0.00')+'%';};
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      tooltip:tip({trigger:'item',formatter:function(p){
        var d=D.rfm.filter(function(x){return x.code===p.data.code;})[0];
        return '<b>'+p.name+'</b><br>客户 '+fmt(d.customers)+' 人<br>收入 R$ '+fmt(Math.round(d.revenue))+'<br>占比 '+pct(d.share)+'%';
      }}),
      legend: narrow
        ? {orient:'horizontal',left:'center',bottom:0,itemWidth:12,itemHeight:12,itemGap:8,textStyle:{color:'#5F656B',fontSize:12,fontWeight:500},formatter:legendFmt}
        : {orient:'vertical',right:0,top:'middle',itemWidth:12,itemHeight:12,itemGap:8,textStyle:{color:'#5F656B',fontSize:13,fontWeight:500},formatter:legendFmt},
      series:[{type:'pie',radius:narrow?['38%','56%']:['44%','70%'],center:narrow?['50%','42%']:['34%','50%'],avoidLabelOverlap:true,minAngle:0,labelLayout:{hideOverlap:true},
        label:{formatter:function(p){return p.value>=3?p.value.toFixed(2)+'%':'';},color:'#5F656B',fontSize:11},
        labelLine:{length:8,length2:10,lineStyle:{color:'#C2C8CE'}},
        emphasis:{scale:true,scaleSize:8,itemStyle:{shadowBlur:14,shadowColor:'rgba(16,17,19,.14)'}},data:data}]
    };
  }

  function race(){
    var months=D.catMonthly.months, cats=D.catMonthly.cats, series=D.catMonthly.series;
    return {
      animationDuration:0, animationDurationUpdate:800, animationEasing:'cubicOut', textStyle:{fontFamily:SANS},
      title:{text:months[0],left:'center',top:0,textStyle:{color:'#6C4DFF',fontFamily:MONO,fontSize:17,fontWeight:500}},
      grid:{left:8,right:96,top:42,bottom:8,containLabel:true},
      xAxis:{type:'value',max:'dataMax',axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:function(v){return v>=10000?(v/10000).toFixed(1)+'万':v;}}},
      yAxis:{type:'category',inverse:true,max:7,data:[],axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#232527',fontSize:13,fontFamily:SANS},animationDuration:800,animationDurationUpdate:800},
      series:[{type:'bar',barWidth:'55%',data:[],label:{show:true,position:'right',formatter:function(p){return wan(p.value)+'万';},color:'#5F656B',fontFamily:MONO,fontSize:11},itemStyle:{color:C.cobalt}}],
      tooltip:tip({trigger:'item',formatter:function(p){return '<b>'+p.name+'</b><br>商品销售额 R$ '+fmt(Math.round(p.value));}})
    };
  }

  function qdCompete(compact){
    var rows=[
      {name:'获客与营销',sub:'私域 · 会员 · 营销自动化 · 客户数据平台',v:2,label:'中',color:'#6C4DFF'},
      {name:'服务与联络',sub:'在线坐席 · 机器人 · 工单 · 质检',v:1,label:'低',color:'#9B7BFF'},
      {name:'数据与分析',sub:'统一身份 · 标签 · 画像 · 会话分析',v:3,label:'中高',color:'#3D2A99'}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:compact?44:64,top:8,bottom:12,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){var d=rows[p.dataIndex];return '<b>'+d.name+'</b><br>'+d.sub+'<br>竞争强度：'+d.label+'<br><span style="color:#8A9299">分析判断，不是第三方评分</span>';}}),
      xAxis:{type:'value',min:0,max:3.3,axisLine:{show:false},axisTick:{show:false},splitLine:{show:false},axisLabel:{show:false}},
      yAxis:{type:'category',inverse:true,data:rows.map(function(d){return d.name;}),axisLine:{show:false},axisTick:{show:false},
        axisLabel:compact?{color:'#232527',fontSize:12}:{formatter:function(v){var d=rows.filter(function(x){return x.name===v;})[0];return '{a|'+d.name+'}\n{b|'+d.sub+'}';},
          rich:{a:{color:'#232527',fontSize:13,lineHeight:20},b:{color:'#8A9299',fontSize:11,lineHeight:16}}}},
      series:[{type:'bar',barWidth:'42%',data:rows.map(function(d){return {value:d.v,itemStyle:{color:d.color,borderRadius:[0,5,5,0]}};}),
        label:{show:true,position:'right',formatter:function(p){return rows[p.dataIndex].label;},color:'#5F656B',fontFamily:MONO,fontSize:11}}]
    };
  }

  function qdCycles(){
    var rows=[
      {name:'连锁零售',start:2,end:4,label:'2–4 个月',color:'#6C4DFF'},
      {name:'金融',start:6,end:12,label:'6–12 个月',color:'#2E454E'},
      {name:'电子制造',start:3,end:6,label:'3–6 个月',color:'#9B7BFF'}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:86,top:16,bottom:8,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){var d=rows[p.dataIndex];return '<b>'+d.name+'</b><br>成交周期 '+d.label;}}),
      xAxis:{type:'value',min:0,max:12,interval:3,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value} 个月'}},
      yAxis:{type:'category',inverse:true,data:rows.map(function(d){return d.name;}),axisLine:{show:false},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:13}},
      series:[
        {type:'bar',stack:'total',silent:true,itemStyle:{color:'transparent'},data:rows.map(function(d){return d.start;})},
        {type:'bar',stack:'total',barWidth:'40%',data:rows.map(function(d){return {value:d.end-d.start,itemStyle:{color:d.color,borderRadius:4}};}),
          label:{show:true,position:'right',formatter:function(p){return rows[p.dataIndex].label;},color:'#5F656B',fontFamily:MONO,fontSize:11}}
      ]
    };
  }

  function qdWaterfall(){
    var rows=[
      {name:'期初',base:0,val:15413,label:'15,413',color:'#171715'},
      {name:'流失',base:12232,val:3181,label:'-3,181',color:'#C2412C'},
      {name:'扩容',base:12232,val:979,label:'+979',color:'#2E454E'},
      {name:'新签',base:13211,val:2250,label:'+2,250',color:'#2E454E'},
      {name:'期末',base:0,val:15461,label:'15,461',color:'#171715'}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:16,top:38,bottom:24,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){var d=rows[p.dataIndex];return '<b>'+d.name+'</b><br>'+d.label+' 万元';}}),
      xAxis:{type:'category',data:rows.map(function(d){return d.name;}),axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:12}},
      yAxis:{type:'value',name:'万元',nameTextStyle:{color:'#8A9299',fontFamily:MONO,fontSize:10},axisLine:{show:false},axisTick:{show:false},
        splitLine:{lineStyle:{color:'#E7EAED'}},axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:function(v){return (v/1000)+'k';}}},
      series:[
        {type:'bar',stack:'w',silent:true,itemStyle:{color:'transparent'},data:rows.map(function(d){return d.base;})},
        {type:'bar',stack:'w',barWidth:'46%',data:rows.map(function(d){return {value:d.val,itemStyle:{color:d.color,borderRadius:[3,3,0,0]}};}),
          label:{show:true,position:'top',formatter:function(p){return rows[p.dataIndex].label;},color:'#232527',fontFamily:MONO,fontSize:11}}
      ]
    };
  }

  function qdLeaves(compact){
    var rows=[
      {name:'低解决率 + 高工单',short:'低解决·高工单',v:52.4,n:'42 家 · 22 未续'},
      {name:'低解决率 + 低工单',short:'低解决·低工单',v:29.1,n:'55 家 · 16 未续'},
      {name:'坐席降 + NPS≤58',short:'坐席降·NPS≤58',v:32.4,n:'37 家 · 12 未续'},
      {name:'坐席降 + NPS>58',short:'坐席降·NPS>58',v:22.1,n:'68 家 · 15 未续'},
      {name:'坐席增',short:'坐席增',v:8.2,n:'98 家 · 8 未续'}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:compact?46:58,top:12,bottom:8,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){var d=rows[p.dataIndex];return '<b>'+d.name+'</b><br>流失率 '+d.v.toFixed(1)+'%<br>'+d.n;}}),
      xAxis:{type:'value',min:0,max:60,axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}},
      yAxis:{type:'category',inverse:true,data:rows.map(function(d){return compact?d.short:d.name;}),axisLine:{show:false},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:compact?11:12}},
      series:[{type:'bar',barWidth:'48%',data:rows.map(function(d){return {value:d.v,itemStyle:{color:d.v>=45?'#C2412C':d.v>=30?'#D97A60':'#E8B4A6',borderRadius:[0,4,4,0]}};}),
        label:{show:true,position:'right',formatter:function(p){return p.value.toFixed(1)+'%';},color:'#5F656B',fontFamily:MONO,fontSize:11}}]
    };
  }

  function gsEnergy(){
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:54,top:40,bottom:10,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'line',lineStyle:{color:'#8A9299',type:'dashed'}},formatter:function(ps){
        var p=ps[0];return '<b>'+p.axisValue+'</b><br>能源生产总量 '+fmt(GS.energy[p.dataIndex])+' 万吨标准煤';
      }}),
      xAxis:{type:'category',data:GS.years,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,interval:2}},
      yAxis:axis({type:'value',name:'万吨标准煤',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:function(v){return (v/1000).toFixed(0)+'k';}}}),
      series:[{name:'能源生产总量',type:'line',symbol:'circle',symbolSize:5,data:GS.energy,
        lineStyle:{width:2.2,color:'#6C4DFF'},itemStyle:{color:'#6C4DFF'},
        areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(108,77,255,.26)'},{offset:1,color:'rgba(108,77,255,0)'}])},
        endLabel:{show:true,color:'#6C4DFF',fontFamily:MONO,fontSize:10,formatter:function(p){return fmt(p.value);}}}]
    };
  }

  function gsMix(){
    var cols={coal:'#2E454E',oil:'#6C4DFF',gas:'#B9A6FF',power:'#1E7B4F'};
    var names={coal:'原煤',oil:'原油',gas:'天然气',power:'一次电力及其他'};
    var keys=['coal','oil','gas','power'];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:16,top:52,bottom:10,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'line',lineStyle:{color:'#8A9299',type:'dashed'}},formatter:function(ps){
        return '<b>'+ps[0].axisValue+'</b>'+ps.map(function(p){return '<br>'+p.marker+p.seriesName+' '+Number(p.value).toFixed(1)+'%';}).join('');
      }}),
      legend:{top:0,right:0,itemWidth:10,itemHeight:10,textStyle:{color:'#5F656B',fontSize:11}},
      xAxis:{type:'category',data:GS.years,boundaryGap:false,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,interval:2}},
      yAxis:axis({type:'value',max:100,axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}}),
      series:keys.map(function(k){
        return {name:names[k],type:'line',stack:'mix',smooth:true,symbol:'none',data:GS.mix[k],
          lineStyle:{width:0.8,color:cols[k]},itemStyle:{color:cols[k]},
          areaStyle:{color:cols[k],opacity:k==='gas'?0.9:0.55},emphasis:{focus:'series'}};
      })
    };
  }

  function gsCarbon(){
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:60,top:40,bottom:10,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'line',lineStyle:{color:'#8A9299',type:'dashed'}},formatter:function(ps){
        var p=ps[0];return '<b>'+p.axisValue+'</b><br>碳排放总量 '+fmt(GS.carbon[p.dataIndex])+' 万吨';
      }}),
      xAxis:{type:'category',data:GS.years,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,interval:2}},
      yAxis:axis({type:'value',name:'万吨',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:function(v){return (v/1000).toFixed(0)+'k';}}}),
      series:[{name:'碳排放总量',type:'line',symbol:'circle',symbolSize:5,data:GS.carbon,
        lineStyle:{width:2.2,color:'#C2412C'},itemStyle:{color:'#C2412C'},
        areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(194,65,44,.24)'},{offset:1,color:'rgba(194,65,44,0)'}])},
        endLabel:{show:true,color:'#C2412C',fontFamily:MONO,fontSize:10,formatter:function(p){return fmt(p.value);}},
        markArea:{silent:true,itemStyle:{color:'rgba(46,69,78,.06)'},
          label:{show:true,position:'insideTop',color:'#8A9299',fontSize:10,formatter:'2014—2016 平台波动期'},
          data:[[{xAxis:'2014'},{xAxis:'2016'}]]}}]
    };
  }

  function gsIndustry(){
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:56,top:48,bottom:10,containLabel:true},
      tooltip:tip({trigger:'axis',formatter:function(ps){
        return '<b>'+ps[0].axisValue+'</b>'+ps.map(function(p){return '<br>'+p.marker+p.seriesName+' '+Number(p.value).toFixed(2)+'%';}).join('');
      }}),
      legend:{top:0,right:0,itemWidth:10,itemHeight:10,textStyle:{color:'#5F656B',fontSize:11}},
      xAxis:{type:'category',data:GS.years,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,interval:2}},
      yAxis:axis({type:'value',min:0,max:60,axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}}),
      series:[
        {name:'第二产业占比',type:'line',smooth:true,symbol:'circle',symbolSize:4,data:GS.industry.second,lineStyle:{width:2.2,color:'#6C4DFF'},itemStyle:{color:'#6C4DFF'},
          endLabel:{show:true,color:'#6C4DFF',fontFamily:MONO,fontSize:10,formatter:function(p){return p.value.toFixed(2)+'%';}}},
        {name:'第三产业占比',type:'line',smooth:true,symbol:'circle',symbolSize:4,data:GS.industry.third,lineStyle:{width:2.2,color:'#2E454E'},itemStyle:{color:'#2E454E'},
          endLabel:{show:true,color:'#2E454E',fontFamily:MONO,fontSize:10,formatter:function(p){return p.value.toFixed(2)+'%';}}}
      ]
    };
  }

  function svPref(){
    var rows=[
      {name:'图像',v:44.31},{name:'视频',v:40.32},{name:'音频',v:10.38},{name:'文字',v:3.19}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:56,top:12,bottom:8,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){return '<b>'+p.name+'</b><br>占比 '+p.value.toFixed(2)+'%';}}),
      xAxis:{type:'value',min:0,max:50,axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}},
      yAxis:{type:'category',inverse:true,data:rows.map(function(d){return d.name;}),axisLine:{show:false},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:13}},
      series:[{type:'bar',barWidth:'46%',data:rows.map(function(d,i){return {value:d.v,itemStyle:{color:['#6C4DFF','#9B7BFF','#C9B8FF','#E4DCFF'][i],borderRadius:[0,5,5,0]}};}),
        label:{show:true,position:'right',formatter:'{c}%',color:'#5F656B',fontFamily:MONO,fontSize:11}}]
    };
  }

  function svPotential(){
    var rows=[
      {name:'健康',v:94.41},{name:'政治',v:72.26},{name:'教育',v:69.26},{name:'时尚',v:64.27},
      {name:'科技',v:49.90},{name:'环保',v:29.74},{name:'娱乐',v:17.37}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:58,top:12,bottom:8,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){return '<b>'+p.name+'</b><br>关注占比 '+p.value.toFixed(2)+'%';}}),
      xAxis:{type:'value',min:0,max:100,axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}},
      yAxis:{type:'category',inverse:true,data:rows.map(function(d){return d.name;}),axisLine:{show:false},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:13}},
      series:[{type:'bar',barWidth:'46%',data:rows.map(function(d,i){return {value:d.v,itemStyle:{color:i<2?'#6C4DFF':i<4?'#9B7BFF':'#C9B8FF',borderRadius:[0,5,5,0]}};}),
        label:{show:true,position:'right',formatter:'{c}%',color:'#5F656B',fontFamily:MONO,fontSize:11}}]
    };
  }

  function mdForecast(){
    var dates=['03-02','03-03','03-04','03-05','03-06','03-07','03-08'];
    var vals=[66,52,54,75,48,50,39];
    var grades=['良','良','良','良','优','优','优'];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:16,top:36,bottom:10,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'shadow'},formatter:function(ps){var p=ps[0];return '<b>2024-'+p.name+'</b><br>AQI '+p.value+' · '+grades[p.dataIndex];}}),
      xAxis:{type:'category',data:dates,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10}},
      yAxis:axis({type:'value',min:0,max:120,name:'AQI',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10}}),
      series:[{type:'bar',barWidth:'46%',data:vals.map(function(v,i){return {value:v,itemStyle:{color:grades[i]==='优'?'#1E7B4F':'#B7791F',borderRadius:[5,5,0,0]}};}),
        label:{show:true,position:'top',formatter:'{c}',color:'#5F656B',fontFamily:MONO,fontSize:11},
        markLine:{silent:true,symbol:'none',lineStyle:{color:'#C2412C',type:'dashed',width:1},
          label:{show:false},data:[{yAxis:100}]}}]
    };
  }

  function mdPollutants(){
    var years=['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'];
    var series=[
      {name:'PM2.5',color:'#111015',data:[186,156,165,121,99,84,92,65,63,55]},
      {name:'PM10',color:'#C2412C',data:[43,40,40,49,76,64,53,84,69,113]},
      {name:'NO₂',color:'#1E7B4F',data:[49,46,53,78,62,68,61,30,19,16]},
      {name:'SO₂',color:'#2E454E',data:[0,0,1,0,0,0,0,0,0,0]},
      {name:'CO',color:'#9B7BFF',data:[0,4,1,1,0,0,0,0,0,0]},
      {name:'O₃',color:'#6C4DFF',data:[95,124,117,124,133,159,171,191,221,189]}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      legend:{top:0,right:0,itemWidth:10,itemHeight:10,textStyle:{color:'#5F656B',fontSize:11}},
      grid:{left:8,right:36,top:38,bottom:8,containLabel:true},
      tooltip:tip({trigger:'axis',formatter:function(ps){
        return '<b>'+ps[0].name+' 年</b><br>'+ps.map(function(p){return p.marker+p.seriesName+' '+p.value+' 天';}).join('<br>');
      }}),
      xAxis:{type:'category',data:years,boundaryGap:false,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10}},
      yAxis:axis({type:'value',min:0,max:250,name:'天数',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10}}),
      series:series.map(function(d,i){
        return {name:d.name,type:'line',smooth:true,symbol:'circle',symbolSize:4,data:d.data,
          lineStyle:{width:i===5?2.6:1.8,color:d.color},itemStyle:{color:d.color},emphasis:{focus:'series'}};
      })
    };
  }

  function mdCompare(){
    var rows=[
      {name:'BP',v:15.257},{name:'LSTM',v:12.058},{name:'BiLSTM',v:10.376},{name:'GWO-BiLSTM',v:4.354}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:16,top:32,bottom:8,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'shadow'},formatter:function(ps){var p=ps[0];return '<b>'+p.name+'</b><br>RMSE '+p.value;}}),
      xAxis:{type:'category',data:rows.map(function(d){return d.name;}),axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:12}},
      yAxis:axis({type:'value',name:'RMSE',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10}}),
      series:[{type:'bar',barWidth:'48%',data:rows.map(function(d,i){return {value:d.v,itemStyle:{color:i===3?'#6C4DFF':'#C9C4D8',borderRadius:[5,5,0,0]}};}),
        label:{show:true,position:'top',formatter:'{c}',color:'#5F656B',fontFamily:MONO,fontSize:11}}]
    };
  }

  function catMix(){
    var rows=[
      {name:'核心品类',v:54.48,n:10,sales:7309723,color:'#1F3BFF'},
      {name:'风险品类',v:27.58,n:21,sales:3700662,color:'#C2412C'},
      {name:'收缩/观察',v:15.19,n:18,sales:2038542,color:'#8A9299'},
      {name:'增长品类',v:2.75,n:4,sales:369482,color:'#1E7B4F'}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:112,top:12,bottom:8,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){var d=rows[p.dataIndex];
        return '<b>'+d.name+'</b><br>销售额 R$ '+fmt(d.sales)+'<br>收入占比 '+d.v.toFixed(2)+'% · '+d.n+' 个品类';}}),
      xAxis:{type:'value',min:0,max:60,axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}},
      yAxis:{type:'category',inverse:true,data:rows.map(function(d){return d.name;}),axisLine:{show:false},axisTick:{show:false},
        axisLabel:{color:'#232527',fontSize:13}},
      series:[{type:'bar',barWidth:'46%',data:rows.map(function(d){return {value:d.v,itemStyle:{color:d.color,borderRadius:[0,5,5,0]}};}),
        label:{show:true,position:'right',formatter:function(p){var d=rows[p.dataIndex];return d.v.toFixed(2)+'% · '+d.n+' 个';},color:'#5F656B',fontFamily:MONO,fontSize:11}}]
    };
  }

  function catTrend(){
    var months=['2017-01','2017-02','2017-03','2017-04','2017-05','2017-06','2017-07','2017-08','2017-09','2017-10','2017-11','2017-12','2018-01','2018-02','2018-03','2018-04','2018-05','2018-06','2018-07','2018-08'];
    var series=[
      {name:'健康美容',color:'#C2412C',w:2.6,data:[12561.32,22838.79,25927.35,22780.85,46786.02,31979.49,34770.22,49813.91,51537.65,41905.82,78976.65,61264.66,72190.49,86561.78,89759.44,91751.04,95950.68,107795.99,105517.68,120475.71]},
      {name:'手表礼品',color:'#1F3BFF',w:2.2,data:[8086.52,11756.21,24970.38,23461.09,37804.00,28430.63,35604.66,36170.95,46986.85,65060.53,96575.58,71611.62,75552.24,62986.19,97861.08,92658.57,123872.66,86885.56,96212.59,72277.06]},
      {name:'床品家纺',color:'#2E454E',w:1.9,data:[3960.16,16200.83,25773.02,24347.69,33318.55,35114.81,63838.85,57067.33,52473.20,46198.00,89172.65,50505.85,76281.90,60496.18,69256.39,72328.35,71664.93,71545.58,54904.92,61035.88]},
      {name:'运动休闲',color:'#8A9299',w:1.8,data:[9717.62,16207.16,26849.49,24293.76,35793.50,32728.43,37344.43,41662.36,50059.50,49611.45,63730.92,59547.97,91368.43,75308.83,84654.27,67346.58,59599.12,45542.01,55172.78,51190.16]},
      {name:'家具装饰',color:'#6E5BD6',w:2.1,data:[13521.31,20955.20,23402.64,21540.53,24028.51,16911.68,24751.92,35189.35,30758.70,30189.64,63011.03,32011.75,54821.79,38386.96,52134.24,56743.11,54056.05,42190.22,45659.39,41320.25]}
    ];
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      legend:{type:'scroll',top:0,left:0,right:0,itemWidth:10,itemHeight:10,textStyle:{color:'#5F656B',fontSize:11.5}},
      grid:{left:8,right:38,top:42,bottom:8,containLabel:true},
      tooltip:tip({trigger:'axis',axisPointer:{type:'line',lineStyle:{color:'#8A9299',type:'dashed'}},formatter:function(ps){
        return '<b>'+ps[0].axisValue+'</b>'+ps.map(function(p){
          return '<br>'+p.marker+p.seriesName+' R$ '+fmt(Math.round(p.value));
        }).join('');
      }}),
      xAxis:{type:'category',data:months,axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,interval:2}},
      yAxis:axis({type:'value',axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:function(v){return (v/10000).toFixed(0)+'万';}}}),
      series:series.map(function(d){
        return {name:d.name,type:'line',smooth:true,symbol:'circle',symbolSize:3,data:d.data,
          lineStyle:{width:d.w,color:d.color},itemStyle:{color:d.color},emphasis:{focus:'series'}};
      })
    };
  }

  function catRisk(){
    var rows=[
      {n:'健康美容',v:[10.36,17.17,1255695.13],g:175.61},
      {n:'家具装饰',v:[5.75,20.08,727465.05],g:392.05},
      {n:'母婴用品',v:[6.92,14.87,410312.20],g:32.90},
      {n:'办公家具',v:[7.23,26.26,273580.70],g:46.98},
      {n:'乐器',v:[7.10,13.56,187788.44],g:52.02},
      {n:'建筑施工工具',v:[5.84,20.85,144550.19],g:50.34},
      {n:'家电',v:[9.47,13.30,110649.74],g:210.40},
      {n:'农业与工商业用品',v:[2.66,18.01,72530.47],g:246.17},
      {n:'客厅家具',v:[6.59,13.09,68638.56],g:37.23},
      {n:'家居舒适用品',v:[8.29,18.43,58572.04],g:30.39},
      {n:'固定电话及通讯',v:[5.29,18.57,57824.21],g:110.54},
      {n:'空调',v:[2.75,17.55,54723.16],g:56.29},
      {n:'音频设备',v:[10.52,19.33,50668.60],g:52.32},
      {n:'烤箱与咖啡机等小家电',v:[4.44,18.82,47445.71],g:135.79},
      {n:'照明工具',v:[13.05,18.04,40002.00],g:139.47},
      {n:'安全防护用品',v:[1.82,27.66,39589.02],g:917.58},
      {n:'食品',v:[6.37,10.83,29243.51],g:122.24},
      {n:'安防与信号设备',v:[5.12,18.15,21509.23],g:73.97},
      {n:'卧室家具',v:[6.98,14.41,20028.78],g:78.69},
      {n:'技术类图书',v:[10.26,12.09,19096.06],g:33.88},
      {n:'男装',v:[7.22,23.22,10748.82],g:53.54}
    ];
    var LBL={'健康美容':1,'家具装饰':1,'办公家具':1,'安全防护用品':1,'男装':1};
    return {
      animation:!REDUCE, textStyle:{fontFamily:SANS},
      grid:{left:8,right:24,top:42,bottom:34,containLabel:true},
      tooltip:tip({trigger:'item',formatter:function(p){var d=rows[p.dataIndex];
        return '<b>'+d.n+'</b><br>销售额 R$ '+fmt(d.v[2])+'<br>延迟率 '+d.v[0].toFixed(2)+'% · 差评率 '+d.v[1].toFixed(2)+'%<br>平均月增长 '+d.g.toFixed(2)+'%';}}),
      xAxis:{type:'value',min:0,max:14,interval:2,name:'延迟率 %',nameLocation:'middle',nameGap:26,
        nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLine:{lineStyle:{color:'#D3D7DB'}},axisTick:{show:false},splitLine:{lineStyle:{color:'#E7EAED'}},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}},
      yAxis:axis({type:'value',min:8,max:30,interval:4,name:'差评率 %',nameTextStyle:{color:'#5F656B',fontSize:10,fontFamily:MONO},
        axisLabel:{color:'#5F656B',fontFamily:MONO,fontSize:10,formatter:'{value}%'}}),
      series:[{type:'scatter',symbolSize:function(v){return Math.max(7,Math.min(44,Math.sqrt(v[2])/26));},
        data:rows.map(function(d){return {name:d.n,value:d.v,itemStyle:{color:d.v[1]>=20?'#C2412C':d.v[1]>=15?'#D97A60':'#E8B4A6',opacity:.82}};}),
        label:{show:true,position:'top',color:'#232527',fontSize:11,
          formatter:function(p){return LBL[p.name]?p.name:'';}},
        emphasis:{itemStyle:{opacity:1,borderColor:'#111015',borderWidth:1}},
        markLine:{silent:true,symbol:'none',lineStyle:{color:'#8A9299',type:'dashed',width:1},
          label:{show:false},
          data:[{xAxis:6.77},{yAxis:12.81}]}
      }]
    };
  }

  function init(id){
    if(CH[id] || !D || !window.echarts) return;
    var el=document.getElementById('chart-'+id);
    if(!el) return;
    var ch=echarts.init(el,null,{renderer:'svg'});
    CH[id]=ch;
    if(id==='olistMonthly') ch.setOption(monthly());
    else if(id==='olistDelay') ch.setOption(delay());
    else if(id==='olistHeat') ch.setOption(heat());
    else if(id==='olistRfm'){
      ch.setOption(rfm());
      var ov=document.createElement('div');
      ov.className='rfm-center';
      ov.innerHTML='<b>R$ 1,573.9 万</b><small>有效订单收入</small>';
      el.appendChild(ov);
    }
    else if(id==='olistRace'){
      var months=D.catMonthly.months, cats=D.catMonthly.cats, series=D.catMonthly.series;
      ch.setOption(race());
      var idx=0;
      function frame(i){
        var arr=cats.map(function(c){return {name:c,value:series[c][i]||0};});
        arr.sort(function(a,b){return b.value-a.value;});
        var top=arr.slice(0,8);
        ch.setOption({title:{text:months[i]},yAxis:{data:top.map(function(d){return CAT[d.name];})},series:[{data:top.map(function(d){return {value:d.value,itemStyle:{color:CATCOL[d.name]}};})}]});
      }
      frame(0);
      if(!REDUCE){
        TIMERS[id]=setInterval(function(){
          idx=(idx+1)%months.length;
          frame(idx);
        },900);
      }
    }
    else if(id==='olistCatMix') ch.setOption(catMix());
    else if(id==='olistCatTrend') ch.setOption(catTrend());
    else if(id==='olistCatRisk') ch.setOption(catRisk());
    else if(id==='qdCompete') ch.setOption(qdCompete(el.clientWidth<560));
    else if(id==='qdCycles') ch.setOption(qdCycles());
    else if(id==='qdWaterfall') ch.setOption(qdWaterfall());
    else if(id==='qdLeaves') ch.setOption(qdLeaves(el.clientWidth<560));
    else if(id==='gsEnergy') ch.setOption(gsEnergy());
    else if(id==='gsMix') ch.setOption(gsMix());
    else if(id==='gsCarbon') ch.setOption(gsCarbon());
    else if(id==='gsIndustry') ch.setOption(gsIndustry());
    else if(id==='svPref') ch.setOption(svPref());
    else if(id==='svPotential') ch.setOption(svPotential());
    else if(id==='mdCompare') ch.setOption(mdCompare());
    else if(id==='mdPollutants') ch.setOption(mdPollutants());
    else if(id==='mdForecast') ch.setOption(mdForecast());
  }

  function clear(){
    Object.keys(CH).forEach(function(k){ try{CH[k].dispose();}catch(e){} delete CH[k]; });
    Object.keys(TIMERS).forEach(function(k){ clearInterval(TIMERS[k]); delete TIMERS[k]; });
  }
  function resize(){
    Object.keys(CH).forEach(function(k){
      var el=document.getElementById('chart-'+k);
      if(!el) return;
      if(k==='qdCompete') CH[k].setOption(qdCompete(el.clientWidth<560));
      else if(k==='qdLeaves') CH[k].setOption(qdLeaves(el.clientWidth<560));
      try{CH[k].resize();}catch(e){}
    });
  }
  window.addEventListener('resize',resize);
  window.OC={init:init,clear:clear,resize:resize};
})();
