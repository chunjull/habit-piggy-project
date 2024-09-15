function Posts() {
  return (
    <div className="p-4 space-y-4 mb-16 md:mb-0">
      <div className="flex justify-between items-center">
        <h2>存款總覽</h2>
        <button className="border">本週</button>
      </div>
      <ul className="space-y-4">
        <li className="p-4 border space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-300"></div>
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <h3>水桶裡的卯咪</h3>
                  <p>今天 00:02</p>
                </div>
                <p className="text-slate-500">Lv.10</p>
              </div>
            </div>
          </div>
          <p className="w-full h-52 bg-slate-100">post content</p>
          <div className="flex gap-3">
            <button className="border">Like</button>
            <button className="border">Comment</button>
          </div>
        </li>
        <li className="p-4 border space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-300"></div>
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <h3>水桶裡的卯咪</h3>
                  <p>今天 00:02</p>
                </div>
                <p className="text-slate-500">Lv.10</p>
              </div>
            </div>
          </div>
          <p className="w-full h-52 bg-slate-100">post content</p>
          <div className="flex gap-3">
            <button className="border">Like</button>
            <button className="border">Comment</button>
          </div>
        </li>
        <li className="p-4 border space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-300"></div>
              <div className="flex flex-col">
                <div className="flex gap-1">
                  <h3>水桶裡的卯咪</h3>
                  <p>今天 00:02</p>
                </div>
                <p className="text-slate-500">Lv.10</p>
              </div>
            </div>
          </div>
          <p className="w-full h-52 bg-slate-100">post content</p>
          <div className="flex gap-3">
            <button className="border">Like</button>
            <button className="border">Comment</button>
          </div>
        </li>
      </ul>
    </div>
  );
}
export default Posts;
