import { useState } from "react";

function Savings() {
  const [isOverview, setIsOverview] = useState(true);

  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <ul className="grid grid-cols-2 w-full">
        <li className={`border p-2 text-center ${isOverview ? "bg-gray-200" : ""}`} onClick={() => setIsOverview(true)}>
          存款總覽
        </li>
        <li className={`border p-2 text-center ${!isOverview ? "bg-gray-200" : ""}`} onClick={() => setIsOverview(false)}>
          習慣類別總覽
        </li>
      </ul>
      {isOverview ? (
        <div>
          <div className="p-4 border space-y-4">
            <div className="flex justify-between items-center">
              <h2>存款總覽</h2>
              <button className="border">本週</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-end">
                <p>5 次</p>
                <p>完成習慣次數</p>
              </div>
              <div className="text-end">
                <p>3 次</p>
                <p>存款次數</p>
              </div>
              <div className="text-end">
                <p>NT$20</p>
                <p>存款金額</p>
              </div>
            </div>
            <div className="w-full h-52 bg-slate-100">Chart...</div>
          </div>
          <ul className="space-y-2 mt-4">
            <li className="py-2 px-4 grid grid-cols-4 border">
              <p>編號</p>
              <p className="text-center">日期</p>
              <p className="text-center">習慣名稱</p>
              <p className="text-center">習慣存款</p>
            </li>
            <li className="py-2 px-4 grid grid-cols-4 bg-slate-300">
              <p>01</p>
              <p className="text-center">2024/09/10</p>
              <p className="text-center">規劃當日工作</p>
              <p className="text-center">NT$10</p>
            </li>
          </ul>
        </div>
      ) : (
        <div>Category</div>
      )}
    </div>
  );
}
export default Savings;
