function Home() {
  return (
    <div className="p-4 bg-slate-300">
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
  );
}
export default Home;
