import PropTypes from "prop-types";
import { modalIcons } from "../../assets/icons";
import CustomSelect from "../CustomSelect";
import TypeChart from "./TypeChart";

const TypeSection = ({
  filter,
  setFilter,
  options,
  savingsCount,
  typeData,
  customSelectRef,
}) => {
  const habitType = [
    { id: "to-do", name: "養成", color: "#B2B814" },
    { id: "not-to-do", name: "戒除", color: "#D14D28" },
  ];

  return (
    <div
      className={`space-y-4 rounded-xl bg-black-50 p-4 dark:bg-black-800 ${savingsCount === 0 ? "min-h-screen" : "h-fit"}`}
    >
      <div className="flex items-center justify-between">
        <div className="group relative flex flex-grow items-center">
          <h2 className="text-xl font-bold leading-7 text-black dark:text-black-0">
            類型總覽
          </h2>
          <modalIcons.TbInfoCircle className="ml-2 inline-block h-6 w-6 cursor-help text-black-500 dark:text-black-200" />
          <span className="pointer-events-none absolute left-[168px] top-0 z-50 w-fit -translate-x-0 transform whitespace-normal break-words rounded bg-primary-dark p-2 text-sm text-white opacity-0 transition-opacity before:absolute before:-left-4 before:top-7 before:-translate-y-full before:transform before:border-8 before:border-transparent before:border-r-primary-dark before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100">
            來看看你的習慣類型分布吧！你比較擅長養成還是戒除習慣呢？
          </span>
        </div>
        <div className="relative" ref={customSelectRef}>
          <CustomSelect options={options} value={filter} onChange={setFilter} />
        </div>
      </div>
      {savingsCount === 0 ? (
        <div className="space-y-2">
          <p className="text-center text-base font-normal leading-6 text-black dark:text-black-0">
            找不到相關的存款資料
          </p>
          <p className="text-center text-base font-normal leading-6 text-black dark:text-black-0">
            要不要試著培養一些習慣呢？
          </p>
        </div>
      ) : (
        <div>
          <div className="h-[400px] w-full">
            <TypeChart typeData={typeData} habitType={habitType} />
          </div>
          <ul className="space-y-2">
            {habitType.map((type) => (
              <li
                key={type.id}
                className="flex items-center justify-between rounded p-2 hover:bg-black-0 dark:hover:bg-black-600"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-full`}
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <p className="text-base font-normal leading-6 text-black dark:text-black-0">
                    {type.name}
                  </p>
                </div>
                <p className="text-lg font-bold leading-6 text-black dark:text-black-0">
                  {(
                    ((typeData[type.id] || 0) /
                      Object.values(typeData).reduce((a, b) => a + b, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
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
  customSelectRef: PropTypes.object.isRequired,
};
