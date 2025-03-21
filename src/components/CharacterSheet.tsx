
import React from 'react';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';

interface CharacterSheetProps {
  character: 'player' | 'opponent1' | 'opponent2' | null;
  onClose: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onClose }) => {
  const { player, opponent1, opponent2 } = useApp();
  
  if (!character) return null;
  
  let content: JSX.Element;
  
  switch (character) {
    case 'player':
      content = (
        <div className="text-white jp-text">
          <h2 className="text-xl font-bold mb-4">山根透（やまね とおる） - 「マネジメントマスター」</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">基本情報</h3>
            <ul className="list-disc pl-4">
              <li>タイプ: ファイト／ブレイン（格闘と知性の融合）</li>
              <li>職業: 経営コンサルタント／経営参謀</li>
              <li>出身: 鳥取県岩美町（海辺の漁師町）</li>
              <li>年齢: 46歳</li>
              <li>好きなもの: 仕事、筋トレ、スパイスカレー、鮨</li>
              <li>特技: 戦略構築、人材育成、データ分析</li>
              <li>座右の銘: 「我唯足知」</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">能力値（参考値）</h3>
            <ul className="list-disc pl-4">
              <li>攻撃力: ★★★★☆</li>
              <li>防御力: ★★★★★</li>
              <li>知性: ★★★★★</li>
              <li>スピード: ★★★☆☆</li>
              <li>統率力: ★★★★★</li>
              <li>バランス感覚: ★★★★★</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">バトルスタイルと特殊技</h3>
            <p>山根透は「ビジネスストラテジスト」として、先読みと相手の弱点を的確に突く分析力を有する。</p>
          </div>
        </div>
      );
      break;
      
    case 'opponent1':
      content = (
        <div className="text-white jp-text">
          <h2 className="text-xl font-bold mb-4">そーそー（そうそう）-「狂犬的ツイートマスター」</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">基本情報</h3>
            <ul className="list-disc pl-4">
              <li>年齢・性別： 20代 / 男性</li>
              <li>座右の銘： 「ムハンマドなくしてカールなし」</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">背景・キャラクター概要</h3>
            <p>金融の知見に長け、20代ながら「金融死にかけ」の苦い経験を持つ.
            SNS上では、日本社会の負の側面に対して独自のロジックで斬り込む過激な意見を発信し、議論を巻き起こす存在.
            プライベートでは、食やファッションに強い関心を持ち、スタイルの良い美人な若い女性には寛容な一面もある.スケベ。</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">能力値</h3>
            <ul className="list-disc pl-4">
              <li>体力：75/100</li>
              <li>攻撃力：85/100</li>
              <li>防御力：60/100</li>
              <li>知力：95/100</li>
              <li>魅力：70/100</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">スキル</h3>
            <ul className="list-disc pl-4">
              <li>極論の一撃</li>
              <li>論破の嵐</li>
              <li>排外の一喝</li>
              <li>風評被害</li>
            </ul>
          </div>
        </div>
      );
      break;
      
    case 'opponent2':
      content = (
        <div className="text-white jp-text">
          <h2 className="text-xl font-bold mb-4">ゆうじ＠陽気なおじさん</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">基本情報</h3>
            <ul className="list-disc pl-4">
              <li>本名：大久保雄治</li>
              <li>職業：ウェディングプランナー兼ウェディングコンサルタント</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">ビジョン・目標</h3>
            <ul className="list-disc pl-4">
              <li>ビジョン：日本の結婚式の在り方を変える</li>
              <li>目標：フリープランナーの地位向上</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">性格・行動パターン</h3>
            <ul className="list-disc pl-4">
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
        </div>
      );
      break;
      
    default:
      content = <div>キャラクター情報がありません</div>;
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        {content}
      </div>
    </div>
  );
};

export default CharacterSheet;
