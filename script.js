(function () {
  'use strict';

  const charts = {};
  const chartColors = {
    warm: ['#D94841', '#E8A87C', '#F2CC8F', '#E07A5F', '#C8553D'],
    cool: ['#4A90A4', '#6BA3B5', '#8ECAE6', '#A8DADC', '#457B9D'],
    mix: ['#D94841', '#E8A87C', '#4A90A4', '#6BA3B5', '#F2CC8F']
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
    initNav();
    initProgressBar();
    initScrollObservers();
    initCharts();
    initRiskQuiz();
    initChatSim();
    initSmsChallenge();
    initCalc();
    initAiChallenge();
    initAntiQuiz();
    initFraudMap();
    initPoll();
    window.addEventListener('resize', debounce(resizeCharts, 250));
  }

  /* ===== Navigation ===== */
  function initNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40));
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
  }

  function initProgressBar() {
    const bar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = h > 0 ? (scrollY / h * 100) + '%' : '0%';
    });
  }

  /* ===== Intersection Observer: scrollytelling ===== */
  function initScrollObservers() {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.metric-num, .counter').forEach((el) => counterObs.observe(el));

    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          if (e.target.classList.contains('io-chart') && e.target.querySelector('.chart')) {
            const id = e.target.querySelector('.chart').id;
            charts[id] && charts[id].resize();
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.io-animate, .io-chart, .io-reveal, .case-block, .history-node, .stat-banner').forEach((el) => revealObs.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;
    const isFloat = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();
    const card = el.closest('.metric-card');
    if (card) card.classList.add('visible');

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  /* ===== ECharts ===== */
  function chartTheme() {
    return { backgroundColor: 'transparent', textStyle: { color: '#666', fontFamily: 'Noto Sans SC, sans-serif' } };
  }

  function initCharts() {
    initTrendChart();
    initAgeChart();
    initScenesChart();
    initTypesRankChart();
    initHistoryChart();
    initAIChart();
    initAIGrowthChart();
    initProfileCharts();
    initWordCloud();
  }

  function initTrendChart() {
    const el = document.getElementById('chartTrend');
    if (!el) return;
    charts.chartTrend = echarts.init(el);
    charts.chartTrend.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 24, top: 32, bottom: 32 },
      xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025'], axisLine: { lineStyle: { color: '#ddd' } } },
      yAxis: { type: 'value', name: '万起', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        name: '侦破案件',
        type: 'line',
        smooth: true,
        data: [46.4, 43.7, 29.4, 25.8],
        lineStyle: { color: '#D94841', width: 3 },
        itemStyle: { color: '#D94841' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(217,72,65,0.2)' },
            { offset: 1, color: 'rgba(217,72,65,0)' }
          ])
        }
      }]
    });
  }

  function initAgeChart() {
    const el = document.getElementById('chartAge');
    if (!el) return;
    charts.chartAge = echarts.init(el);
    charts.chartAge.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '45%'],
        label: { color: '#2C2C2C' },
        data: [
          { value: 62.1, name: '18-40岁', itemStyle: { color: '#D94841' } },
          { value: 33.1, name: '41-65岁', itemStyle: { color: '#4A90A4' } },
          { value: 4.8, name: '其他', itemStyle: { color: '#E8A87C' } }
        ]
      }]
    });
  }

  function initScenesChart() {
    const el = document.getElementById('chartScenes');
    if (!el) return;
    charts.chartScenes = echarts.init(el);
    charts.chartScenes.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'axis' },
      grid: { left: 120, right: 48, top: 16, bottom: 32 },
      xAxis: { type: 'value', max: 28, axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: '#f0f0f0' } } },
      yAxis: {
        type: 'category',
        data: ['冒充公检法', '婚恋交友', '虚假购物', '虚假投资', '刷单返利'],
        axisLine: { lineStyle: { color: '#ddd' } }
      },
      series: [{
        type: 'bar',
        data: [6.45, 7.02, 14.14, 15.24, 25.01],
        itemStyle: {
          color: (p) => chartColors.warm[p.dataIndex % chartColors.warm.length],
          borderRadius: [0, 4, 4, 0]
        },
        label: { show: true, position: 'right', formatter: '{c}%', color: '#2C2C2C' }
      }]
    });
  }

  function initTypesRankChart() {
    const el = document.getElementById('chartTypesRank');
    if (!el) return;
    charts.chartTypesRank = echarts.init(el);
    const types = ['游戏虚假交易', '婚恋交友', '冒充公检法', '冒充领导', '虚假征信', '虚假贷款', '冒充客服', '虚假购物', '虚假投资', '刷单返利'];
    const values = [3, 5, 6, 6, 7, 8, 10, 12, 15, 28];
    charts.chartTypesRank.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'axis' },
      grid: { left: 100, right: 40, top: 16, bottom: 32 },
      xAxis: { type: 'value', name: '相对占比指数', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      yAxis: { type: 'category', data: types, axisLabel: { fontSize: 11 } },
      series: [{
        type: 'bar',
        data: values,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#4A90A4' },
            { offset: 1, color: '#D94841' }
          ]),
          borderRadius: [0, 4, 4, 0]
        }
      }]
    });
  }

  function initHistoryChart() {
    const el = document.getElementById('chartHistory');
    if (!el) return;
    charts.chartHistory = echarts.init(el);
    charts.chartHistory.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 24, top: 32, bottom: 32 },
      xAxis: { type: 'category', data: ['2005', '2010', '2015', '2018', '2020', '2022', '2023', '2025'] },
      yAxis: { type: 'value', name: '形态复杂度指数', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'line',
        smooth: true,
        data: [10, 22, 40, 68, 82, 74, 92, 88],
        lineStyle: { color: '#4A90A4', width: 3 },
        itemStyle: { color: '#4A90A4' },
        markPoint: {
          data: [
            { name: '杀猪盘', coord: ['2018', 68], itemStyle: { color: '#D94841' } },
            { name: '反诈法', coord: ['2022', 74], itemStyle: { color: '#E8A87C' } },
            { name: 'AI换脸', coord: ['2023', 92], itemStyle: { color: '#D94841' } }
          ],
          label: { color: '#fff', fontSize: 10 }
        }
      }]
    });
  }

  function initAIChart() {
    const el = document.getElementById('chartAI');
    if (!el) return;
    charts.chartAI = echarts.init(el);
    charts.chartAI.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: ['30%', '62%'],
        roseType: 'radius',
        data: [
          { value: 62, name: '冒充类', itemStyle: { color: '#D94841' } },
          { value: 20, name: '金融投资类', itemStyle: { color: '#E8A87C' } },
          { value: 12, name: '交易类', itemStyle: { color: '#4A90A4' } },
          { value: 6, name: '其他', itemStyle: { color: '#ccc' } }
        ],
        label: { formatter: '{b}\n{d}%', color: '#2C2C2C' }
      }]
    });
  }

  function initAIGrowthChart() {
    const el = document.getElementById('chartAIGrowth');
    if (!el) return;
    charts.chartAIGrowth = echarts.init(el);
    charts.chartAIGrowth.setOption({
      ...chartTheme(),
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 24, top: 32, bottom: 32 },
      xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025'] },
      yAxis: { type: 'value', name: '公开报道数', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [2, 5, 16, 48, 72],
        itemStyle: { color: '#4A90A4', borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: '#D94841' } }
      }]
    });
  }

  function initProfileCharts() {
    const ageEl = document.getElementById('chartProfileAge');
    if (ageEl) {
      charts.chartProfileAge = echarts.init(ageEl);
      charts.chartProfileAge.setOption({
        ...chartTheme(),
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['35%', '58%'],
          data: [
            { value: 2.51, name: '7-15岁', itemStyle: { color: '#ccc' } },
            { value: 45.86, name: '16-35岁', itemStyle: { color: '#D94841' } },
            { value: 36.04, name: '36-55岁', itemStyle: { color: '#4A90A4' } },
            { value: 15.59, name: '56岁+', itemStyle: { color: '#E8A87C' } }
          ],
          label: { formatter: '{b}\n{c}%', color: '#2C2C2C' }
        }]
      });
    }
    const genEl = document.getElementById('chartProfileGender');
    if (genEl) {
      charts.chartProfileGender = echarts.init(genEl);
      charts.chartProfileGender.setOption({
        ...chartTheme(),
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: '58%',
          data: [
            { value: 52.56, name: '女性', itemStyle: { color: '#E8A87C' } },
            { value: 47.44, name: '男性', itemStyle: { color: '#4A90A4' } }
          ],
          label: { formatter: '{b}\n{c}%', color: '#2C2C2C' }
        }]
      });
    }
  }

  function initWordCloud() {
    const el = document.getElementById('chartWordCloud');
    if (!el) return;
    charts.chartWordCloud = echarts.init(el);
    const words = [
      { name: '刷单返利', value: 100 }, { name: '安全账户', value: 88 },
      { name: '内部消息', value: 82 }, { name: '保证金', value: 78 },
      { name: '杀猪盘', value: 72 }, { name: '兼职', value: 68 },
      { name: '投资理财', value: 65 }, { name: '快递丢失', value: 62 },
      { name: 'AI换脸', value: 58 }, { name: '视频会议', value: 55 },
      { name: '屏幕共享', value: 52 }, { name: '验证码', value: 50 },
      { name: '稳赚不赔', value: 48 }, { name: '征信修复', value: 45 },
      { name: '导师带单', value: 42 }, { name: '连单卡单', value: 40 },
      { name: '解冻费', value: 38 }, { name: '百万保障', value: 36 },
      { name: '深度伪造', value: 34 }, { name: '游戏装备', value: 32 },
      { name: '机票退改', value: 30 }, { name: '保密调查', value: 28 }
    ];
    charts.chartWordCloud.setOption({
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        left: 'center', top: 'center', width: '95%', height: '95%',
        sizeRange: [14, 56],
        rotationRange: [-30, 30],
        gridSize: 6,
        textStyle: {
          fontFamily: 'Noto Sans SC',
          color: () => chartColors.mix[Math.floor(Math.random() * chartColors.mix.length)]
        },
        data: words
      }]
    });
  }

  function resizeCharts() {
    Object.values(charts).forEach((c) => c && c.resize());
  }

  /* ===== Interactive 1: Risk Quiz ===== */
  function initRiskQuiz() {
    const container = document.getElementById('riskQuiz');
    const resultEl = document.getElementById('riskResult');
    if (!container) return;

    const questions = [
      { q: '你是否经常在群聊、贴吧中寻找兼职信息？', scores: [3, 2, 1] },
      { q: '收到"快递丢失理赔"短信，你会怎么做？', scores: [3, 1, 0] },
      { q: '网友推荐"稳赚不赔"的投资平台，你会？', scores: [3, 2, 0] },
      { q: '视频通话中熟人紧急借钱，你会？', scores: [3, 1, 0] },
      { q: '你是否安装并开启国家反诈中心App预警？', scores: [0, 1, 2] },
      { q: '是否曾共享手机屏幕给"客服"？', scores: [3, 1, 0] }
    ];
    const options = ['A. 是/会/已经', 'B. 不确定/看情况', 'C. 否/不会/没有'];
    let qi = 0, score = 0;

    function render() {
      if (qi >= questions.length) {
        showResult();
        return;
      }
      const q = questions[qi];
      container.innerHTML = `<p class="quiz-q">${qi + 1}/${questions.length} ${q.q}</p><div class="quiz-options"></div>`;
      const opts = container.querySelector('.quiz-options');
      options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          score += q.scores[i];
          qi++;
          render();
        });
        opts.appendChild(btn);
      });
    }

    function showResult() {
      container.innerHTML = '';
      let level, cls, text;
      if (score >= 12) {
        level = '高风险'; cls = 'high';
        text = '你的行为习惯与多起真实案例高度吻合：轻信兼职、未安装反诈App、可能在"客服"话术下共享屏幕。建议立即安装国家反诈中心App，牢记"三不一多"，任何转账前务必二次核实。';
      } else if (score >= 6) {
        level = '中风险'; cls = 'medium';
        text = '你具备一定防范意识，但在"看情况"的选择中仍存在漏洞。诈骗话术专为犹豫者设计——"小额返利""限时理赔"都是利用你的侥幸。建议加强十大高发类型的学习。';
      } else {
        level = '低风险'; cls = 'low';
        text = '你的防诈习惯较好，但请保持警惕：AI换脸等新技术正在突破"核实身份"的传统防线。即使低风险，涉及转账时也请通过独立渠道确认。';
      }
      resultEl.className = 'quiz-result ' + cls;
      resultEl.innerHTML = `<h4>评估结果：${level}</h4><p>${text}</p><button class="btn-secondary" onclick="location.reload()">重新测试</button>`;
      resultEl.classList.remove('hidden');
    }
    render();
  }

  /* ===== Interactive 2: Chat Simulation ===== */
  function initChatSim() {
    const body = document.getElementById('chatBody');
    const opts = document.getElementById('chatOptions');
    if (!body) return;

    const story = {
      start: {
        msgs: ['同学你好，我是王老师。', '有个急事需要帮忙，方便吗？'],
        options: [
          { text: '王老师您好，什么事？', next: 'explain' },
          { text: '请先拨打学院官方电话核实', next: 'win' }
        ]
      },
      explain: {
        msgs: ['我在开会不方便打电话。', '需要你先帮我转5000元给这个账户，明天还你，有截图证明。'],
        options: [
          { text: '好的，我这就转', next: 'lose' },
          { text: '我到办公室找您当面说', next: 'win' },
          { text: '请发学院官方通知链接', next: 'pressure' }
        ]
      },
      pressure: {
        msgs: ['你怎么这么多疑？耽误事你负责！', '这是私事，别告诉别人。快转！'],
        options: [
          { text: '抱歉，必须通过官方渠道确认', next: 'win' },
          { text: '好吧我转', next: 'lose' }
        ]
      },
      win: {
        msgs: ['（你挂断了对话，并拨打学院官方电话）', '✅ 学院确认：王老师并未联系你。你成功识破了冒充领导熟人的骗局！'],
        options: [{ text: '再玩一次', next: 'restart' }]
      },
      lose: {
        msgs: ['（你转账5000元）', '❌ 对方收款后将你拉黑。这是典型的冒充领导熟人诈骗——公安部十大高发类型第7类。'],
        options: [{ text: '再玩一次', next: 'restart' }]
      }
    };

    function play(node) {
      if (node === 'restart') {
        body.innerHTML = '';
        play('start');
        return;
      }
      const s = story[node];
      opts.innerHTML = '';
      s.msgs.forEach((m, i) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'chat-msg ' + (m.startsWith('（') || m.startsWith('✅') || m.startsWith('❌') ? 'system' : 'them');
          div.textContent = m;
          body.appendChild(div);
          body.scrollTop = body.scrollHeight;
        }, i * 600);
      });
      setTimeout(() => {
        s.options.forEach((o) => {
          const btn = document.createElement('button');
          btn.className = 'btn-secondary';
          btn.textContent = o.text;
          btn.addEventListener('click', () => {
            const me = document.createElement('div');
            me.className = 'chat-msg me';
            me.textContent = o.text;
            body.appendChild(me);
            play(o.next);
          });
          opts.appendChild(btn);
        });
      }, s.msgs.length * 600 + 200);
    }
    play('start');
  }

  /* ===== Interactive 3: SMS Challenge ===== */
  function initSmsChallenge() {
    const container = document.getElementById('smsChallenge');
    const scoreEl = document.getElementById('smsScore');
    if (!container) return;

    const smsList = [
      { text: '【12381】您可能正在遭遇电信诈骗，请提高警惕。', fraud: false },
      { text: '【菜鸟驿站】您的快递因地址异常无法派送，点击 t.cn/xxx 修改地址。', fraud: true },
      { text: '【96110】您好，这里是反诈中心，请勿向陌生账户转账。', fraud: false },
      { text: '【淘宝客服】您购买的商品涉嫌违规，请添加QQ 123456 取消"百万保障"协议。', fraud: true },
      { text: '【10086】您的话费余额为32.5元，感谢使用中国移动。', fraud: false }
    ];
    let answered = 0, correct = 0;

    smsList.forEach((sms, idx) => {
      const item = document.createElement('div');
      item.className = 'sms-item';
      item.innerHTML = `<div class="sms-text">${sms.text}</div><div class="sms-btns"><button class="btn-secondary" data-v="real">真实</button><button class="btn-secondary" data-v="fraud">诈骗</button></div>`;
      item.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (item.dataset.done) return;
          item.dataset.done = '1';
          const isFraud = btn.dataset.v === 'fraud';
          const ok = isFraud === sms.fraud;
          if (ok) correct++;
          answered++;
          item.classList.add(ok ? 'correct' : 'wrong');
          item.querySelector('.sms-btns').innerHTML = ok
            ? '<span style="color:#4A90A4">✓ 正确</span>'
            : `<span style="color:#D94841">✗ ${sms.fraud ? '这是诈骗短信' : '这是正常通知'}</span>`;
          if (answered === smsList.length) {
            scoreEl.className = 'quiz-result ' + (correct >= 4 ? 'low' : correct >= 2 ? 'medium' : 'high');
            scoreEl.innerHTML = `<h4>得分：${correct}/${smsList.length}</h4><p>${correct >= 4 ? '辨别力优秀！记住：陌生链接不点击，"取消保障"是典型诈骗话术。' : '需加强警惕：涉及链接、QQ、屏幕共享的"客服"短信几乎都是诈骗。'}</p>`;
            scoreEl.classList.remove('hidden');
          }
        });
      });
      container.appendChild(item);
    });
  }

  /* ===== Interactive 4: Calculator ===== */
  function initCalc() {
    const btn = document.getElementById('calcBtn');
    const result = document.getElementById('calcResult');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const living = +document.getElementById('calcLiving').value || 0;
      const saving = +document.getElementById('calcSaving').value || 0;
      const income = +document.getElementById('calcIncome').value || 0;
      const loss = 15000;
      const monthly = living + income;
      const monthsFromSaving = saving >= loss ? 0 : Math.ceil((loss - saving) / Math.max(monthly, 1));
      const percentLife = living > 0 ? (loss / (living * 12) * 100).toFixed(1) : '—';
      result.innerHTML = `
        <p>若被骗 <strong>${loss.toLocaleString()} 元</strong>（参考吕梁大学生张某案例金额）：</p>
        <p>· 相当于 <strong>${percentLife}%</strong> 的年生活费（按月${living}元计）</p>
        <p>· 扣除现有存款${saving.toLocaleString()}元后，需 <strong>${monthsFromSaving} 个月</strong> 才能靠日常收入弥补</p>
        <p>· 若需借贷填补，还将产生额外利息与信用风险</p>
        <p style="margin-top:12px;color:#D94841">一笔诈骗，可能抵消你数个学期的努力。</p>`;
      result.classList.remove('hidden');
    });
  }

  /* ===== Interactive 5: AI Challenge ===== */
  function initAiChallenge() {
    const container = document.getElementById('aiChallenge');
    const resultEl = document.getElementById('aiChallengeResult');
    if (!container) return;

    const pairs = [
      { id: 1, aiIsB: true },
      { id: 2, aiIsB: false },
      { id: 3, aiIsB: true },
      { id: 4, aiIsB: false }
    ];
    let answers = {};

    function faceSvg(type, label) {
      const glitch = type === 'ai' ? '<line x1="45" y1="35" x2="55" y2="38" stroke="#D94841" stroke-width="1" opacity="0.6"/>' : '';
      const skin = type === 'ai' ? '#E8D5C4' : '#D4A574';
      return `<svg width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0" rx="8"/><ellipse cx="50" cy="45" rx="22" ry="26" fill="${skin}"/><circle cx="42" cy="42" r="3" fill="#333"/><circle cx="58" cy="42" r="3" fill="#333"/><path d="M42 55 Q50 62 58 55" stroke="#333" fill="none" stroke-width="1.5"/>${glitch}<text x="50" y="92" text-anchor="middle" font-size="9" fill="#666">${label}</text></svg>`;
    }

    pairs.forEach((p) => {
      const aType = p.aiIsB ? 'real' : 'ai';
      const bType = p.aiIsB ? 'ai' : 'real';
      const div = document.createElement('div');
      div.className = 'ai-pair';
      div.innerHTML = `<p style="margin-bottom:8px;font-size:0.85rem">第${p.id}组：哪个是AI合成？</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <label>${faceSvg(aType, 'A')}<input type="radio" name="ai${p.id}" value="A"></label>
          <label>${faceSvg(bType, 'B')}<input type="radio" name="ai${p.id}" value="B"></label>
        </div>`;
      div.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('change', () => {
          answers[p.id] = inp.value;
          if (Object.keys(answers).length === pairs.length) showResult();
        });
      });
      container.appendChild(div);
    });

    function showResult() {
      let correct = 0;
      pairs.forEach((p) => {
        const aiSide = p.aiIsB ? 'B' : 'A';
        if (answers[p.id] === aiSide) correct++;
      });
      resultEl.className = 'quiz-result ' + (correct >= 3 ? 'low' : 'medium');
      resultEl.innerHTML = `<h4>正确率：${correct}/${pairs.length}</h4><p>提示：AI换脸常在面部边缘、眨眼频率、背景融合处露出破绽。涉及转账时，务必让对方做挥手、转头等动态动作——静态图片/短视频不足以验证身份。</p>`;
      resultEl.classList.remove('hidden');
    }
  }

  /* ===== Interactive 6: Anti-fraud Quiz ===== */
  function initAntiQuiz() {
    const container = document.getElementById('antiQuiz');
    const cert = document.getElementById('certDisplay');
    if (!container) return;

    const levels = [
      { q: '刷单兼职是否合法？', opts: ['合法', '违法', '看平台'], ans: 1 },
      { q: '公检法是否会电话要求转账到"安全账户"？', opts: ['会', '不会', '紧急情况会'], ans: 1 },
      { q: '收到"快递丢失理赔"链接应？', opts: ['立即点击', '通过官方App核实', '转发给朋友'], ans: 1 },
      { q: 'AI视频通话能否作为转账依据？', opts: ['能，眼见为实', '不能，需二次核实', '看金额大小'], ans: 1 }
    ];
    let li = 0;

    function render() {
      if (li >= levels.length) {
        container.innerHTML = '<p style="color:#4A90A4;font-weight:600">✓ 全部通关！</p>';
        cert.classList.remove('hidden');
        document.getElementById('certDate').textContent = new Date().toLocaleDateString('zh-CN');
        return;
      }
      const l = levels[li];
      container.innerHTML = `<p class="quiz-q">第 ${li + 1} 关 / ${levels.length}：${l.q}</p><div class="quiz-options"></div>`;
      const opts = container.querySelector('.quiz-options');
      l.opts.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = o;
        btn.addEventListener('click', () => {
          if (i === l.ans) { li++; render(); }
          else alert('答错了，再想想！提示：牢记"三不一多"。');
        });
        opts.appendChild(btn);
      });
    }
    render();
  }

  /* ===== Interactive 7: Fraud Map ===== */
  function initFraudMap() {
    const nodesEl = document.getElementById('mapNodes');
    const detailEl = document.getElementById('mapDetail');
    if (!nodesEl) return;

    const nodes = [
      { title: '① 引流', text: '在QQ群、短视频评论区发布"日赚300"兼职广告，精准投放至大学生群体。' },
      { title: '② 小额返利', text: '前几单几十元任务，本金+佣金准时返还——建立"这很靠谱"的心理预期。' },
      { title: '③ 联单任务', text: '要求连续完成多笔订单才能"结算"，单笔金额从几百元跳至数千元。' },
      { title: '④ 卡单冻结', text: '以"任务未完成""账户冻结""需补单解冻"为由，拒绝返款并催促继续转账。' },
      { title: '⑤ 借贷加码', text: '受害者花光生活费后，诱导其向同学借钱、网贷——吕梁张某案即在此阶段损失1.5万。' },
      { title: '⑥ 失联', text: '再也拿不出钱时，骗子拉黑删除。报警后，资金往往已被多层转移。' }
    ];

    nodes.forEach((n, i) => {
      const btn = document.createElement('button');
      btn.className = 'map-node' + (i === 0 ? ' active' : '');
      btn.textContent = n.title;
      btn.addEventListener('click', () => {
        nodesEl.querySelectorAll('.map-node').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        detailEl.innerHTML = `<h4>${n.title}</h4><p>${n.text}</p>`;
      });
      nodesEl.appendChild(btn);
    });
    detailEl.innerHTML = `<h4>${nodes[0].title}</h4><p>${nodes[0].text}</p>`;
  }

  /* ===== Interactive 8: Poll Wall ===== */
  function initPoll() {
    const btns = document.querySelectorAll('.poll-btn');
    const chartEl = document.getElementById('pollChart');
    const noteEl = document.getElementById('pollNote');
    if (!btns.length) return;

    const base = { often: 1240, sometimes: 3580, never: 890 };
    const key = 'fraudPoll';

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.poll;
        const stored = JSON.parse(localStorage.getItem(key) || JSON.stringify(base));
        stored[v]++;
        localStorage.setItem(key, JSON.stringify(stored));
        showPoll(stored);
      });
    });

    function showPoll(data) {
      chartEl.classList.remove('hidden');
      const total = data.often + data.sometimes + data.never;
      if (!charts.pollChart) charts.pollChart = echarts.init(chartEl);
      charts.pollChart.setOption({
        ...chartTheme(),
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: '65%',
          data: [
            { value: data.often, name: '经常收到', itemStyle: { color: '#D94841' } },
            { value: data.sometimes, name: '偶尔收到', itemStyle: { color: '#E8A87C' } },
            { value: data.never, name: '从未收到', itemStyle: { color: '#4A90A4' } }
          ],
          label: { formatter: '{b}\n{d}%', color: '#2C2C2C' }
        }]
      });
      noteEl.textContent = `已有 ${total.toLocaleString()} 人次参与（含模拟基数+本地累计）。${((data.sometimes + data.often) / total * 100).toFixed(1)}% 的受访者表示曾收到诈骗信息——诈骗从未远离。`;
      charts.pollChart.resize();
    }
  }

  function debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }
})();
