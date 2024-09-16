import { useState } from "react";

function Rank() {
  const [isActiveTab, setIsActiveTab] = useState("habit");

  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <ul className="grid grid-cols-3 w-full">
        <li className={`border p-2 text-center ${isActiveTab === "habit" ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab("habit")}>
          習慣排行
        </li>
        <li className={`border p-2 text-center ${isActiveTab === "savings" ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab("savings")}>
          存款排行
        </li>
        <li className={`border p-2 text-center ${isActiveTab === "challenge" ? "bg-gray-200" : ""}`} onClick={() => setIsActiveTab("challenge")}>
          挑戰排行
        </li>
      </ul>
      {isActiveTab === "habit" && (
        <div>
          <div className="p-4 mt-4 bg-slate-300">
            <p className="text-center">
              在 08/25～08/31 期間
              <br />
              恭喜 我愛狗勾 成為累積最多次習慣的玩家
              <br />
              獲得習以為常成就！
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">1</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">2</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">3</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">4</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">5</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">6</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">7</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">8</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">9</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
            <li className="flex justify-between py-2 px-4 bg-slate-100">
              <div className="flex items-center gap-3">
                <p className="w-10 h-auto">10</p>
                <div className="w-10 h-10 bg-slate-300"></div>
                <div>
                  <p>我愛狗勾</p>
                  <p>Lv.10</p>
                </div>
              </div>
              <div className="text-end">
                <p>累積數量</p>
                <p>100 次</p>
              </div>
            </li>
          </ul>
          <div className="flex justify-between py-2 px-4 bg-slate-900">
            <div className="flex items-center gap-3 text-white">
              <p className="w-10 h-auto">--</p>
              <div className="w-10 h-10 bg-slate-300"></div>
              <div>
                <p>米香的可愛兒子</p>
                <p>Lv.01</p>
              </div>
            </div>
            <div className="text-end text-white">
              <p>累積數量</p>
              <p>5 次</p>
            </div>
          </div>
        </div>
      )}
      {isActiveTab === "savings" && <div>存款排行</div>}
      {isActiveTab === "challenge" && <div>挑戰排行</div>}
    </div>
  );
}
export default Rank;
