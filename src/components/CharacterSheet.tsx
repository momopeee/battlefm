
import React from 'react';
import { X } from 'lucide-react';

interface CharacterSheetProps {
  character: string;
  onClose: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onClose }) => {
  const getCharacterInfo = () => {
    switch(character) {
      case 'player':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">山根透（やまね とおる） - 「マネジメントマスター」</h2>
            <div>
              <h3 className="text-lg font-semibold">基本情報</h3>
              <ul className="list-disc pl-5">
                <li>タイプ: ファイト／ブレイン（格闘と知性の融合）</li>
                <li>職業: 経営コンサルタント／経営参謀</li>
                <li>出身: 鳥取県岩美町（海辺の漁師町）</li>
                <li>年齢: 46歳</li>
                <li>好きなもの: 仕事、筋トレ、スパイスカレー、鮨</li>
                <li>特技: 戦略構築、人材育成、データ分析</li>
                <li>座右の銘: 「我唯足知」</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">能力値（参考値）</h3>
              <ul className="list-disc pl-5">
                <li>攻撃力: ★★★★☆</li>
                <li>防御力: ★★★★★</li>
                <li>知性: ★★★★★</li>
                <li>スピード: ★★★☆☆</li>
                <li>統率力: ★★★★★</li>
                <li>バランス感覚: ★★★★★</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">バトルスタイルと特殊技</h3>
              <p>山根透は「ビジネスストラテジスト」として、先読みと相手の弱点を的確に突く分析力を有する。</p>
              <p>※実際のバトル中は、操作コマンドとして「たたかう」「とくぎ」などを使用し、演出メッセージに特殊技（経営革命、マインドセットシフト、マーケティングアナライズ、ジェネラリストの眼、男気アタック）のエッセンスを反映する。</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">ストーリー／バックストーリー</h3>
              <p>漁師町で生まれた天性の才能を持つ山根透は、幼少期から知性と運動能力を発揮。
              「ど田舎の神童」として知られ、部活動や学業でリーダーシップを発揮。
              社会進出後、数々の企業で経験を積み、28歳で経営に参画。
              困難な状況を打破し、海外展開に成功。現在は「OFFICE IMAGINATIVE」を設立し、基礎能力の重要性を説く指導者として活躍。</p>
              <p>※口癖：「なるほど、面白い発想だな」「まずは相手を理解することから始めよう」</p>
            </div>
          </div>
        );
      
      case 'opponent1':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">そーそー（そうそう）-「狂犬的ツイートマスター」</h2>
            
            <div>
              <h3 className="text-lg font-semibold">基本情報</h3>
              <ul className="list-disc pl-5">
                <li>名前： そーそー</li>
                <li>年齢・性別： 20代 / 男性</li>
                <li>座右の銘： 「ムハンマドなくしてカールなし」</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">背景・キャラクター概要</h3>
              <p>金融の知見に長け、20代ながら「金融死にかけ」の苦い経験を持つ。
              SNS上では、日本社会の負の側面に対して独自のロジックで斬り込む過激な意見を発信し、議論を巻き起こす存在。
              プライベートでは、食やファッションに強い関心を持ち、スタイルの良い美人な若い女性には寛容な一面もある。スケベ。</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">能力値</h3>
              <ul className="list-disc pl-5">
                <li>体力：75/100</li>
                <li>攻撃力：85/100</li>
                <li>防御力：60/100</li>
                <li>知力：95/100</li>
                <li>魅力：70/100</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">スキル</h3>
              
              <div className="mt-2">
                <h4 className="font-semibold">極論の一撃</h4>
                <p>説明：消費税や金融の極端な政策論を武器に、敵の防御を貫通する。</p>
                <p>典型セリフ：</p>
                <ul className="list-disc pl-5">
                  <li>「消費税30%で、全て解決！」</li>
                  <li>「軽減税率は幻想、現実を見ろ！」</li>
                  <li>「金融の真実、一撃必殺！」</li>
                </ul>
              </div>
              
              <div className="mt-2">
                <h4 className="font-semibold">論破の嵐</h4>
                <p>説明：卓越した金融知識と鋭い論理で、敵を言葉の刃で打ち砕く。</p>
                <p>典型セリフ：</p>
                <ul className="list-disc pl-5">
                  <li>「消費税20%、所得税はもう不要！」</li>
                  <li>「池田万作？知恵遅れ説炸裂！」</li>
                </ul>
              </div>
              
              <div className="mt-2">
                <h4 className="font-semibold">排外の一喝</h4>
                <p>説明：排他的な主張で敵陣に衝撃を与え、戦意を喪失させる。</p>
                <p>典型セリフ：</p>
                <ul className="list-disc pl-5">
                  <li>「移民は追い出せ、金持ちに道を！」</li>
                  <li>「働け！結婚で未来変える！」</li>
                </ul>
              </div>
              
              <div className="mt-2">
                <h4 className="font-semibold">風評被害</h4>
                <p>説明：過激な中傷と暴露で敵の信用と士気を根底から揺さぶる。</p>
                <p>典型セリフ：</p>
                <ul className="list-disc pl-5">
                  <li>「玉木、確信犯の真実暴く！」</li>
                  <li>「財務省解体論、笑い飛ばせ！」</li>
                  <li>「ヤフー内部留保、暴露だ！」</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">戦闘スタイルと特徴</h3>
              <p>直接的な物理攻撃より、金融や政治をモチーフにした戦略的な言葉攻撃で、敵の防御や士気を削る。
              近接戦はやや苦手だが、遠距離からの特殊攻撃で敵の隙を突く。
              極端な発言がそのまま技のエッセンスとなり、戦況を一変させる可能性を秘める。</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">備考</h3>
              <p>本キャラクターは、実際の政策論や社会批判をフィクションとして取り入れた設定であり、ゲーム内では過激な意見や強烈な言葉が特殊能力として表現される。</p>
            </div>
          </div>
        );
        
      case 'opponent2':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">キャラクターシート：ゆうじ</h2>
            
            <div>
              <h3 className="text-lg font-semibold">基本情報</h3>
              <ul className="list-disc pl-5">
                <li>名前・チャット名：ゆうじ＠陽気なおじさん</li>
                <li>本名：大久保雄治</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">職業</h3>
              <p>ウェディングプランナー兼ウェディングコンサルタント</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">ビジョン・目標</h3>
              <ul className="list-disc pl-5">
                <li>ビジョン：日本の結婚式の在り方を変える</li>
                <li>目標：フリープランナーの地位向上</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">性格・行動パターン</h3>
              <ul className="list-disc pl-5">
                <li>しいたけ占いが好き</li>
                <li>怒られるとすぐに拗ねる</li>
                <li>優しそうな女性にすぐ慰めてもらおうとする</li>
                <li>かわいこぶる（自分をかわいく見せようとする傾向がある）</li>
                <li>誕生日にプレゼントを贈ることを非常に重要視する</li>
                <li>バルーンに対して強い嫌悪感を抱いている</li>
                <li>おじさんに説教されると強く落ち込む</li>
                <li>ラップが得意で、営業の才能もある（自称）</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">外見・特徴</h3>
              <ul className="list-disc pl-5">
                <li>髪の毛は散らかりつつあり、ややだらしなく見える</li>
                <li>全体的に「陽気なおじさん」というイメージ</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">実績</h3>
              <ul className="list-disc pl-5">
                <li>スタエフで99人のコラボを達成</li>
                <li>デザインフェス（デザフェス）に出場するため、クラウドファンディングで資金調達に成功</li>
                <li>スタエフにて多数のロイヤルカスタマーを抱える</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return <div>キャラクター情報が見つかりません</div>;
    }
  };

  return (
    <div className="popup-character-sheet text-white">
      <div className="bg-battle-purple p-6 rounded-lg max-w-3xl mx-auto my-10 relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="overflow-y-auto max-h-[80vh] p-2">
          {getCharacterInfo()}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
