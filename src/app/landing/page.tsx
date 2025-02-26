import Link from "next/link";
import Image from "next/image";

const Welcome = () => {
    return <div className="welcome">
        <h3>Mitome's portfolio</h3>
        <div　className="paragraph">
            本ウェブサイトは、学習と実用を兼ねてローカルで開発していたものを、公開ポートフォリオとして一時的に配備したものです。急遽作成した無愛想なトップページですがご容赦ください。
            題材として、ソーシャルゲーム（ウマ娘プリティダービー）を用いています。
        </div>

        <div　className="paragraph">
            <h5>※偶然ここへたどり着いた方へ</h5>
            <div className="minor-note">本ウェブサイトは、一時的に稼働している見本やオモチャのようなもので、実際のwebサービスを提供するためのものではありません。ブラウザバックしていただけると幸いです。</div>
        </div>


    
        <div className="paragraph">
            <h3>Examples of APIs</h3>
            <div className="minor-note">実装したAPIの一部です。大部分は、フロントあるいは開発端末から呼ばれてMongoDBへのCRUD操作を行います。</div>
            <div className="minor-note">Read (get) 以外の操作のapiは、開発端末からしか動作しないようにしているのでここに列挙しておりません</div>
            <div><Link href="/api/version/" target="_blank">version</Link>: just show version（生死、疏通確認用）</div>
            <div><Link href="/api/historic/all" target="_blank">historic ids</Link>: get all Umamusume characters' id </div>
            <div><Link href="/api/historic/677ddc8361d0361aaedd4630" target="_blank">historic</Link>: get information of a Umamusume character's id </div>
        </div>

        <div className="paragraph">
            <h3>Examples of pages</h3>
            <div>
                <div><Link href="/hof/register" target="_blank">register hall of fame</Link>: </div>
                <div className="minor-note">
                    育成キャラ（疑似）登録フォーム。実際の動作としては、登録に使用するJSONを出力するまで。
                    フォーム内容の大部分は、DBからの情報を元に動的に成形。
                </div>
                <div className="minor-note">
                    ゲーム画面のスクリーンショットから自動入力を行う機能も実装（Tesseractを使用）。学習用データの数を充分用意出来ておらず、必ずしも完全な結果ではないものの、tesserectやMacOSのPreviewでは全く読み取れなかった星印を判別可能
                </div>
                <div>
                    <div className="page-exapmle">
                    <h5>Example:</h5>
                        <Image src={"/portfolio/stars.png"} alt={""}  width={583/2} height={36/2}/> 
                    <table>
                        <thead>
                            <tr>
                                <th scope="col"></th><th scope="col">読み取り結果</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>訓練前</td><td>NL ーーてL7</td>
                            </tr>
                            <tr>
                                <td>訓練後</td><td>★★☆ ★★☆</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="minor-note">訓練前: tessdata 4.0.0 jpn best版 (https://tessdata.projectnaptha.com/4.0.0_best/jpntraineddata.gz)</div>
                    <div className="minor-note">訓練後: best版から50000回学習 <Link href="/portfolio/jpn_hofuma.plot_cer.png" target="_blank">プロット</Link></div>
                    </div>
                    他の例
                    <details className="dual" >
                        <summary></summary>
                        <div>上が訓練前で、下が訓練後</div>
                        <div>まだまだ完璧とは言いがたいものの、星印や飾り文字（「A」など）を中心に良化</div>
                        <div className="dual">
                        <div className="left-part">
                            <Image src={"/portfolio/fullsize.jpeg"} alt={""}  width={200} height={200/1640*2160}/> 
                        </div>
                        <div className="right-part">
                            <textarea readOnly value={
                                                                `っ    |    7ガ    [爆走タニボエンジン]   (に》
ン      2 人示    ツインタニーボ
放                  人て明
エンシニア
34,260               マイル          (の
ささスピード スタミナ   4 パワー     @ゐ根性     井賢 さ
嶋1796 i【同1209 1201 」【1201 上路1259
バ場適性    芝 8 ダート 時
<   短距離 」 | マイル 作 | 中距離 負 」 長距離 D グ
脚質適性   逃げ 作   先行   差し   追込
スキル 上表還と 斑語凍 形成情報
固チーー //
信                ーー
/がにで5                :
るんロモ
>             YY
ず 集中カ             ぱ 示脱     。
夜の
ず 先駆け      |            ぱ) 怠きぎ足
の         補
ツウ 逃げ直線〇          りう 折れない心
補補
ウう メカウマ娘シナリオ・SPD  つう メカウマ娘シナリオ・STM
て         ッッ
】        つう メカウマ娘シナリオ・GUTS _ うう メカウマ娘シナリオ・WIT
て
    継承元`
                            }>

                                
                            </textarea>
                            <textarea readOnly value={
                                                                `ィナ竹
っ 晴 タ エジジジ
 ★★ ぎ
 4 ★★ ス   F                           放更
★
★★ デ
34,260                 マイル           の
！スー スタミナィ   ィ パ     統性     賢さ
U1796 U1209 U1201 U1201 U1259
パ場適性 S ダート Fビ
C   短距離 G マイル A 中距離 A 長距離 D ス
脚質適性    逃げ A   先行 G   差し G   追込 G
スキル              育成情幸
- ワ
3  ゅ
 ス                  ★
   エ
ナチキエクジククク   ★        の     ★★
 集中カ
★★★★★              ★★★★
ウ 先駆け            の 急ぎ足
★★☆ ★              ★★★ ★★
の 爺げ臣線O                の 折れない心
★★★         ★★★
ウ メカウマ娘シナリオ・SPFPD   ウ メカウマ娘シナリオ・ST
★★★★         ★★★
 メカウマ娘シナリオ・GUTS メカウマ娘シナリオ・WTT
★★★         ★★★
        継承元`
                            }>

                                
                            </textarea>
                        </div>
                        </div>
                    </details>

                </div>
            </div>
        </div>
        <div className="note">
            <div className="note-content">※ウマ娘シリーズの著作権や諸権利は、Cygames及び馬主の方々に帰属します</div>
            <div className="note-content indented">・キャラクターのアイコンは、公式サイトの配布しているものです</div>
            <div className="note-content indented">・OCRの機械学習にゲーム画面のスクリーンショットを用いています</div>
        </div>
    </div>
}

export default Welcome;