import CustomSelect from "../CustomSelect";
import TypeChart from "./TypeChart";
import { modalIcons } from "../../assets/icons";
import PropTypes from "prop-types";

const TypeSection = ({ filter, setFilter, options, savingsCount, typeData, habitType, customSelectRef }) => {
  return (
    <div className={`p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4 ${savingsCount === 0 ? "min-h-screen" : "h-fit"}`}>
      <div className="flex justify-between items-center">
        <div className="relative group flex items-center flex-grow">
          <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">類型總覽</h2>
          <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
          <span className="absolute top-0 left-[168px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
            來看看你的習慣類型分布吧！你比較擅長養成還是戒除習慣呢？
          </span>
        </div>
        <div className="relative" ref={customSelectRef}>
          <CustomSelect options={options} value={filter} onChange={setFilter} />
        </div>
      </div>
      {savingsCount === 0 ? (
        <div className="space-y-2">
          <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">找不到相關的存款資料</p>
          <p className="text-center font-normal text-base leading-6 text-black dark:text-black-0">要不要試著培養一些習慣呢？</p>
        </div>
      ) : (
        <div>
          <div className="w-full h-[400px]">
            <TypeChart typeData={typeData} habitType={habitType} />
          </div>
          <ul className="space-y-2">
            {habitType.map((type) => (
              <li key={type.id} className="p-2 rounded flex justify-between items-center hover:bg-black-0 dark:hover:bg-black-600">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: type.color }}></div>
                  <p className="font-normal text-base leading-6 text-black dark:text-black-0">{type.name}</p>
                </div>
                <p className="font-bold text-lg leading-6 text-black dark:text-black-0">{(((typeData[type.id] || 0) / Object.values(typeData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TypeSection;

TypeSection.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  savingsCount: PropTypes.number.isRequired,
  typeData: PropTypes.object.isRequired,
  habitType: PropTypes.array.isRequired,
  customSelectRef: PropTypes.object.isRequired,
};
