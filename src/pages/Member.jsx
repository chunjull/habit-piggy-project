function Member() {
  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <ul className="grid grid-cols-2 w-full">
        <li className="border p-2 text-center">會員管理</li>
        <li className="border p-2 text-center">歷史習慣</li>
      </ul>
      <div className="flex justify-between items-center">
        <h2>會員管理</h2>
        <button className="border">設定</button>
      </div>
      <div className="p-4 border space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-slate-300"></div>
            <div className="flex flex-col">
              <h3>米香的可愛兒子</h3>
              <p className="text-slate-500">Lv.01</p>
            </div>
          </div>
        </div>
        <p>媽咪最乖最聽話的鵝子</p>
        <div className="w-full bg-slate-300 text-center">30%</div>
      </div>
      <div className="pt-8 pb-4 px-4 border space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button className="border">習以為常</button>
          <button className="border">金豬玉葉</button>
          <button className="border">休養生習</button>
          <button className="border">第一桶金</button>
        </div>
        <button className="text-center w-full bg-slate-300">更多成就</button>
      </div>
      <div className="pt-8 pb-4 px-4 border space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="w-20 h-20 bg-slate-100"></div>
          <div className="w-20 h-20 bg-slate-100"></div>
          <div className="w-20 h-20 bg-slate-100"></div>
          <div className="w-20 h-20 bg-slate-100"></div>
        </div>
        <button className="text-center w-full bg-slate-300">更多獎勵徽章</button>
      </div>
    </div>
  );
}
export default Member;
