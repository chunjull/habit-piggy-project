function Home() {
  return (
    <>
      <div className="p-4 bg-slate-300 mb-6">
        <div className="flex justify-between mb-3">
          <button>prev</button>
          <h1>September</h1>
          <button>next</button>
        </div>
        <div className="flex justify-between">
          <div className="w-1/7">Sun</div>
          <div className="w-1/7">Mon</div>
          <div className="w-1/7">Tue</div>
          <div className="w-1/7">Wed</div>
          <div className="w-1/7">Thu</div>
          <div className="w-1/7">Fri</div>
          <div className="w-1/7">Sat</div>
        </div>
      </div>
      <ul className="space-y-4 p-4">
        <li className="px-2 py-4 bg-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-yellow-400"></div>
              <div className="flex flex-col">
                <h3>規劃當日工作</h3>
                <p>每天</p>
              </div>
            </div>
            <button className="w-6 h-6">C</button>
          </div>
          <div className="flex justify-between">
            <div className="w-1/7">Sun</div>
            <div className="w-1/7">Mon</div>
            <div className="w-1/7">Tue</div>
            <div className="w-1/7">Wed</div>
            <div className="w-1/7">Thu</div>
            <div className="w-1/7">Fri</div>
            <div className="w-1/7">Sat</div>
          </div>
        </li>
      </ul>
      <button className="fixed right-4 bottom-20">add habit</button>
    </>
  );
}
export default Home;
