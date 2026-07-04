// G検定オフライン道場 - no external libraries, offline-first SPA
const TODAY="2026-07-04", LS={content:"gdojo.content.v1",learn:"gdojo.learning.v1",settings:"gdojo.settings.v1"};
const CATS=["人工知能とは","人工知能をめぐる動向","機械学習の概要","ディープラーニングの概要","ディープラーニングの要素技術","ディープラーニングの応用例","AIの社会実装","AIに必要な数理・統計","AIに関する法律と契約","AI倫理・AIガバナンス"];
const TOPICS={"人工知能とは":["人工知能の定義","AI効果","強いAI・弱いAI","シンボルグラウンディング問題","フレーム問題","チューリングテスト","身体性","知能とは何か","人間中心のAI","AI分野で議論される問題"],"人工知能をめぐる動向":["探索・推論","知識表現","エキスパートシステム","第1次AIブーム","第2次AIブーム","第3次AIブーム","機械学習","ディープラーニング","生成AI","基盤モデル","大規模言語モデル","マルチモーダルAI"],"機械学習の概要":["教師あり学習","教師なし学習","強化学習","分類と回帰","クラスタリング","決定木とランダムフォレスト","SVMとk近傍法","過学習と汎化性能","交差検証とデータリーク","混同行列と評価指標"],"ディープラーニングの概要":["ニューラルネットワーク","パーセプトロン","多層パーセプトロン","活性化関数","ソフトマックス関数","損失関数","正則化とドロップアウト","誤差逆伝播法","勾配降下法とAdam","エポックとバッチサイズ"],"ディープラーニングの要素技術":["全結合層","畳み込み層とCNN","プーリング層","正規化層とバッチ正規化","スキップ結合","RNN・LSTM・GRU","Transformer","AttentionとSelf-Attention","VAE・GAN・Diffusion Model","転移学習と軽量化"],"ディープラーニングの応用例":["画像認識","物体検出","セグメンテーション","自然言語処理","機械翻訳と要約","音声認識と音声合成","レコメンド","異常検知","XAIと解釈性","生成AIの活用とリスク"],"AIの社会実装":["AIプロジェクトの進め方","課題設定","データ収集と加工","アノテーション","PoC","MLOps","モデル運用","精度劣化とデータドリフト","モデル再学習","現場導入と継続改善"],"AIに必要な数理・統計":["確率と統計","平均・分散・標準偏差","正規分布","条件付き確率","ベイズの定理","線形代数","ベクトルと行列","内積","微分・偏微分・勾配","最適化と損失最小化"],"AIに関する法律と契約":["個人情報保護法","著作権法","特許法","不正競争防止法","独占禁止法","AI開発委託契約","AIサービス提供契約","データ利用契約","生成AIと著作権","プライバシーと利用規約"],"AI倫理・AIガバナンス":["AIガイドライン","公平性","バイアス","安全性とセキュリティ","悪用対策","透明性","説明責任","環境負荷と労働影響","AIガバナンス","リスクマネジメントと人間の監督"]};
const TERM_NAMES=["人工知能","AI効果","フレーム問題","シンボルグラウンディング問題","エキスパートシステム","教師あり学習","教師なし学習","強化学習","分類","回帰","クラスタリング","過学習","汎化性能","交差検証","混同行列","適合率","再現率","F値","AUC","ニューラルネットワーク","活性化関数","ReLU","ソフトマックス関数","誤差逆伝播法","勾配降下法","CNN","RNN","LSTM","Transformer","Attention","Self-Attention","GAN","VAE","Diffusion Model","転移学習","ファインチューニング","MLOps","データドリフト","XAI","生成AI","LLM","基盤モデル","個人情報保護法","著作権法","AI倫理","AIガバナンス","バイアス","公平性","透明性","説明責任","データリーク","正則化","ドロップアウト","Adam","量子化","アノテーション"];
let state={view:"home",history:["home"],quiz:null,exam:null,selectedChapter:null,selectedQuestion:null};
function clone(x){return JSON.parse(JSON.stringify(x))} function $(id){return document.getElementById(id)} function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function load(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}} function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function defaultSettings(){return{fontSize:16,dark:false,dailyGoal:20,shuffle:true,examCount:145,examMinutes:100}}
function defaultLearning(){return{answers:[],wrong:{},favorites:[],review:[],completedChapters:[],termFavorites:[],mockHistory:[],lastDate:null,streak:0}}
function makeQ(cat,topic,i,ci){const diff=i%5===0?"advanced":i%2===0?"standard":"basic", id=`${String(ci+1).padStart(2,"0")}-${String(i+1).padStart(3,"0")}`; const patterns=[`「${topic}」の説明として最も適切なものはどれか。`,`AI活用の現場で「${topic}」を扱う場合、最も注意すべきことはどれか。`,`「${topic}」について誤っているものはどれか。`]; const q=patterns[i%3]; const choices=[`${topic}は${cat}を理解するうえで重要で、目的・データ・評価方法と結び付けて考える。`,`常に人手の確認なしで自動化すれば、データ品質や運用リスクを考えなくてもよい。`,`名称が似た技術や概念と混同せず、入力・出力・利用場面の違いで整理する必要がある。`,`試験では定義だけでなく、具体例や限界、実務上の注意点も問われやすい。`]; let ans=i%3===2?1:0; if(ans!==0){choices[0]=`単語の暗記だけでなく、${topic}の目的、代表例、限界を説明できることが重要である。`} return{id,category:cat,subcategory:topic,difficulty:diff,questionType:"single-choice",question:q,choices,answer:ans,explanation:`${topic}は「${cat}」の頻出論点です。正解は、定義だけでなく利用場面、他概念との違い、実務上のリスクまで含めて理解している選択肢です。G検定では、単純な暗記よりも、ケースに当てはめて適切な判断を選ぶ力が問われます。`,wrongChoiceExplanations:choices.map((c,idx)=>idx===ans?`正解です。${topic}を目的・具体例・限界と結び付けて捉えています。`:`不正解です。${topic}の説明として一部は関連しますが、過度な一般化、リスク軽視、または問われている観点とのずれがあります。`),textbookRef:cat,keywords:[topic,cat],commonMistake:`${topic}を隣接概念と名前だけで判断し、データ、目的、評価軸の違いを見落としやすい。`,examPoint:`${topic}は、定義・具体例・実務上の注意点をセットで確認してください。`,sourceNote:"公式問題や市販問題のコピーではなく、学習用に作成したオリジナル問題",createdAt:TODAY,updatedAt:TODAY,version:1,enabled:true,reviewStatus:"approved",qualityMemo:"",userMistakeRate:0,timesAnswered:0,timesCorrect:0,lastReviewedAt:TODAY}}
function initialQuestions(){let a=[];CATS.forEach((c,ci)=>TOPICS[c].forEach((t,i)=>a.push(makeQ(c,t,i,ci))));return a}
function initialTextbook(){return CATS.map((c,i)=>({id:`chapter-${i+1}`,title:c,category:c.replace("の概要","").replace("とは",""),summary:`${c}では、G検定で問われる基本概念、代表例、実務での使われ方、注意点を体系的に学びます。`,sections:[{heading:"その章で学ぶこと",body:`${TOPICS[c].join("、")}を中心に、用語暗記に留まらず、AI開発・導入の場面でどう使うかを理解します。`},{heading:"概要",body:`${c}はG検定の重要範囲です。初学者は、定義、似た概念との差、代表的な応用例、限界やリスクの順に整理すると理解しやすくなります。`},{heading:"具体例と実務での使われ方",body:`実務では、課題設定、データ品質、評価指標、説明責任、運用後の監視が重要です。PoCで良い結果が出ても、現場導入では継続改善と人間による監督が必要です。`},{heading:"間違えやすいポイント",body:`名称が似た用語を暗記で処理すると、ケース問題で誤りやすくなります。入力データ、出力、評価方法、責任範囲で比較してください。`}],keyTerms:TOPICS[c],examTips:["定義・具体例・限界をセットで覚える。","実務ケースではデータ品質、評価、リスク管理を確認する。"],commonMistakes:["似た用語を目的ではなく語感で選んでしまう。","精度だけでAI導入可否を判断してしまう。"],miniQuizIds:initialQuestions().filter(q=>q.category===c).slice(0,3).map(q=>q.id),createdAt:TODAY,updatedAt:TODAY,version:1,enabled:true}))}
function initialGlossary(){return TERM_NAMES.map((t,i)=>{const cat=CATS[Math.min(CATS.length-1,Math.floor(i/6))];return{id:`term-${i+1}`,term:t,category:cat,description:`${t}はG検定で重要な基礎用語です。`,detail:`${t}は、定義だけでなく、関連する技術・制度・実務上の使いどころを合わせて理解することで、ケース問題に対応しやすくなります。`,examPoint:`${t}は関連用語との違い、具体例、注意点が問われやすいです。`,relatedTerms:TERM_NAMES.slice(Math.max(0,i-2),i).concat(TERM_NAMES.slice(i+1,i+3)),textbookRef:cat,createdAt:TODAY,updatedAt:TODAY,version:1,enabled:true}})}
function defaultContent(){return{questions:initialQuestions(),textbook:initialTextbook(),glossary:initialGlossary()}} let content=load(LS.content,null)||defaultContent(), learn=load(LS.learn,defaultLearning()), settings=load(LS.settings,defaultSettings());
function persist(){save(LS.content,content);save(LS.learn,learn);save(LS.settings,settings);applySettings()} function activeQ(){return content.questions.filter(q=>q.enabled&&q.reviewStatus==="approved")} function pct(a,b){return b?Math.round(a/b*100):0} function byId(id){return content.questions.find(q=>q.id===id)}
function applySettings(){document.body.classList.toggle("dark",settings.dark);document.documentElement.style.setProperty("--font-size",settings.fontSize+"px")} applySettings();
function nav(v){state.history.push(state.view);state.view=v;render()} function back(){state.view=state.history.pop()||"home";render()}
function stats(){const ans=learn.answers, today=ans.filter(a=>a.date===TODAY), correct=ans.filter(a=>a.correct).length;return{total:ans.length,correct,rate:pct(correct,ans.length),today:today.length,todayRate:pct(today.filter(a=>a.correct).length,today.length),read:pct(learn.completedChapters.length,content.textbook.length)}}
function weakness(){const m={};learn.answers.filter(a=>!a.correct).forEach(a=>m[a.category]=(m[a.category]||0)+1);return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,3)}
function render(){try{({home, textbook, quiz, categoryQuiz, exam, wrong, glossary, records, manage, settings:settingsView}[state.view]||home)()}catch(e){$("app").innerHTML=`<section class=card><h2>エラー</h2><p>${esc(e.message)}</p><button onclick="nav('home')">ホームへ</button></section>`}}
function home(){
  const s = stats(), weak = weakness();
  const cards = [
    ["textbook","📚","教科書で学ぶ","10章の体系教材"],
    ["quiz","✅","一問一答クイズ","即時採点と詳細解説"],
    ["categoryQuiz","🎯","分野別クイズ","カテゴリ・難易度指定"],
    ["exam","⏱️","模擬試験","タイマー付き本番形式"],
    ["wrong","🧠","間違えた問題","弱点復習"],
    ["glossary","🔎","用語集","50語以上"],
    ["records","📈","学習記録","進捗と弱点"],
    ["manage","🛠️","問題管理","追加・編集・レビュー"],
    ["settings","⚙️","設定","JSON入出力"]
  ];

  $("app").innerHTML = `
    <section class=card>
      <h2>今日の学習状況</h2>
      <div class=stats>
        <div class=stat>今日の回答<b>${s.today}</b></div>
        <div class=stat>総進捗<b>${s.read}%</b></div>
        <div class=stat>正答率<b>${s.rate}%</b></div>
        <div class=stat>連続学習日数<b>${learn.streak}</b></div>
        <div class=stat>今日の目標<b>${settings.dailyGoal}問</b></div>
      </div>
      <p>苦手分野トップ3: ${weak.map(w=>`${w[0]}(${w[1]})`).join("、") || "まだありません"}</p>
      <button onclick="startQuiz()">学習再開</button>
    </section>

    <section class=grid>
      ${cards.map(x=>`
        <button class="card menu-card" onclick="nav('${x[0]}')">
          <span class=icon aria-hidden=true>${x[1]}</span>
          <b>${x[2]}</b>
          <small>${x[3]}</small>
        </button>
      `).join("")}
    </section>
  `;
}
function textbook(){let ch=content.textbook.find(c=>c.id===state.selectedChapter)||content.textbook[0];state.selectedChapter=ch.id;$("app").innerHTML=`<div class=two><aside class=panel><input id=tsearch placeholder="章・キーワード検索" oninput="textbook()"><div class=list>${content.textbook.filter(c=>JSON.stringify(c).includes($("tsearch")?.value||"")).map(c=>`<div class="item ${c.id===ch.id?'active':''}" onclick="state.selectedChapter='${c.id}';textbook()">${esc(c.title)} ${learn.completedChapters.includes(c.id)?'✅':''}</div>`).join("")}</div></aside><section class=card><h2>${esc(ch.title)}</h2><p>${esc(ch.summary)}</p>${ch.sections.map(s=>`<h3>${esc(s.heading)}</h3><p>${esc(s.body)}</p>`).join("")}<h3>重要用語</h3>${ch.keyTerms.map(t=>`<span class=badge>${esc(t)}</span>`).join("")}<h3>試験で問われやすいポイント</h3><ul>${ch.examTips.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><h3>間違えやすいポイント</h3><ul>${ch.commonMistakes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><button onclick="completeChapter('${ch.id}')">読了にする</button> <button class=secondary onclick="startQuiz('${ch.title}')">関連問題へ</button> <button class=light onclick="nav('glossary')">関連用語へ</button><h3>章末ミニクイズ</h3>${ch.miniQuizIds.map(id=>`<button class=choice onclick="state.selectedQuestion='${id}';startQuiz(null,'${id}')">${id}: ${esc(byId(id)?.question||'')}</button>`).join("")}</section></div>`}
function completeChapter(id){if(!learn.completedChapters.includes(id))learn.completedChapters.push(id);persist();textbook()}
function startQuiz(cat=null,id=null){const pool=id?[byId(id)]:activeQ().filter(q=>!cat||q.category===cat);state.quiz={pool:settings.shuffle?pool.sort(()=>Math.random()-.5):pool,idx:0,correct:0,streak:0,answered:false};nav("quiz")}
function quiz(){if(!state.quiz) startQuiz();const q=state.quiz.pool[state.quiz.idx%state.quiz.pool.length];$("app").innerHTML=`<section class=card><h2>一問一答クイズ</h2><p>正答 ${state.quiz.correct} / 連続 ${state.quiz.streak}</p><h3>${esc(q.question)}</h3>${q.choices.map((c,i)=>`<button class="choice" id="choice${i}" onclick="answerQuiz(${i})">${i+1}. ${esc(c)}</button>`).join("")}<div id=feedback></div><div class=toolbar><button onclick="toggleList('review','${q.id}')">あとで復習</button><button onclick="toggleList('favorites','${q.id}')">お気に入り</button><button class=secondary onclick="startQuiz('${q.category}')">同じ分野をもう1問</button><button class=light onclick="nextQuiz()">次へ</button></div></section>`}
function answerQuiz(i){const q=state.quiz.pool[state.quiz.idx%state.quiz.pool.length];if(state.quiz.answered)return;state.quiz.answered=true;const ok=i===q.answer;state.quiz.correct+=ok?1:0;state.quiz.streak=ok?state.quiz.streak+1:0;record(q,ok,i);q.choices.forEach((_,n)=>$("choice"+n).classList.add(n===q.answer?"correct":n===i?"wrong":""));$("feedback").innerHTML=`<h3 class=${ok?'ok':'bad'}>${ok?'正解':'不正解'}</h3><p>${esc(q.explanation)}</p><ul>${q.wrongChoiceExplanations.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><p>教科書: <button class=light onclick="state.selectedChapter='${content.textbook.find(c=>c.title===q.textbookRef)?.id}';nav('textbook')">${esc(q.textbookRef)}</button></p>${q.keywords.map(k=>`<span class=badge>${esc(k)}</span>`).join("")}`;persist()}
function nextQuiz(){state.quiz.idx++;state.quiz.answered=false;quiz()} function toggleList(name,id){let a=learn[name];a.includes(id)?a.splice(a.indexOf(id),1):a.push(id);persist();alert("更新しました")}
function record(q,correct,choice){learn.answers.push({id:q.id,category:q.category,difficulty:q.difficulty,correct,choice,date:TODAY,time:Date.now()}); if(!correct){learn.wrong[q.id]=learn.wrong[q.id]||{count:0,streak:0,mastered:false};learn.wrong[q.id].count++;learn.wrong[q.id].streak=0}else if(learn.wrong[q.id]){learn.wrong[q.id].streak++;if(learn.wrong[q.id].streak>=3)learn.wrong[q.id].mastered=true} }
function categoryQuiz(){const cats=[...new Set(activeQ().map(q=>q.category))];$("app").innerHTML=`<section class=card><h2>分野別クイズ</h2><div class=toolbar><label>カテゴリ<select id=cqcat>${cats.map(c=>`<option>${esc(c)}</option>`)}</select></label><label>サブカテゴリ<input id=cqsub placeholder="任意"></label><label>難易度<select id=cqdiff><option value="">全て</option><option>basic</option><option>standard</option><option>advanced</option></select></label><label>問題数<select id=cqnum><option>5</option><option>10</option><option>20</option><option value="all">全問</option></select></label></div><button onclick="startCategoryQuiz()">ランダム出題開始（苦手優先）</button></section>`}
function startCategoryQuiz(){let p=activeQ().filter(q=>q.category===$("cqcat").value&&(!$("cqsub").value||q.subcategory.includes($("cqsub").value))&&(!$("cqdiff").value||q.difficulty===$("cqdiff").value));p.sort((a,b)=>(learn.wrong[b.id]?.count||0)-(learn.wrong[a.id]?.count||0)||Math.random()-.5);let n=$("cqnum").value==="all"?p.length:+$("cqnum").value;state.quiz={pool:p.slice(0,n),idx:0,correct:0,streak:0,answered:false};nav("quiz")}
function exam(){
  if(!state.exam){
    $("app").innerHTML = `
      <section class=card>
        <h2>模擬試験</h2>
        <p>スタートボタンを押すと問題セットを作成し、制限時間のカウントダウンを開始します。問題数が不足する場合は登録済み問題数に自動調整します。</p>

        <div class=stats>
          <div class=stat>オンライン試験想定<b>100分</b><span>145問</span></div>
          <div class=stat>会場試験想定<b>120分</b><span>145問</span></div>
          <div class=stat>現在の設定<b>${settings.examMinutes}分</b><span>${Math.min(settings.examCount, activeQ().length)}問</span></div>
        </div>

        <div class=toolbar>
          <button onclick="startExam('online')">オンライン想定でスタート</button>
          <button class=secondary onclick="startExam('venue')">会場想定でスタート</button>
          <button class=light onclick="resumeExam()">途中保存から再開</button>
        </div>
      </section>
    `;
    return;
  }

  const e = state.exam;
  const remain = Math.max(0, e.end - Date.now());
  const mm = String(Math.floor(remain / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remain % 60000) / 1000)).padStart(2, "0");

  if(remain === 0){
    finishExam();
    return;
  }

  $("app").innerHTML = `
    <section class=card>
      <h2>模擬試験</h2>
      <p><b>残り時間 ${mm}:${ss}</b> / 制限時間 ${e.minutes}分 / 未回答 ${e.pool.length - Object.keys(e.answers).length}</p>

      <div class=progress>
        <div class=bar style="width:${Math.max(0, Math.round(remain / (e.minutes * 60000) * 100))}%"></div>
      </div>

      <div class=exam-nav>
        ${e.pool.map((q,i)=>`
          <button class="${e.marks[q.id] ? "marked" : ""}" onclick="showExamQ(${i})">${i+1}</button>
        `).join("")}
      </div>

      <div id=examQ></div>

      <div class=toolbar>
        <button onclick="save(LS.learn, learn); save('gdojo.exam.resume', state.exam); alert('途中保存しました')">途中保存</button>
        <button class=danger onclick="finishExam()">採点する</button>
        <button class=light onclick="state.exam=null; exam()">中止して設定へ</button>
      </div>
    </section>
  `;

  showExamQ(e.current || 0);

  clearInterval(state.examTimer);
  state.examTimer = setInterval(()=>{
    if(state.view === "exam" && state.exam){
      exam();
    }else{
      clearInterval(state.examTimer);
    }
  }, 1000);
}

function startExam(type = "online"){
  const mins = type === "venue" ? 120 : 100;
  const count = 145;
  const questions = activeQ();

  settings.examMinutes = mins;
  settings.examCount = count;

  const pool = questions
    .sort(()=>Math.random() - 0.5)
    .slice(0, Math.min(count, questions.length));

  if(pool.length === 0){
    alert("出題できる問題がありません。問題データを確認してください。");
    return;
  }

  state.exam = {
    pool,
    answers: {},
    marks: {},
    start: Date.now(),
    end: Date.now() + mins * 60000,
    minutes: mins,
    current: 0,
    type
  };

  persist();
  exam();
}

function resumeExam(){
  state.exam = load("gdojo.exam.resume", null);

  if(state.exam){
    state.exam.end = state.exam.end || Date.now() + state.exam.minutes * 60000;
    exam();
  }else{
    alert("途中保存データがありません");
  }
}

function showExamQ(i){
  state.exam.current = i;
  const q = state.exam.pool[i];

  $("examQ").innerHTML = `
    <h3>${i+1}. ${esc(q.question)}</h3>
    ${q.choices.map((c,n)=>`
      <button class=choice onclick="state.exam.answers['${q.id}']=${n}; showExamQ(${i})">
        ${state.exam.answers[q.id] === n ? "●" : "○"} ${n+1}. ${esc(c)}
      </button>
    `).join("")}
    <button class=light onclick="state.exam.marks['${q.id}']=!state.exam.marks['${q.id}']; exam()">後で見直す</button>
  `;
}
function finishExam(){const e=state.exam;let correct=0, cats={};e.pool.forEach(q=>{const ok=e.answers[q.id]===q.answer;correct+=ok?1:0;cats[q.category]=cats[q.category]||[0,0];cats[q.category][1]++; if(ok)cats[q.category][0]++; record(q,ok,e.answers[q.id])});learn.mockHistory.push({date:TODAY,count:e.pool.length,correct,rate:pct(correct,e.pool.length)});state.exam=null;persist();$("app").innerHTML=`<section class=card><h2>模擬試験結果</h2><p>正答率 ${pct(correct,e.pool.length)}% (${correct}/${e.pool.length})</p>${Object.entries(cats).map(([c,v])=>`<p>${c}: ${pct(v[0],v[1])}%</p>`).join("")}<p>復習すべき章: ${weakness().map(w=>w[0]).join("、")}</p></section>`}
function wrong(){const ids=Object.keys(learn.wrong);$("app").innerHTML=`<section class=card><h2>間違えた問題</h2><label><input type=checkbox id=showMaster onchange="wrong()">克服済みも表示</label><div class=list>${ids.filter(id=>$("showMaster")?.checked||!learn.wrong[id].mastered).map(id=>{let q=byId(id),w=learn.wrong[id];return q?`<div class=item><b>${q.category}</b> 苦手度${w.count} 連続正解${w.streak} ${w.mastered?'✅克服':''}<p>${esc(q.question)}</p><button onclick="startQuiz(null,'${id}')">再挑戦</button><button class=light onclick="alert('${esc(q.explanation)}')">解説</button></div>`:""}).join("")}</div></section>`}
function glossary(){let terms=content.glossary.filter(t=>t.enabled).sort((a,b)=>a.term.localeCompare(b.term,"ja"));$("app").innerHTML=`<section class=card><h2>用語集</h2><div class=toolbar><input id=gq placeholder="検索" oninput="glossary()"><select id=gcat onchange="glossary()"><option value="">全カテゴリ</option>${CATS.map(c=>`<option>${c}</option>`).join("")}</select></div><div class=grid>${terms.filter(t=>(!$("gq")?.value||JSON.stringify(t).includes($("gq").value))&&(!$("gcat")?.value||t.category===$("gcat").value)).map(t=>`<div class=card><h3>${esc(t.term)} ${learn.termFavorites.includes(t.id)?'★':''}</h3><p>${esc(t.description)}</p><p>${esc(t.detail)}</p><p><b>試験:</b>${esc(t.examPoint)}</p>${t.relatedTerms.map(r=>`<span class=badge>${esc(r)}</span>`).join("")}<button onclick="toggleList('termFavorites','${t.id}')">お気に入り</button></div>`).join("")}</div></section>`}
function records(){const s=stats();$("app").innerHTML=`<section class=card><h2>学習記録</h2><div class=stats><div class=stat>総回答数<b>${s.total}</b></div><div class=stat>正解数<b>${s.correct}</b></div><div class=stat>正答率<b>${s.rate}%</b></div><div class=stat>今日の正答率<b>${s.todayRate}%</b></div><div class=stat>学習日数<b>${new Set(learn.answers.map(a=>a.date)).size}</b></div></div><h3>章ごとの読了率</h3><div class=progress><div class=bar style="width:${s.read}%"></div></div><h3>分野別正答率</h3>${CATS.map(c=>{let a=learn.answers.filter(x=>x.category===c);return `<p>${c}: ${pct(a.filter(x=>x.correct).length,a.length)}%</p>`}).join("")}<h3>苦手分野ランキング</h3>${weakness().map(w=>`<p>${w[0]} ${w[1]}回</p>`).join("")}<h3>模擬試験履歴</h3>${learn.mockHistory.map(h=>`<p>${h.date}: ${h.rate}% (${h.correct}/${h.count})</p>`).join("")}</section>`}
function validateQ(q,all=content.questions){let errors=[],warnings=[];if(!q.id)errors.push("idが空");if(all.filter(x=>x.id===q.id).length>1)errors.push("idが重複");if(!q.category)errors.push("categoryが空");if(!q.question)errors.push("questionが空");if(!Array.isArray(q.choices)||q.choices.length!==4)errors.push("choicesが4つない");if(![0,1,2,3].includes(q.answer))errors.push("answerが範囲外");if(!q.explanation)errors.push("explanationが空");if(!["basic","standard","advanced"].includes(q.difficulty))errors.push("difficulty不正");if(typeof q.enabled!=="boolean")errors.push("enabled不正");if(!["draft","reviewing","approved","archived"].includes(q.reviewStatus))errors.push("reviewStatus不正");if(!Array.isArray(q.wrongChoiceExplanations)||q.wrongChoiceExplanations.length!==q.choices?.length)errors.push("選択肢解説数不一致"); if((q.question||"").length<18)warnings.push("問題文が短すぎる");if((q.explanation||"").length<50)warnings.push("解説が短すぎる");if(new Set(q.choices||[]).size!==(q.choices||[]).length)warnings.push("選択肢重複");if((q.keywords||[]).length===0)warnings.push("キーワード未設定");if(!q.textbookRef)warnings.push("教科書参照未設定");if(!q.commonMistake)warnings.push("commonMistakeが空");if(!q.examPoint)warnings.push("examPointが空");return{errors,warnings}}
function manage(){const qs=content.questions;$("app").innerHTML=`<section class=card><h2>問題管理</h2><p class=warn>このアプリの問題は学習補助用のオリジナル問題です。公式問題や市販問題集の文章をコピーして登録しないでください。問題を追加する場合は、用語理解・概念理解・実務での使い分けを意識して作成してください。</p><div class=toolbar><input id=mq placeholder="キーワード/ID検索" oninput="manage()"><select id=mdiff onchange="manage()"><option value="">難易度</option><option>basic</option><option>standard</option><option>advanced</option></select><select id=mstat onchange="manage()"><option value="">reviewStatus</option><option>draft</option><option>reviewing</option><option>approved</option><option>archived</option></select></div><div class=toolbar><button onclick="newQuestion()">新規追加</button><button onclick="reviewReport()">問題レビュー</button><button onclick="exportData('questions')">questions.jsonを保存</button><button onclick="templateQ()">問題追加用テンプレートを出力</button></div><div class=two><div class=list>${qs.filter(q=>(!$("mq")?.value||JSON.stringify(q).includes($("mq").value))&&(!$("mdiff")?.value||q.difficulty===$("mdiff").value)&&(!$("mstat")?.value||q.reviewStatus===$("mstat").value)).map(q=>`<div class=item onclick="editQuestion('${q.id}')"><b>${q.id}</b> ${q.enabled?'':'無効'} ${q.reviewStatus}<br>${esc(q.question)}</div>`).join("")}</div><div id=editor class=panel>問題を選択してください。</div></div></section>`}
function editQuestion(id){const q=byId(id);$("editor").innerHTML=`<h3>${q.id}</h3><textarea id=qjson>${esc(JSON.stringify(q,null,2))}</textarea><div class=toolbar><button onclick="saveQuestion('${id}')">保存</button><button onclick="dupQuestion('${id}')">複製</button><button class=light onclick="toggleEnabled('${id}')">有効/無効</button><button class=danger onclick="delQuestion('${id}')">削除</button></div><div id=qcheck></div>`;checkEditor()} function checkEditor(){try{let q=JSON.parse($("qjson").value), r=validateQ(q,content.questions.filter(x=>x.id!==q.id).concat([q]));$("qcheck").innerHTML=`<b>${r.errors.length?'エラー':'OK'}</b><p class=bad>${r.errors.join('<br>')}</p><p class=warn>${r.warnings.join('<br>')}</p><h4>プレビュー</h4><p>${esc(q.question)}</p>`}catch(e){$("qcheck").innerHTML=`<p class=bad>JSON構文エラー: ${esc(e.message)}</p>`}} setInterval(()=>$("qjson")&&checkEditor(),1500);
function saveQuestion(old){let q=JSON.parse($("qjson").value), arr=content.questions.filter(x=>x.id!==old);let r=validateQ(q,arr.concat([q]));if(r.errors.length)return alert("保存できません:\n"+r.errors.join("\n"));content.questions=arr.concat([q]);persist();manage()} function newQuestion(){const q=makeQ("機械学習の概要","新規トピック",999,2);q.id="new-"+Date.now();content.questions.push(q);persist();manage();editQuestion(q.id)} function dupQuestion(id){let q=clone(byId(id));q.id+="-copy-"+Date.now();content.questions.push(q);persist();manage()} function delQuestion(id){if(confirm("削除しますか")){content.questions=content.questions.filter(q=>q.id!==id);persist();manage()}} function toggleEnabled(id){let q=byId(id);q.enabled=!q.enabled;persist();manage()} function reviewReport(){const rows=content.questions.filter(q=>validateQ(q).warnings.length||q.reviewStatus!=="approved"||!q.keywords?.length).slice(0,80);$("editor").innerHTML=`<h3>問題レビュー</h3>${rows.map(q=>`<p><b>${q.id}</b> ${validateQ(q).warnings.join('、')||q.reviewStatus}</p>`).join("")}`}
function settingsView(){$("app").innerHTML=`<section class=card><h2>設定</h2><div class=toolbar><label>文字サイズ<input type=number value="${settings.fontSize}" onchange="settings.fontSize=+this.value;persist()"></label><label>今日の目標<input type=number value="${settings.dailyGoal}" onchange="settings.dailyGoal=+this.value;persist()"></label><label>模試問題数<input type=number value="${settings.examCount}" onchange="settings.examCount=+this.value;persist()"></label><label>模試分数<input type=number value="${settings.examMinutes}" onchange="settings.examMinutes=+this.value;persist()"></label></div><p><label><input type=checkbox ${settings.dark?'checked':''} onchange="settings.dark=this.checked;persist()"> ダークモード</label> <label><input type=checkbox ${settings.shuffle?'checked':''} onchange="settings.shuffle=this.checked;persist()"> 問題シャッフル</label></p><h3>JSON入出力</h3><div class=grid>${['questions','textbook','glossary'].map(k=>`<button onclick="exportData('${k}')">${k}.jsonを保存</button><button class=secondary onclick="importData('${k}')">${k}.jsonを読み込む</button>`).join("")}<button onclick="templateQ()">問題追加用テンプレートを出力</button><button onclick="exportBackup()">インポート前バックアップ出力</button></div><div class=toolbar><select id=importMode><option value=add>既存データに追加する</option><option value=update>同じIDだけ上書きする</option><option value=replace>すべて置き換える</option></select><label><input type=checkbox id=skipDisabled> 無効データは読み込まない</label></div><p id=importResult></p><h3>リセット</h3><button class=danger onclick="if(confirm('学習データをリセットしますか')){learn=defaultLearning();persist();render()}">学習データリセット</button> <button class=danger onclick="if(confirm('教材データをリセットしますか')){content=defaultContent();persist();render()}">教材データリセット</button></section>`}
function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)} function exportData(k){download(k+".json",content[k])} function exportBackup(){download("gdojo-backup.json",content)} function templateQ(){download("question-template.json",[makeQ("機械学習の概要","テンプレート",0,2)])}
function importData(k){const inp=$("fileInput");inp.onchange=()=>{const f=inp.files[0];if(!f)return;f.text().then(txt=>{try{let data=JSON.parse(txt);if(!Array.isArray(data))throw new Error("JSONは配列形式にしてください");let mode=$("importMode")?.value||"add", skip=$("skipDisabled")?.checked, old=content[k], added=0,updated=0,skipped=0,errors=[];if(mode==="replace"&&!confirm("すべて置き換えますか"))return;let base=mode==="replace"?[]:clone(old);data.forEach(x=>{if(skip&&x.enabled===false){skipped++;return} if(k==="questions"&&validateQ(x,base.concat([x])).errors.length){errors.push(`${x.id||'(no id)'}: ${validateQ(x,base.concat([x])).errors.join(',')}`);return}let idx=base.findIndex(y=>y.id===x.id);if(idx>=0){if(mode!=="add"){base[idx]=x;updated++}else skipped++}else{if(mode!=="update"){base.push(x);added++}else skipped++}});content[k]=base;persist();render();alert(`読み込み:${data.length} 追加:${added} 更新:${updated} スキップ:${skipped} エラー:${errors.length}\n${errors.join('\n')}`)}catch(e){alert("JSON読み込み失敗: "+e.message)}})};inp.click()}
$("homeBtn").onclick=()=>nav("home");$("backBtn").onclick=back;render();
