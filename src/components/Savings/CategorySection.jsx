import PropTypes from "prop-types";
import { modalIcons } from "../../assets/icons";
import CustomSelect from "../CustomSelect";
import CategoryChart from "./CategoryChart";

const CategorySection = ({ filter, setFilter, options, savingsCount, categoryData, customSelectRef }) => {
  const habitCategories = [
    { id: 0, name: "生產力", color: "#FF6961" },
    { id: 1, name: "個人成長", color: "#FFB480" },
    { id: 2, name: "運動健身", color: "#FFE552" },
    { id: 3, name: "飲食健康", color: "#42D6A4" },
    { id: 4, name: "心靈成長", color: "#08CAD1" },
    { id: 5, name: "手作興趣", color: "#59ADF6" },
    { id: 6, name: "財務管理", color: "#9D94FF" },
    { id: 7, name: "環境生活", color: "#C780E8" },
  ];

  return (
    <div className={`p-4 bg-black-50 dark:bg-black-800 rounded-xl space-y-4 ${savingsCount === 0 ? "min-h-screen" : "h-fit"}`}>
      <div className="flex justify-between items-center">
        <div className="relative group flex items-center flex-grow">
          <h2 className="font-bold text-xl leading-7 text-black dark:text-black-0">類別總覽</h2>
          <modalIcons.TbInfoCircle className="w-6 h-6 text-black-500 dark:text-black-200 ml-2 inline-block cursor-help" />
          <span className="absolute top-0 left-[168px] transform -translate-x-0 w-fit p-2 bg-primary-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:top-7 before:-left-4 before:transform before:-translate-y-full before:border-8 before:border-transparent before:border-r-primary-dark whitespace-normal break-words">
            來看看你的習慣類別分布吧！哪些類別的習慣讓你累積最多存款呢？
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
            <CategoryChart categoryData={categoryData} habitCategories={habitCategories} />
          </div>
          <ul className="space-y-2">
            {habitCategories.map((category) => (
              <li key={category.id} className="p-2 rounded flex justify-between items-center hover:bg-black-0 dark:hover:bg-black-600">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: category.color }}></div>
                  <p className="font-normal text-base leading-6 text-black dark:text-black-0">{category.name}</p>
                </div>
                <p className="font-bold text-lg leading-6 text-black dark:text-black-0">
                  {(((categoryData[category.id] || 0) / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySection;

CategorySection.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  savingsCount: PropTypes.number.isRequired,
  categoryData: PropTypes.object.isRequired,
  customSelectRef: PropTypes.object.isRequired,
};
